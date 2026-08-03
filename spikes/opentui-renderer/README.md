# Spike: a terminal renderer for Foldkit, on OpenTUI

An exploratory spike, not a package. Nothing here is published, imported by
Foldkit, or part of the pnpm workspace. It exists to answer one question and to
record what answering it taught us.

**Question.** Foldkit's view layer is snabbdom, whose `init()` accepts a custom
`DOMAPI`. Does snabbdom's diff/patch algorithm survive on a tree where
"elements" are [OpenTUI](https://github.com/anomalyco/opentui) `Renderable`s and
there is no real DOM?

**Answer: yes.** The spike imports Foldkit's own snabbdom from
`packages/foldkit/src/snabbdom` (not a copy, the live source) and drives an
OpenTUI renderable tree through mount, in-place text patching, keyed reordering,
mid-list insertion and removal, node replacement, prop updates, and inline
styled text. 14 tests, all asserting against real captured terminal frames.

The shim is ~170 lines. That is the headline: the seam is small. The hard part
of a terminal Foldkit is not the renderer.

## Running it

Requires [bun](https://bun.sh); OpenTUI is bun-first and its test harness uses
`bun:test`.

```bash
cd spikes/opentui-renderer
bun install
bun test          # 14 tests
bun run demo.ts   # prints three real terminal frames
bunx tsc --noEmit
```

`bun run demo.ts`, one tree patched twice:

```
1. initial mount            2. keyed reorder           3. remove + text patch
┌──────────────────────┐    ┌──────────────────────┐   ┌──────────────────────┐
│todo                  │    │todo                  │   │todo, one down        │
│  • alpha             │    │  • gamma             │   │  • gamma             │
│  • beta              │    │  • alpha             │   │  • beta              │
│  • gamma             │    │  • beta              │   │                      │
└──────────────────────┘    └──────────────────────┘   └──────────────────────┘
```

## Layout

| File                   | What it is                                                           |
| ---------------------- | -------------------------------------------------------------------- |
| `src/opentuiDomApi.ts` | The whole shim: ~16 `DOMAPI` methods over `Renderable`               |
| `src/nodes.ts`         | `box` / `text` / `span` / text node / comment node classes           |
| `src/modules.ts`       | Terminal replacements for the attributes/class/style modules         |
| `src/h.ts`             | A minimal terminal element vocabulary, standing in for `HtmlBuilder` |
| `src/mount.ts`         | Mirrors `vdom.ts` wiring with the terminal API swapped in            |
| `spike.test.ts`        | 14 tests against captured frames                                     |

## Background: why this was worth checking

Foldkit's core (Model, Message, update, Command, Subscription) is pure and
renderer-agnostic. Only the view and commit layers are browser-bound. So the
architecture is right for a second render target; the question was whether the
existing machinery could be pointed at one, or whether it would need replacing.

Three things suggested it could:

- `packages/foldkit/src/snabbdom/init.ts:117` already takes an optional
  `domApi: DOMAPI`.
- `DOMAPI` (`htmldomapi.ts:9`) is only ~16 methods: create, insert, move,
  remove, read siblings.
- OpenTUI's React reconciler
  (`@opentui/react/src/reconciler/host-config.ts:69-97`) implements the same
  operations as `parent.add(child)` / `parent.remove(child)` /
  `parent.insertBefore(child, before)`. Near 1:1 with what `DOMAPI` needs.

The React package itself is not reusable, since Foldkit does not use React, but
it was an excellent reference for the host operation surface and for how properties
get applied to renderables.

## Findings

### 1. The tree operations map essentially 1:1

`appendChild` → `parent.add(child)`, `removeChild` → `parent.remove(child)`,
`insertBefore` → `parent.insertBefore(child, ref)`. OpenTUI's `Renderable`
already has exactly the mutation surface snabbdom asks for. This was the main
risk and it evaporated.

Keyed diffing works properly, not merely visually: the reorder test asserts the
_same three renderable instances_ come back permuted. Moves are moves, not
teardown-plus-rebuild.

### 2. Inline styled text works, through a second tree

OpenTUI has two trees: `Renderable` (boxes, layout) and `TextNodeRenderable`
(inline runs), and the second can only hang off a `text` element. Mapping
`span` → `TextNodeRenderable` makes
`text({}, ['status: ', span({fg}, ['ok'])])` render and patch correctly,
including reordering spans within a line.

The cost is that `parentNode` has to lie slightly. Children of a `<text>` report
their parent as an internal `RootTextNodeRenderable`, so the shim unwraps it via
`.textParent` to hand snabbdom back the tree shape it built.

### 3. Text has nowhere to live outside `<text>`

`box({}, ['bare string'])` cannot work. There is no free-floating text
renderable in OpenTUI. The shim throws with a clear message, mirroring
`@opentui/react`'s "Text must be created inside of a text node".

**This is the finding with the largest API consequence.** In HTML,
`h.div([], ['hi'])` is idiomatic Foldkit. In a terminal it is an error. A
terminal `HtmlBuilder` would need to make that unrepresentable in the types, or
every app meets it at runtime.

### 4. Removal needs an explicit destroy, and snabbdom has the hook

Renderables own native resources, so a detached subtree must be destroyed, not
just unlinked. Snabbdom's module `destroy` hook fires _before_ the node is
unlinked, so destroying there pulls the node out from under its own removal.
Collecting into a queue and flushing in the `post` hook, after the patch has
committed, works and yields the same guarantee `@opentui/react` gets from
`detachDeletedInstance`. The test asserts `isDestroyed === true` on a removed
node.

### 5. Comment nodes need a stand-in, and a zero-size box is enough

`DOMAPI` requires `createComment`. OpenTUI has no equivalent. A
`width: 0, height: 0, visible: false` box holds the sibling position and paints
nothing; sibling arithmetic across it stays correct.

### 6. `TextRenderable.getChildren()` is a trap in @opentui/core 0.5.0

`TextRenderable` overrides `add`/`remove`/`insertBefore` to route into the
text-node tree, but does **not** override `getChildren()`, which still reports
the (always empty) renderable-tree children. A `<text>` renders visible text
while `getChildren()` returns `[]`.

The patch loop dodges this by accident: `nextSibling` reads `node.parent`, which
for anything inside a `<text>` is the internal `RootTextNodeRenderable`, whose
`getChildren()` is correct. Nothing asks a `TuiText` for its children during a
patch. But it caught this spike's own test helper immediately, and it will catch
anything that introspects the tree. The `childNodes` helper in
`src/opentuiDomApi.ts` exists for that. Already fixed on OpenTUI `main`
(`Text.ts:113`), so it is specific to 0.5.0.

### 7. Two things genuinely block a clean implementation

**`patch` is hardcoded.** `packages/foldkit/src/vdom.ts:18` is
`export const patch = init([...])` at module scope, with no `domApi` argument
and DOM-specific modules baked in. Nothing threads a renderer choice through; this
spike had to call `init()` itself. Making it configurable is a small,
self-contained change to `vdom.ts` plus its consumers.

**`DOMAPI` is typed in DOM terms.** Every signature says `HTMLElement`, `Node`,
`Text`, `Comment`. Nothing in the shim is a DOM node, so the boundary needs
exactly one `as unknown as DOMAPI` cast. Worse, the vendored snabbdom does not
typecheck at all without `"lib": ["DOM"]`; see this spike's `tsconfig.json`.
That is types-only, with no DOM at runtime, but an upstream terminal renderer
either keeps the DOM lib as a type-level dependency or `DOMAPI` gets genericised
over a node type. The latter is the cleaner fix, and it is mechanical rather
than deep.

### 8. The two vocabularies collide on names

`attributes` means "the DOM attribute bag" on one side and "the text style
bitmask (bold/italic/underline)" on the other. OpenTUI had it first, so the
shim's store is `domAttributes`. Minor in itself, but a signal that a terminal
builder should use terminal names rather than impersonating HTML.

### 9. Snabbdom reaches past the `DOMAPI` exactly once

`createElm` calls `element.setAttribute('id' | 'class', ...)` directly when the
selector carries a `#` or `.`, rather than going through the api. Every node
class therefore carries a `setAttribute` shim. Worth knowing before anyone
assumes `DOMAPI` is a complete abstraction boundary. It is one method short of
being one.

## What this does not answer

Deliberately out of scope, in rough order of effort:

- **Events.** No DOM events in a terminal. Keyboard and mouse come off the
  OpenTUI renderer and would need routing into the message queue, most likely as
  Subscriptions rather than through `eventListenersModule`.
- **The runtime.** `packages/foldkit/src/runtime/runtime.ts` is ~3800 lines with
  30 `document`, 11 `window`, 10 `history` and 4 `location` references,
  `container: HTMLElement`, and a `requestAnimationFrame`-based commit
  scheduler. This spike patched a tree directly and never touched any of it.
  **This is where the actual work is.**
- **The frame source.** `render/render.ts` and the `RenderCommit` signal are
  built on `requestAnimationFrame`. OpenTUI drives its own render loop.
- **The view vocabulary.** `h.div`, `h.Class`, CSS styles have no terminal
  meaning. A terminal `HtmlBuilder` is a from-scratch surface.
- **Everything DOM-typed at the edges.** `foldkit/dom`, `navigation`,
  `viewTransition`, `scrollLock`, Mount, CustomElement.

## Two shapes a real implementation could take

**A. DOMAPI shim (smaller).** What this spike does, productised: keep snabbdom,
add an OpenTUI `DOMAPI` and terminal modules, thread `domApi` / modules / frame
scheduler through as runtime configuration. Fastest path to something running.
Stays awkward around the DOM-typed signatures.

**B. Second render backend (cleaner, larger).** Extract the renderer-agnostic
core out of `runtime.ts` (message queue, update loop, Commands, Subscriptions,
ManagedResource lifecycle) and give the terminal its own view type and commit
path. This is the better design, and it forces a seam that would benefit the DOM
path too. It is also a substantial refactor of the largest file in the package.

## Conclusion

The renderer question is answered, and it was not the hard part. The patch
algorithm is portable, the seam is ~170 lines, and OpenTUI's tree API fits
`DOMAPI` almost exactly. Two small upstream changes, `init` accepting a `domApi`
and `DOMAPI` genericised over a node type, would make a terminal renderer
implementable from outside the framework entirely.

What remains is the runtime: separating the renderer-agnostic core from the
browser plumbing it currently sits inside. That is the real project, and this
spike does not shrink it. It establishes only that the work would pay off.
