# Candidate 3: one `produceBlock`, view presence read from the member type

Paths: `BASE` is `scratchpad/wt-base`, `C3` is `scratchpad/architect/candidate-3`. The type sketch is `C3/sketch.ts`. The working candidate source used by every probe is `C3/probes/fk/src/block/` (a copy of BASE `packages/foldkit/src` with this design applied; `produced.ts` there is the implementation of the sketch's types).

## Problem

`Block.makeDefinition` → `makeComposition` → `assembleBlock` returns a completed Block whose type is the result of a 12-overload generic call. A parent that only wants `ChildBlock.Model` still makes TypeScript resolve that call. The prototype `Definition.produceBlock(() => Composition.assembleBlock(...))` fixes the `.Model` read by taking `Model` from the Definition's type parameter and deferring every other member behind a naked `Producer` type parameter. It has three holes: viewless producers get a wrong default view member, a producer returning another Definition's Block is accepted at both levels, and no gate knows the API exists.

The constraints that make the shape non-obvious:

- `Producer` must stay naked and unconstrained, and nothing at the return position may depend on the producer's return type (grounding 1-4).
- View presence is a property modifier today (`[DefaultViewTypeId]: View` vs `?: never`), and modifiers are fixed when the interface is chosen. Only the implementation inside the thunk knows whether there is a view (grounding 7).
- Owner types cannot tell two same-id Definitions or shared-namespace siblings apart (grounding 18, 19).
- The produced Block must be the identical runtime object (grounding 20).

Probing this design also found a cost the grounding does not list: the prototype's inline expression-bodied thunk makes the producer itself about 6x more expensive to type than the same `assembleBlock` call written eagerly. Any non-`Model` read, and every full check of the producing file, pays it. The fix is part of this design (see Shape, decision 4).

## Usage (caller's view)

### Docs excerpt (core/block.md, "Publishing a completed Block")

A feature exports its completed Block by asking its Definition to produce it:

```ts
// packages/website/src/page/ui/block.ts
import { UiComposition } from './composition'
import { UiDefinition } from './definition'
import { init } from './init'
import { update } from './update'
import { view } from './view'

export const UiBlock = UiDefinition.produceBlock(() =>
  UiComposition.assembleBlock({ init, update, view }),
)
```

`produceBlock` runs the arrow once and returns the Block it assembles, unchanged. The difference is in the type: `UiBlock.Model` is `UiDefinition`'s Model Schema, so a parent that declares `uiPages: UiBlock.Model` does not make the editor infer the Ui page's Composition, view, or update. Bindings and Programs read the other members and see exactly the Block `assembleBlock` returned: with or without a view, with or without an OutMessage, including `provideHandlers` and `replaceEffectsLayer` results.

The arrow takes no parameters and returns a Block assembled from this Definition's Composition. Anything else is an error: a type error at the first Binding, Program, or `Block.AnyBlock` that uses the Block, and a runtime error when the module loads.

### Call sites

1. Parent Model reads the child Model Schema from the Block (Website, `model.ts`; this reverts the TIP line to the BASE form and drops `export { Model }` from `page/ui/index.ts`):

```ts
import { UiBlock } from './page'

export const Model = Schema.Struct({
  // ...
  uiPages: UiBlock.Model,
})
```

2. A viewless Block with an OutMessage. Same call shape, no flag, no second method:

```ts
export const SettingsBlock = SettingsDefinition.produceBlock(() =>
  SettingsComposition.assembleBlock({ init, update, EffectsLayer }),
)
// typeof SettingsBlock.OutMessage is SettingsOutMessage (from the Definition)
// SettingsBinding.embedView requires an explicit `view` (no default view)
// Program.makeElement({ block: SettingsBlock, ... }) is a type error
```

3. A chained producer:

```ts
export const EditorBlock = EditorDefinition.produceBlock(() =>
  EditorComposition.assembleBlock({ init, update, view, EffectsLayer, hostHandlers }).provideHandlers(EditorHandlers),
)
```

4. What a mistake looks like. `OwnDefinition.produceBlock(() => OtherAssembled)` compiles at the declaration; the first consumer reports (probed text, `C3/probes/cand/rejections.raw.ts:71`):

```
ParentDefinition.makeBinding(ForeignOtherId, { field: 'own' })
                             ~~~~~~~~~~~~~~
Types of property 'owner' are incompatible.
  Type 'Readonly<{ 'Block producer must return a Block completed from this Definition': "Other"; }>' is missing the following properties from type 'Owner<any, boolean>' ...
```

and loading the module throws `[foldkit] Block "Other" belongs to a different Definition. Definition "Own" produceBlock accepts only a Block assembled from its own Composition.`

5. A generic factory that holds only a Composition is unchanged: `return composition.assembleBlock(implementation)` under its explicit `Completed<Item>` interface.

## Shape

### Data structures

- **One method, on `AuthoringDefinition` only**: `produceBlock: <Producer>(produce: Producer) => ProducedBlock<Owner<Id, Concrete>, ModelSchema, OutMessageSchema, Producer>`. `Block.Definition`, `Base` and `Composition` do not gain it.
- **Two public interfaces, chosen by the Definition's OutMessage Schema** (`ProducedBlockWithOutMessage`, `ProducedBlockWithoutOutMessage`) behind the `ProducedBlock` selector. The selector reads only `OutMessageSchema`, a Definition type parameter, so it never types the producer (grounding 3, 6). `Model` is declared directly as the Definition's `ModelSchema` (grounding 2).
- **Every other member is one derived mapped base**, `ProducedMembers`, homomorphic over `keyof CompletedBlockWithViewAndOutMessage<any, …>` and filtered with `as` to drop `Model` and `OutMessage`. The inventory is therefore derived from the completed Block contract, not copied (grounding 11, per encode-lessons-in-structure). The homomorphic mapping keeps each member's TSDoc (probed). Each member is `ProducedMember<Owner, Model, Producer, Key>`, a deferred conditional that the checker evaluates only when a consumer reads that member.
- **One verdict per producer**, `ProducerVerdict<Owner, Model, Producer>`, referenced only from member types. It is either `{ completed: Completed }` or a named error record (`NotABlockProducer`, `ForeignBlock<Id>`, `EnrichedBlock<ExtraKey>`). The checker caches it per (Owner, Model, Producer), so the 18 members share one evaluation.

### Load-bearing decisions

1. **View presence moves from the property modifier to the property type, for every completed Block.** `NoDefaultView` becomes `readonly [DefaultViewTypeId]: undefined` (was `?: never`). Every completed Block now has a required default-view member whose type is the authored view or `undefined`. That turns the view dimension into an ordinary member, so the produced Block carries it as `Completed[typeof DefaultViewTypeId]` like any other member, and the four completed shapes collapse to two produced interfaces with no view flag and no second entry point (per redesign-from-first-principles). Supporting edits, all type-only and all inside `packages/foldkit/src/block`: `AnyBlock`'s member accepts `undefined`, and `DefaultViewOf` infers `View extends AnyAuthoredView`. The two `embedView` selectors (`binding.ts:1059`, `keyedBinding.ts:316`) need no change because their `infer … extends AnyBlockView` patterns already reject `undefined`. `DefaultViewTypeId` is `@internal` and used only in those four places. I chose `undefined` over `never` because `never` satisfies every `infer X extends …` pattern, so a future consumer pattern would silently treat a viewless Block as viewful.
2. **The foreign-producer guard is lazy at the type level and exact at runtime.**
   - Type level: the verdict compares the produced Block's `owner` and `Model` with the Definition's by mutual assignability (the `ValidateViewOwner` pattern, `definition.ts:1670-1679`). Errors land at the first consumer of a non-`Model` member (grounding 15, 17).
   - Runtime: `assembleBlock` registers each Block in a new `blockOrigins` WeakMap under its Definition's inner runtime definition. That object is the `authoring` argument every Composition-level `makeDefinition` already receives, and `replaceEffectsLayer` and `provideHandlers` re-enter the same closure. `produceBlock` moves from `makeNamespace` into `makeBaseDefinition`, where that same object is in scope, and compares by identity. This is per Definition, not per namespace, so it rejects same-id Definitions and shared-namespace siblings that the types cannot separate (grounding 21, 22; probed).
3. **Invalid producers are rejected by the same verdict.** It rejects a `never` producer, a non-function, a function with required parameters (`Producer extends () => infer Completed`, not `(...args) => …`), an `any` return, a `never` return (the erased overload 7), a return without `owner`/`Model`, and extra keys (an enriched Query or Toast Block). The last rule turns the prototype's silent member drop into an error that says to add members after producing (grounding 13, 24). The runtime mirrors the cheap checks: non-function, `produce.length > 0`, non-Block return.
4. **`assembleBlock`'s generic returns, and the `replaceEffectsLayer` / `provideHandlers` returns, are wrapped in `NoInfer`.** In `produceBlock(() => C.assembleBlock(...))`, the call's contextual type is the arrow's own inferred return type. Every overload attempt then runs return-type inference against the completed Block.
   - Probed cost without `NoInfer`, for this design and the prototype alike: +667k instantiations per produced Block in a TS 7 full check, and 776,580 against 112k instantiations for a consumer reading `.init`.
   - With `NoInfer`: +4.9k and 116,496.
   - `NoInfer` return types are an existing Foldkit idiom (`DefineStep`, `fieldStep`, `Update.combine`). Arguments always supply candidates for `assembleBlock`'s type parameters, so return-type inference never decided a result. Removing it changes cost, not results (probed: every fidelity assertion still holds).
5. **`produceBlock` returns the identical object** (grounding 20). The runtime check reads the WeakMap and wraps nothing.

### Data flow

`Block.makeDefinition('Ui', {...})` → `AuthoringDefinition<'Ui', M, Msg, undefined, true>` → `UiDefinition.produceBlock(thunk)` infers `Producer = typeof thunk` without typing its body. The result is `ProducedBlockWithoutOutMessage<Owner<'Ui', true>, M, typeof thunk>`.

- `UiBlock.Model` is `M`, with no verdict and no producer typing. Measured: 2,741 instantiations against 2,536 for a plain Definition read and 111,394 for an eager Block.
- `makeBinding(UiBlock, …)` checks `BindableBlock` member by member. The first member read evaluates `ProducerVerdict` once, which types the thunk (about 112k, the same as the eager Block), and each member is then an indexed access.

### Validation, ownership, interface depth

The public surface is one method and three exported types, replacing the prototype's five. The method hides:

- shape selection across four completed shapes;
- chained results;
- a five-way producer validation;
- an exact runtime identity check;
- the deferral itself.

The caller makes no choices: no flag, no type argument, no second method. Validation sits at two boundaries. One is the produced member types, which every consumer must read. The other is the `produceBlock` call at runtime. Bindings, Programs and the server are unchanged and trust ordinary member types (per boundary-discipline).

### What it deliberately does not do

- It does not report a foreign producer at the `produceBlock(` line during type checking. No mechanism fires there without making `.Model` eager. A produced Block that nothing consumes reports only at runtime.
- It does not distinguish two Definitions whose owner and Model types are identical at the type level, because their types are not lying. The runtime does distinguish them.
- It does not preserve factory-added members. It rejects them.
- It does not change generic factories, Query, Toast, or `Block.Definition` / `Base` annotations.

### Story for `assembleBlock`, public `Block.Model`, Composition-only factories

- **`assembleBlock`** stays the one completion operation; `produceBlock` publishes its result. Rule for the end state: an exported module-level Block constant is produced; local, test, and factory-internal Blocks call `assembleBlock` directly. The migration PR adds a lint rule, `foldkit/produce-exported-block`, that flags `export const X = <owned Composition>.assembleBlock(...)` and names the fix. It lands with the codemod, not in the first implementation, which would otherwise flag about 100 unmigrated sites. AGENTS.md's "keep a named Definition only when code uses Definition authoring members" then keeps a Definition for every exported Block, because `produceBlock` is such a member.
- **Public `Block.Model`**: a produced Block's `Model` is the cheap canonical path. The TIP guidance that lets a feature barrel re-export its `Model` for parent Schema construction becomes a second way to get the same Schema. For a produced feature, the barrel drops the re-export and parents read `ChildBlock.Model`. The first implementation does exactly this for Ui (BASE `model.ts:47` form, and `export { Model }` removed from `page/ui/index.ts`), and that line is also the editor-latency control (grounding 36). The migration removes the remaining re-exports and the AGENTS.md paragraph.
- **Composition-only factories** (the 8 `makeBlockParts` factories, Toast `makeFixture`, `slider.forRoot`, `blockGenericFactory.ts`, the UI `author(composition)` test) stay on `assembleBlock` with their explicit `Completed<…>` interfaces. Their exported value is a function, so there is no call result for a parent to defer. The UI emitted-text gate's `Combobox.Completed<…>` strings are unaffected. The exported `ProducedBlockWith*` interfaces would let a follow-up rebuild `Completed<Item>` on a Definition-sourced Model without new API, but only after measuring it.

### Migration of the remaining sites (not in the first implementation)

| Census class | Count | Transform |
|---|---|---|
| Unannotated module-level `export const X = C.assembleBlock(...)` | 104 | Wrap: `XDefinition.produceBlock(() => C.assembleBlock(...))`. Where the Definition is inlined (`Block.makeDefinition(...).makeComposition()`), split out a named `XDefinition` first. Mechanical codemod |
| Annotated `Block.CompletedWithViewAndOutMessage<…>` (popover, dialog, datePicker) | 3 | Drop the annotation and wrap |
| `return composition.assembleBlock(...)` in generic factories | 10 | Unchanged |
| Local consts (Query ×4, Toast fixture, devtools overlay, 4 snippets) | 10 | Unchanged; Query and Toast enrichment is rejected by design |
| Exported chained results (`replaceEffectsLayer`, `provideHandlers` in 2 snippets) | 2 | Wrap when the snippet holds the Definition; otherwise unchanged |

## Gates and fixtures

1. **Core declaration gate**: new `checks` entry `produced-block` modeled on TIP's `schema-boundary`.
   - `declaration-tests/produced-block-blocks.ts`: the seven Blocks of `C3/probes/cand/shapes.ts` (A view; B viewless; C view and OutMessage; D viewless and OutMessage; E `replaceEffectsLayer`; F host handlers; F `provideHandlers`), each produced and assembled.
   - `produced-block.accepted.ts`: per Block, the tuple `[Equal<keyof P, keyof A>, all members Equal, Equal<Pick<P, keyof P>, Pick<A, keyof A>>, P extends Block.AnyBlock]` equals `[true, true, true, true]`; `Model` equals the Definition's; `Parameters<embedView>` equal between produced and assembled Bindings; a canonical `embedView` call without `view`; `Program.makeElement` with a produced view root. Equality helpers are imported from `schema-boundary-equality.ts`.
   - `produced-block.consumer.ts`: byte-identical to accepted.
   - `produced-block.rejected.ts`: the 16 directives of `C3/probes/cand/rejections.ts`, each on the line where the probe reports it. That covers foreign id, same Model under another id, same id with another Model, `never`, erased, non-function, a required parameter, `any`, enriched, two `AnyBlock` annotations, a foreign Program root (directive above `Program.makeElement(`, which also reports TS2589), a viewless Program root, a viewless canonical `embedView`, and an erased and a non-function Program root.
2. **Compile-time and runtime tests**: `src/block/produceBlock.test.ts` with `expectTypeOf(Block.Model)` checks and the twelve runtime cases of `C3/probes/runtime/runtime.mjs` as `Reflect.apply(...)` plus `toThrow(...)`, in `compositionSafety.test.ts` style.
3. **Block type performance**: add the `produced-composition-8` fixture (`C3/probes/perf/produced-composition-8.ts`, deep-composition-8 with all ten Blocks produced inline) to `fixtures.json`, budget from `pnpm update:block-type-performance produced-composition-8`. It is the gate for decision 4: in the probe harness, removing `NoInfer` moves it from 643,309 to 1,399,481 instantiations. The three existing ceilings are re-measured and must not rise (probe harness: +20, −130, +4 instantiations; see risks). A README section gets before and after tables.
4. **oxlint**: `isCompletedBlockVariable` accepts an owned `produceBlock` call. Rule tests: `got-block-message-name` with a same-file produced `X.Message`, and `no-child-message-construction-in-root` with a produced root.
5. **Editor latency**: `profile-block-language-service.ts` unchanged. The control is the reverted Website `model.ts` line `uiPages: UiBlock.Model`, which sits inside the workload hash.
6. **Release**: `minor` changeset for `foldkit` (new `Definition.produceBlock` and three types). Public exports drop the five prototype types. TSDoc on all three types and the method. Website docs and a `packages/website/src/snippet/blockProduceBlock.ts` snippet land with the migration, when the produced form becomes the documented default.

## Synthesis decision

## Tradeoffs accepted

- We accept changing the completed Block's internal default-view member from `?: never` to required `undefined` for every viewless Block, in exchange for one entry point with no view flag and no declaration-mismatch class. The member is `@internal` and type-only; nothing outside `packages/foldkit/src/block` names it.
- We accept `NoInfer<…>` around every `assembleBlock` result type, visible in hovers and emitted `.d.ts` (`() => NoInfer<Block.CompletedWithView<…>>`), in exchange for removing a 6x typing cost from produced Blocks. Emitted Foldkit types already print `NoInfer<…>` around `makeInit` results.
- We accept type errors that land at the first consumer of a non-`Model` member, not at `produceBlock(`, in exchange for keeping the `.Model` read cheap. A produced Block that nothing consumes is caught only at module load.
- We accept rejecting enriched Blocks (Query, Toast) at the type level in exchange for a produced type that never silently drops members.
- We accept a TS2589 "excessively deep" diagnostic beside the overload error when a foreign produced Block is used as a Program root. Both diagnostics land on the same line. Erased and non-function roots report only the overload error.
- We accept that `ProducedBlockWith*` are public types a factory could hand-write against, because emitted declarations must name them (TS2742 otherwise).

## Alternatives considered

- **Two entry points, `produceBlock` and `produceViewlessBlock`, keeping view presence in the modifier.** It is exact without touching completed Blocks, but it doubles the surface. Every author and the codemod must classify each site, and a wrong choice needs a second lazy guard that reports far from the cause. It exposes the modifier problem to callers instead of removing it.
- **A view flag or type argument** (`produceBlock({ view: true }, thunk)` or `produceBlock<'View'>(thunk)`). Same mismatch class as above, more ceremony at 132 sites, and the flag duplicates information already in the implementation.
- **Optional `[DefaultViewTypeId]?: Member` on the produced Block, with consumers reading the type.** It needs the same consumer edits as decision 1 plus `Exclude<…, undefined>` at each read. It also leaves produced and assembled Blocks with different modifiers on 117 of 132 sites, the viewful ones.
- **Required `never` for viewless Blocks.** It works with today's `DefaultViewOf` but needs `[V] extends [never]` guards in both `embedView` selectors. `never` also satisfies every future `infer … extends X` pattern, which would silently give a viewless Block a canonical view.
- **A hand-listed produced interface with a drift fixture** (the prototype's `ProducedBlockFields` plus an `Equal<keyof …>` gate). Two lists kept in sync by a gate, against one derived list. This design's `.Model` read measured +192 instantiations over the prototype's hand list (mapped base and Owner threading together, not separated).
- **A block-bodied producer** (`produceBlock(() => { const block = C.assembleBlock(...); return block })`) instead of `NoInfer`. It is as cheap as the eager call (probed: 6,653,601 against 6,654,144 instantiations), but it relies on authors never writing the natural one-line arrow. An agent would collapse it.

## Implementation reconciliation

## Open questions and risks

- Do the real `check:block-type-performance` ceilings move? The probe harness (emitted declarations, TS 7.0.2, but deltas about 270k below `budgets.json`, so not the same setup) shows deep +20 / wide −130 / command +4 instantiations and +21 / +5 / +5 Types against the prototype. This design without `NoInfer` (fkplain) moved wide by +14k; `NoInfer` brought it back. If a ceiling rises in the real gate, should the fallback be keeping real Blocks at `?: never` and giving only produced viewless Blocks a required `undefined`? That gives up modifier fidelity for viewless produced Blocks, while behavior stays equal.
- Does wrapping `assembleBlock` returns in `NoInfer` change any emitted text that a gate asserts? The UI gate asserts `Combobox.Completed<…>` strings, which are explicit interfaces and should not change. Neither the relocated consumer compile nor `skipLibCheck: false` has been run.
- Should `Block.Definition`-annotated Definitions also offer `produceBlock`? Constraint 26 leaves it off; no site needs it today.
- Is TS2589 on a foreign Program root acceptable as-is, or worth a `ValidatePresentProgramBlock` style pre-check? It is an error path only.
- Should a produced Block's hover show its producer? It does today, and printing the producer types it. That is a cost of hovering the Block itself, not of reading `.Model`.

## Next implementation step

Apply `C3/probes/fk/src/block/{produced,define,definition,defaultView,public}.ts` (the probed state) to a worktree from d8626087d, add the `blockOrigins` registry and `produceOwnedBlock`, then build and run the new `produced-block` declaration check before anything else.

## Probes

Every probe is in `C3/probes/`. `TSC` is `/home/mrwe1@office.begasoft.ch/projects/foldkit/foldkit/node_modules/.pnpm/typescript@7.0.2/node_modules/typescript/bin/tsc`, and `TS6` is the `typescript@6.0.3` package in the same store, used for its JS API. Variants:

- `fk`: this design.
- `fkbase`: the prototype, BASE src.
- `fkorig`: 65d1cd9c, without `produceBlock`.
- `fkplain`: this design without `NoInfer`.

`cand/` resolves `foldkit` to `fk` and `base/` to `fkbase`, both from source. `pkg-*` serve the emitted `.d.ts` of each variant. Errors inside the copied sources (`import.meta.hot`, `vitest`) are filtered out.

1. Shapes: `cd C3/probes/cand && $TSC -p tsconfig.json` (strict, `exactOptionalPropertyTypes`), plus `tsconfig.loose.json` with it off.
   - `fk`: 0 diagnostics in `shapes.ts` in both modes. Every fidelity tuple is `[true, true, true, true]` for A to F, both `embedView` parameter equalities hold, the canonical `embedView` call compiles, and the produced Program root compiles.
   - `fkbase` (same file, `base/`): `shapes.ts(124,32)` and `(126,32)`, `Type 'false' does not satisfy the constraint 'true'`. That is FidelityB and FidelityD, the two viewless shapes.
2. Rejections: `$TSC -p tsconfig.rejections.json` and `tsconfig.rejections.loose.json`.
   - `fk`: 0 diagnostics with all 16 directives used, in both modes. `rejections.raw.ts` (directives removed) shows each error at the consumer line with the record text, for example `'Block producer must return a Block completed from this Definition': "Other"` and `'Block producer must return the completed Block itself. Add members after produceBlock': "extra"`. The foreign Program root adds TS2589 on the call line.
   - `fkbase`: 8 directives unused (TS2578 at lines 70, 72, 74, 82, 84, 86, 89, 94): the three foreign cases, the required parameter, `any`, enriched, the foreign `AnyBlock`, and the foreign Program root.
3. Deferral: `cd C3/probes/deferral && node measure.mjs $TS6/package.json $PWD <variant>`. Semantic check of the consumer file only.

   | consumer reads | fk | fkbase | fk without NoInfer |
   |---|---|---|---|
   | plain Definition `.Model` | 2,536 | 2,536 | 2,536 |
   | eager Block `.Model` | 111,394 | 111,392 | 111,392 |
   | produced `.Model` | 2,741 | 2,549 | 2,741 |
   | eager Block `.init` | 111,607 | — | 111,605 |
   | produced `.init` (inline thunk) | 116,496 | 776,047 | 776,580 |
   | produced `.init` (separately declared thunk) | 112,336 | — | 112,286 |

4. Full check of the producing file, TS 7: `full.{eager,inline,separate,inline-const}.ts` with `--extendedDiagnostics`. The totals include checking the Foldkit sources.
   - eager: fk 6,654,558; fkbase 6,653,901.
   - inline: fk 6,659,493; fkbase 7,320,641.
   - separate: fk 6,655,333; fkbase 6,654,093.
   - block-bodied inline (fkplain): 6,653,601.
5. Block type performance against emitted declarations: `cd C3/probes/perf`, the `run` helper in this session, `files: [fixture]`, `skipLibCheck`. `baseline.ts` is 1,841 instantiations in every variant.

   | fixture (instantiations / Types) | fkorig | fkbase | fk | fkplain |
   |---|---|---|---|---|
   | deep-composition-8 | 879,812 / 47,498 | 879,812 / 47,500 | 879,832 / 47,521 | 879,962 / 47,500 |
   | wide-composition-100 | 1,963,773 / 76,279 | 1,963,773 / 76,281 | 1,963,643 / 76,286 | 1,977,815 / 76,281 |
   | command-requirements-200 | 912,838 / 68,871 | 912,838 / 68,873 | 912,842 / 68,878 | 912,704 / 68,873 |
   | produced-composition-8 | — | 1,389,583 / 144,844 | 643,309 / 48,306 | 1,399,481 / 145,290 |

   The prototype's `AuthoringDefinition` member does not move the three existing fixtures (fkorig against fkbase: identical instantiations, +2 Types).
6. Runtime: `cd C3/probes/runtime && node runtime.mjs`. This runs the BASE built JS copied into `fkdist` and patched with the sketch's runtime: `identity.js` registry, `definition.js` `produceOwnedBlock` and registration, `define.js` without its own `produceBlock`. Results:
   - Accepted: own Block (identical object), default view still registered, a second Composition of the same Definition, `replaceEffectsLayer` result, enriched own Block.
   - Throws: foreign id, same id from a separate `makeDefinition`, shared-namespace sibling with the same Model, non-function, a producer with a parameter, a non-Block return.
   - Composition has no `produceBlock`.
   - The unpatched prototype accepts the foreign Block (`SP/how/probe/runtime.mjs`).
7. Emission: `cd C3/probes/cand && $TSC -p tsconfig.emit.json` (`declaration`, `noEmitOnError`). No diagnostics. `emit-out/emit.d.ts` prints `Block.ProducedBlockWithoutOutMessage<Block.Owner<"EmitView", true>, Schema.Struct<…>, () => NoInfer<Block.CompletedWithView<…>>>` and `Block.ProducedBlockWithOutMessage<…, () => NoInfer<Block.CompletedBlockWithOutMessage<…>>>` with bare `foldkit/*` and `effect/*` specifiers. Not run: relocation into a consumer, `skipLibCheck: false`.
8. TSDoc through the mapped base: `node deferral/docs.mjs $TS6/package.json deferral/blocks.ts` prints the template docs for `init`, `update` and `bindings`. `Model` printed empty in the probe; the sketch adds its TSDoc.

Not probed:

- the native LSP benchmark;
- the real declaration gate, relocation, and `skipLibCheck: false`;
- the real perf harness numbers;
- oxlint behavior;
- the UI emitted-text gate;
- runtime under the real TypeScript build, as opposed to patched JS;
- Website typecheck.

## Constraint coverage

1. Handled: `produceBlock<Producer>(produce: Producer)` is unchanged; probe 3 shows `.Model` at 2,741 instantiations.
2. Handled: `Model: ModelSchema` comes from the Definition's type parameter (probe 3).
3. Handled: the return selector reads only `OutMessageSchema`; the verdict is referenced only from member types.
4. Handled: no parameter-level check; validation lives in members.
5. Handled: two interfaces cover the OutMessage axis, and the view axis is a member type (probe 1: all four shapes exact, including modifiers via `Pick` equality).
6. Handled: OutMessage presence comes from the Definition (probe 1 C, D).
7. Handled: view presence comes from the required member's type after decision 1. It needs no flag or entry point, and `embedView`, `DefaultViewOf` and Program behave as for assembled Blocks (probes 1, 2).
8. Handled: probes 1 and 2 pass with `exactOptionalPropertyTypes` on and off.
9. Handled: there is no view declaration, so there is no mismatch class.
10. Handled: keys, per-member types (including `provideHandlers: never` and the required `__blockHandlerRequirements`) and modifiers are equal (probe 1).
11. Handled: the inventory is derived from `keyof CompletedBlockWithViewAndOutMessage<any, …>`; the accepted fixture also asserts it.
12. Handled: the four interfaces, `CompletedWithView` (overload 5), and the `Block<…>` intersection from `replaceEffectsLayer` and `provideHandlers` are all exact (probe 1 A, E, F).
13. Handled: `never`, non-function, erased, required parameter and `any` are rejected (probe 2). Rejecting `any` is a deliberate decision.
14. Handled: foreign producers are rejected at the type level (probe 2) and at runtime (probe 6).
15. Handled: per-member mutual owner and Model comparison. Binding-site cost measured as part of a produced `.init` read: 116,496 against 111,607 eager.
16. Handled: `Owner<Id, Concrete>` is threaded from `AuthoringDefinition`.
17. Handled: errors land on the consumer's Block argument (Binding), the call line (Program), or the declaration (`AnyBlock`), all with readable record text. Call-site errors are explicitly not attempted.
18. Accepted: the type level accepts same-id, same-Model Definitions and `Owner<string, false>` pairs with equal Models, because their types are identical. The runtime rejects them (probe 6).
19. Accepted at the type level, handled at runtime: shared-namespace siblings throw, because origin is per Definition (probe 6).
20. Handled: the identical object is returned and the default view stays registered (probe 6).
21. Superseded: the runtime compares origin identity, which is stronger than owner and Model identity.
22. Handled: the origin is the inner runtime definition `assembleBlock` already receives as `authoring`, and `produceBlock` moves to `makeBaseDefinition`, where it is in scope. Chained results re-enter the same closure (probe 6).
23. Handled: messages follow the `assertBindingParentContracts` style and are tested with `Reflect.apply` and `toThrow`.
24. Handled: enriched Blocks are rejected with a message to add members after producing. Query and Toast stay unproduced.
25. Accepted: Composition-only factories stay on `assembleBlock` with their explicit `Completed` interfaces. The UI emitted-text gate is unaffected. A follow-up path exists through the exported produced interfaces.
26. Accepted: `Block.Definition` and `Base` are not widened.
27. Handled: the Model comparison separates Toast payloads at the type level, and runtime origin separates Slider's two Definitions.
28. Handled: `isCompletedBlockVariable` accepts `produceBlock`, with rule tests.
29. Handled: a rule test with a produced root; no rule change is expected.
30. Handled: there are no casts in consumer code, `any` appears only in `src`, there is TSDoc on every public export, and the stale `ProducedCompositionBlock` TSDoc is deleted with the type.
31. Handled: the `produced-block` check is designed, with accepted, consumer and rejected files whose cases come from probes 1 and 2.
32. Handled: directive lines come from probe 2's observed error lines. Helpers are imported from `schema-boundary-equality.ts`, which the accepted file reaches.
33. Partly handled: emission is portable and names only public types (probe 7). Relocation and `skipLibCheck: false` remain for the gate.
34. Handled: `produceBlock.test.ts` with type and runtime cases.
35. Handled with risk: the `produced-composition-8` fixture is designed. The existing fixtures moved by +20 / −130 / +4 in the probe harness; open question 1 covers the real ceilings.
36. Handled: Website `model.ts` reads `UiBlock.Model` again, which is the control inside the workload hash.
37. Accepted as process: rebuild before every gate. The probes here used private copies and no shared `dist`.
38. Handled: the design rebases on 9a5f9307. It keeps `schema-boundary` and reuses its equality helper, and Website `model.ts` and `page/ui/index.ts` are edited for Ui only.
39. Handled: `minor` changeset; three exports replace five; docs and snippet land with the migration; full `pre-push`.
