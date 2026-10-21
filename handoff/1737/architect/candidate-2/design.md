# Candidate 2: produceBlock and produceHeadlessBlock

Two entry points on the Definition, chosen by view kind. `owner`, `Model` and `OutMessage` come from the Definition. Every other member is one cached verdict about the producer. A per-Definition mark makes the runtime check exact. The producer is a named function.

Files: `sketch.ts` (module map, signatures, runtime and tooling stubs), `sketch/produced.ts` (the type implementation, compiled and probed), `sketch/fixtures/` (declaration fixtures that pass the gate's three compiles), `probes/` (every probe, rerun with `probes/run-all.sh`).

## Problem

`Definition.produceBlock(() => Composition.assembleBlock(...))` lets a parent read `UiBlock.Model` without checking the Block's implementation. The prototype has three holes. It always claims a default view, so a headless producer gets a lying `[DefaultViewTypeId]`. It accepts a Block from another Definition. No gate, fixture or lint rule knows it exists.

Three constraints shape every answer.

- Only the Definition's own type parameters can be read without checking the producer. That gives `owner`, `Model` and whether an `OutMessage` exists. It cannot give whether a view exists (constraints 5 to 7).
- The deferral breaks if anything at the call looks at the producer's return type: a constraint, a contextual signature, a parameter-level guard (constraints 1 to 4).
- Errors can only appear where a consumer reads a member that is not `Model`.

One finding changes the authoring form. Inferring the unconstrained producer type from an arrow function written inside the call makes TypeScript check the Block about 7 times over (details under Shape). The same function declared by name checks once. The design therefore asks for a named producer and enforces it with a lint rule.

## Usage (caller's view)

### Authoring a Block with a view

```ts
// page/ui/block.ts
import { UiComposition } from './composition'
import { UiDefinition } from './definition'
import { init } from './init'
import { update } from './update'
import { view } from './view'

const assembleUi = () => UiComposition.assembleBlock({ init, update, view })

export const UiBlock = UiDefinition.produceBlock(assembleUi)
```

`produceBlock` is for a Block with a default view. `produceHeadlessBlock` is for a Block without one. The Definition decides whether an OutMessage exists, so there are four shapes and two methods.

```ts
const assembleEditor = () =>
  EditorComposition.assembleBlock({ init, update, hostHandlers: [SaveDocument] })

export const EditorBlock = EditorDefinition.produceHeadlessBlock(assembleEditor)

const provideEditorHandlers = () => EditorBlock.provideHandlers(SaveDocumentLayer)

export const editor = EditorDefinition.produceHeadlessBlock(provideEditorHandlers)
```

A chained result such as `replaceEffectsLayer(...)` or `provideHandlers(...)` is an ordinary producer.

### Reading the Model in a parent

```ts
// model.ts
export const Model = Schema.Struct({ uiPages: UiBlock.Model, ... })
```

`typeof UiBlock.Model` is `typeof UiDefinition.Model`. Reading it, or `UiBlock.owner`, or `UiBlock.OutMessage`, never checks `assembleUi`.

### What goes wrong, and where it shows

A producer from another Definition, a `never` or `any` producer, a function that requires arguments, a Block with the wrong view kind: the result stays usable for `Model`, `owner` and `OutMessage`. The first consumer that reads anything else fails. Probe output:

```
Types of property 'Message' are incompatible.
  Property 'Type' is missing in type 'Readonly<{ "The producer returned a Block from a different Definition.": never; }>'
    but required in type 'Readonly<{ Type: any; }>'.
```

`produceHeadlessBlock(assembleViewBlock)` reports `produceHeadlessBlock needs a Block without a default view. Use produceBlock for a Block with one.` The same mistakes also throw when the module loads, with the Definition and Block ids in the message:

```
[foldkit] Definition "Own" produceBlock received a Block assembled for a separate Definition that is also named "Own". Return a Block that a Composition of "Own" assembled.
```

### A generic factory that owns a Definition

```ts
// ui/src/listbox/single.ts, after
export interface Completed<Item extends string>
  extends Block.ProducedBlockWithViewAndOutMessage<
    Block.Owner<'Listbox', true>,
    typeof Model,
    ItemOutMessage<Item>,
    () => Block.CompletedWithViewAndOutMessage<Parts<Item>['composition'], Parts<Item>['implementation']>
  > {}

export const makeBlock = <Item extends string>(config: Config<Item>): Completed<Item> =>
  Definition.produceBlock(makeAssemble(config))
```

The producer is written as a function type, so the interface heritage does not instantiate the factory. In a simplified probe, `Completed<'Apple' | 'Pear'>['Model']` costs 281 instantiations. The interface that extends the completed Block directly costs 83,013.

### Migrating the other sites

```ts
// before
export const ChildBlock = ChildComposition.assembleBlock({ init, update, view })

// after, written by packages/foldkit/scripts/codemod-produce-block.ts
const assembleChild = () => ChildComposition.assembleBlock({ init, update, view })
export const ChildBlock = ChildDefinition.produceBlock(assembleChild)
```

The codemod picks `produceBlock` when the implementation has a `view` property and `produceHeadlessBlock` when it does not. It prints every site it cannot resolve.

## Shape

### Data structures

`packages/foldkit/src/block/produced.ts` exports six names and keeps the rest private.

- `ProducedBlockKind = 'View' | 'Headless'`.
- Four interfaces, named like the existing `CompletedBlock*` shapes: `ProducedBlockWithViewAndOutMessage`, `ProducedBlockWithView`, `ProducedBlockWithOutMessage`, `ProducedBlockWithoutViewOrOutMessage`. Each takes `OwnerValue`, `ModelSchema`, an OutMessage Schema when it has one, and `Producer`.
- `ProducedBlock<Kind, OwnerValue, ModelSchema, OutMessageSchema, Producer>` selects one of the four. The two Definition methods return it. A generic wrapper that cannot name the shape uses it too.

Inside, one rule per member.

| member | where it comes from |
|---|---|
| `owner`, `Model` | the Definition's type parameters, directly |
| `OutMessage` | the Definition's OutMessage Schema, or `OutMessage?: never` |
| `[DefaultViewTypeId]` | the producer when the kind is `'View'`, otherwise `[DefaultViewTypeId]?: never` |
| the other 16 contract members | `ProducedMember<CheckedProducer<...>, Key>` |

`ContractKey` is `Exclude<keyof AnyBlock, 'owner' | 'Model' | 'OutMessage' | typeof DefaultViewTypeId>`. `AnyBlock` already lists every key a Block has, so adding a member to the Block contract needs no second edit here. The accepted fixture asserts `Equal<keyof Produced, keyof Assembled>` and a per-member `Equal` for all four shapes, so drift fails the build. This replaces the prototype's hand-copied member list (constraints 10 and 11).

### One verdict per producer

`CheckedProducer<Kind, OwnerValue, ModelSchema, OutMessageSchema, Producer>` is a plain type alias. It returns either `Readonly<{ completed: Completed }>` or a failure record whose key is the message. It rejects, in order:

- a `never` or non-function producer, or one with required parameters (`[Producer] extends [() => infer Completed]`; optional parameters are allowed);
- `any` and `never` returns, which covers the erased implementation overload;
- a Block whose `owner`, `Model` or `OutMessage` is not identical to the Definition's;
- a Block whose default-view presence disagrees with the method.

TypeScript caches an alias per argument list, so the first member read computes the verdict and every later read reuses it. The cost of `makeBinding` over `assembleBlock` is about 2,300 instantiations on a 163,000 baseline.

The failure record is `Readonly<{ [message]: never }>`. A string message would print as `string` in the diagnostic. The record prints the message. The accepted fixture pins each message with `keyof`, so a reworded or lost message fails the gate (constraint 17).

### Identity, not assignability

The verdict compares types with the `Equal` identity trick, not `[A, B] extends [B, A]`. In one fixture layout a producer with the same id and a different Model was accepted under mutual assignability, because TypeScript compared the two Schema types before it had settled `Struct`'s variance and answered "maybe". The same producer was rejected in every other layout I tried. Identity gave the right answer in all of them. Valid producers still pass, because the Composition carries the Definition's `ModelSchema` type unchanged, and they pass after declaration emit and relocation.

I could not build a fixture that fails deterministically when someone swaps the comparison back (see Open questions).

### Two entry points

View presence is the one fact the Definition does not hold. Any single member that tries to carry it breaks a consumer (constraint 7). Two methods put the choice at the call. A wrong choice is caught three ways: the member type, a runtime check on the default view, and the pinned message that names the other method.

### Runtime mark

`makeNamespace(id).makeDefinition(contracts)` creates `mark = Object.freeze({ id })`, passes it through `authoring.define(contracts, mark)`, `makeBaseDefinition` and the Composition's inner `makeDefinition`, and `assembleBlock` registers `block -> mark` in a WeakMap beside the four registrations it already makes. `replaceEffectsLayer` and `provideHandlers` re-enter the same `assembleBlock`, so Blocks they build carry the mark.

`produceBlock` calls the producer once, requires `blockMarkOf(block) === mark`, checks the default view with `defaultViewOf`, and returns the identical object. This is exact where owner and Model comparison were not. It separates two `Block.makeDefinition('Same', ...)` calls, and siblings built by one `makeNamespace`, which share an owner object and, for Tabs, Menu and RadioGroup, a Model.

### The named producer

Passing an arrow function as the argument makes TypeScript check the Block far more often than passing a declared function. Both forms defer `.Model` reads. Instantiations on a small Block with two child Bindings (TypeScript 6.0.3 API for reads, 7.0.2 for whole program):

| form | whole program | read `Model` | read `Message` | `makeBinding` |
|---|---|---|---|---|
| `assembleBlock` | 153,985 | 155,169 | 155,169 | 163,492 |
| prototype, inline arrow | 1,148,274 | 1,955 | 1,180,124 | 1,189,576 |
| prototype, named producer | 153,928 | 1,955 | 155,495 | 164,842 |
| this design, inline arrow | 1,148,625 | 2,074 | 1,181,218 | 1,190,523 |
| this design, named producer | 154,279 | 2,074 | 156,594 | 165,793 |

Twenty independent Blocks in one file: `assembleBlock` 397,664; inline arrows 2,248,006; named producers 398,276. Reading all twenty `Model`s: 401,430 against 3,942 for both produced forms.

The cost sits in inferring a naked `Producer` from an arrow expression. A `P extends Function` or `P extends object` bound pays it too. A bound with a call signature removes it and also makes `.Model` reads eager again. A named function, `function assemble() {...}` or `const assemble = () => ...`, avoids it with the naked parameter intact. I did not establish the compiler mechanism. The measurements are repeatable on both compilers.

So the named producer is the authoring form. The `no-inline-block-producer` lint rule reports a function expression argument. The type-performance fixture `produce-block-20` uses named producers, so an inline arrow in it would breach the budget.

The Website measurement of 2,990 ms to 1,312 ms used the inline arrow. On the Website the named form should remove the remaining inline cost at `makeBinding(UiBlock)`. I did not measure that. The implementation step does.

### assembleBlock, Block.Model and Composition-only factories

- **`assembleBlock`** stays public. It is the assembly primitive and the body of every producer. A module-level exported Block is produced. The lint rule `no-exported-assembled-block` (wave 3, after the codemod) reports `export const X = <Composition>.assembleBlock(...)` so one way remains. Local consts, return values inside factories and Composition-only code are out of its scope.
- **`Block.Model`** on a produced Block is exactly the Definition's Model type and Schema value. Parents read it from the Block. The Schema re-export from the integration tip (`Ui.Model`) keeps working and stays valid organization guidance. For a produced Block it is a naming choice, not a performance workaround. The tip's `schema-boundary` fixture already asserts `Equal<typeof Child.Model, typeof Child.ChildBlock.Model>`; a new assertion does the same for `UiBlock`.
- **Factories that hold a Definition** (the 8 `makeBlockParts` factories, Toast's `makeRuntime`, `slider.forRoot`) call `produceBlock` and write their public `Completed` type over a producer function type, as in Usage.
- **Composition-only code** (the UI declaration test `author(composition)`, Website `blockGenericFactory.ts`) stays on `assembleBlock`. A Composition-level `produceBlock` measured 560 ms slower than a Definition-level one because the Composition type carries every child Binding.
- **Enriched Blocks.** The produced type does not keep unknown members, because that needs `keyof Completed`, which checks the producer. Enrich after producing: `Object.assign(produced, { test })` keeps `AnyBlock` assignability and types `test` (probed). Query and KeyedQuery keep their annotated `Query<...>` types and do not change.

### Gates

The fixtures in `sketch/fixtures/` are split as the tip's `schema-boundary` fixture is: modules, `.accepted.ts`, a byte-identical `.consumer.ts`, `.rejected.ts`.

- `produce-block-definition.ts`: ten Definitions (four shapes, foreign, same Model, same id, twin, out twin, parent).
- `produce-block-block.ts`: assembled and produced Blocks, chained producers, same-Definition view and headless Compositions.
- `produce-block-invalid.ts`: the invalid produced Blocks.
- `produce-block.accepted.ts`: key and member `Equal` per shape, `AnyBlock` assignment, `embedView` overload equality for view and headless, a Program root, Model and OutMessage identity with the Definition, eleven pinned messages.
- `produce-block.rejected.ts`: thirteen rejected consumer lines, one statement each so the `@ts-expect-error` line is exact.
- `checks` entry in `check-emitted-declarations.ts`: `{ name: 'produce-block', accepted, consumers, rejected }`.
- `src/block/produceBlock.test.ts`: runtime rejections with `Reflect.apply` and `toThrow` in the `compositionSafety.test.ts` style, plus `expectTypeOf` cases. Runs under `pnpm --filter foldkit typecheck` and `vitest`.
- `type-performance/produce-block-20.ts` and `fixtures.json` entry. Budget from `pnpm update:block-type-performance produce-block-20` under 7.0.2.
- Latency control: run `profile-block-language-service.ts` alone, serially, twice. Pair 1 keeps `uiPages: UiBlock.Model` in `model.ts` on both sides, so the workload hash covers the dependency the benchmark exercises. Pair 2 uses the tip's `Ui.Model`. Rebuild `dist` before each.
- Rebase onto 9a5f9307 first. Import `Equal` and `Assert` from `schema-boundary-equality.ts` and add `MembersEqual` beside them.

Mutation results (each rule removed in turn, then restored):

| rule removed | gate that fails |
|---|---|
| owner identity | accepted TS2344 x2, rejected TS2578 |
| Model identity | accepted TS2344, rejected TS2578 |
| OutMessage agreement | accepted TS2344, rejected TS2578 |
| view agreement | accepted TS2344 x2, rejected TS2578 x2 |
| `any` check | accepted TS2344 (the message pin; rejection still happens through the owner check) |
| nullary requirement | accepted TS2344, rejected TS2578 |
| key set loses `hostHandlers` | accepted, many |
| runtime mark comparison | 4 runtime cases |
| runtime view check | 1 runtime case |

### Migration waves

- **Wave 0, the first implementation.** Types, runtime mark, both methods, fixtures, tests, lint detection and `no-inline-block-producer`, UiBlock, one docs section and snippet, changesets (`foldkit` minor, `oxlint-plugin-foldkit` minor).
- **Wave 1.** Run the codemod per package: examples (51 sites), Website (35 app and snippet sites), typing-game (3), UI module-level exports (12). Each package must pass typecheck and, for UI, `check:emitted-declarations`.
- **Wave 2, by hand.** Popover, Dialog and DatePicker annotated Blocks; the 8 `makeBlockParts` factories; Toast; Slider. Each needs a `Completed` type over a producer function type.
- **Wave 3.** Enable `no-exported-assembled-block`. Update `skills/` and `projectOrganization.md` to say a produced Block's `.Model` is the supported read.

### Interface depth and red flags

The public surface is two methods and six type names. It hides the verdict, the key derivation, the mark and the runtime checks. A caller learns one rule: pass the name of a function that returns `assembleBlock(...)`, and choose `produce` or `produceHeadless` by whether the Block has a view. Screen against `design-red-flags.md`:

- Two ways to do one task: the exported-Block lint closes it. `assembleBlock` remains for the thunk body and for code that has no Definition.
- Hand-synced list: the member list is derived from `AnyBlock`; a fixture fails on drift. The four-name exclusion in `ContractKey` is the one remaining list and each name is asserted.
- Split ownership: one mark per Definition, owned by `makeNamespace.makeDefinition`.
- Importable internals: `CheckedProducer` is exported from `produced.ts` for the emitted declaration text and left out of `public.ts`; the mark module is `@internal` and unexported from the barrel.

## Synthesis decision

(Left empty for arena.)

## Tradeoffs accepted

- We accept errors at the first consumer that reads a non-`Model` member, plus a throw at module load, in exchange for deferral. I measured a parameter-level guard (`P & Check<P>`): 155,634 instantiations to read `Model`, which is eager.
- We accept that two Definitions with the same id and the same Model, or any two `Owner<string, false>` Definitions with equal Models, pass the type check. The runtime mark rejects them when the module loads. Shared-namespace siblings (Listbox single and multi, Combobox, the Tabs, Menu and RadioGroup pairs) are in the same position.
- We accept two methods in exchange for a correct `[DefaultViewTypeId]` in all four shapes.
- We accept that the produced type drops members the contract does not list. Enrichment happens after `produceBlock`.
- We accept that `produceBlock` and `produceHeadlessBlock` exist only on `AuthoringDefinition`. A value annotated as `Block.Definition` or `Block.Base` cannot call them (constraint 26).
- We accept the TS2589 note on a Program root whose Block has a broken `Message`. A hand-written broken `Message` on a plain object gives the same first-use TS2589 today, so it comes from `Program.makeElement` and not from this design.
- We accept the named-producer rule as lint and documentation. The type system cannot tell an arrow from a declared function.
- We accept six public type names. All four interfaces are reachable, which fixes the prototype's two dead exports, and the factories need to extend them.
- We accept identity comparison. A producer whose Model type is equal but not identical, for example one retyped by hand in a generic factory, is rejected.

## Alternatives considered

1. **The prototype, one method, with an optional or `never` view member.** All three encodings break a consumer: `undefined` fails `AnyBlock` under `exactOptionalPropertyTypes`, `never` adds a phantom `embedView` overload, and an optional view loses the canonical overload and makes `Program` reject Blocks that have a view (constraint 7). Shallow in the wrong place: the caller cannot make it right.
2. **One method with a kind argument or type argument.** TypeScript cannot give one type argument and infer another. A value argument ahead of the producer works, but it adds a literal to every call, and a trailing options object puts the kind after a long producer body. The two names carry the same information with no ceremony.
3. **Composition-level `produceBlock`.** Measured 1,874 ms against 1,312 ms for the Definition-level one on the Website, because the Composition type carries the child Bindings.
4. **Annotation only: `export const UiBlock: ProducedBlockWithView<Owner, Model, typeof assembleUi> = assembleUi()`.** Probed. Rejects a foreign producer at the declaration line, which the chosen shape cannot do, and `.Model` costs 1,788 instantiations. It loses on a runtime guard (nothing stops a twin Definition), and the author restates the owner and Model Schema type at each site. It needs the same four interfaces, which the chosen design exports, so a team can still write it by hand when it wants a declaration-site error.
5. **Mutual assignability for the Model comparison.** Smaller to write. Rejected after the cold-cache false accept described above.

## Implementation reconciliation

None yet.

## Open questions and risks

- Do you want the named-producer rule as an error in `recommended.json` from the first release? It makes the first implementation larger by one rule and its tests, and removes the 7x cost for every new site.
- Can the Website UiBlock win be re-measured with the named form? I measured toy Blocks only. The profiler must run alone, serially, after a build.
- Is a declaration-site error worth a second way? Alternative 4 gives it. Offering both would put two ways to declare an exported Block back in the codebase.
- Can someone find a fixture layout that fails deterministically when `SameType` goes back to mutual assignability? I tried a minimal file, the shared fixture and one with an unrelated Definition first. The false accept appeared once.
- Should Toast's `test` member and the Listbox `Completed` interfaces move in wave 2, or stay until their next change? They are the only places that need the function-type producer pattern, and I probed it in a simplified factory only.
- Do generic wrappers whose `Out` is unknown need `ProducedBlock<Kind, ...>` exported? I kept it exported so emitted declarations can name it.
- The lint detection changes (`isCompletedBlockVariable`, `no-child-message-construction-in-root`) and the new rule were not run.

## Next implementation step

Add `produced.ts` (copy `sketch/produced.ts`), the `blockMark.ts` runtime, and the two methods, then run `sketch/fixtures` against a fresh `pnpm --filter foldkit build`.

## Constraint coverage

1. Handled. `<Producer>(produce: Producer)` stays naked and unconstrained. `.Model` read: 2,074 instantiations against 155,169 for `assembleBlock`. The inline-arrow tax is a separate finding with the named-producer answer.
2. Handled. `Model` is `ModelSchema` from the Definition, and so are `owner` and `OutMessage`. Reading each costs about 2,074.
3. Handled. The return type depends on the Kind literal and the Definition's OutMessage Schema only.
4. Accepted. No parameter-level guard. Measured `P & Check<P>` at 155,634 for a `Model` read.
5. Handled. Four shapes, exact `Equal` per member and key set, with and without OutMessage, view and headless (`shapes.ts`, `overloads.ts`).
6. Handled. OutMessage presence and Schema come from the Definition, and the verdict also checks the producer agrees.
7. Handled by two entry points. No member carries "view unknown".
8. Handled. All probes pass with `exactOptionalPropertyTypes` on and off, 13 rejections each.
9. Handled. Both mismatch directions are rejected at the first consumer and by a runtime throw, with messages that name the other method.
10. Handled. `keyof` equals the assembled Block's in all four shapes, `provideHandlers: never` and the phantom `__blockHandlerRequirements` included (`chained.ts`).
11. Handled. Keys derive from `keyof AnyBlock`. The fixture asserts key equality and member `Equal` per shape.
12. Handled. Probed: `CompletedWithView`, the three other interfaces, operations and `EffectsLayer` overloads, `replaceEffectsLayer`, `provideHandlers`.
13. Handled. `never`, non-function, erased, required parameter and `any` are each rejected with a pinned message. Optional parameters are allowed on purpose.
14. Handled. A foreign producer is rejected (probe and fixture).
15. Handled. The guard is inside the cached verdict. Cost at `makeBinding`: +2,300 over `assembleBlock` on a 163,000 baseline. Comparison uses identity.
16. Handled. `Owner<Id, Concrete>` is passed from `AuthoringDefinition` into the method return type.
17. Accepted. Errors appear at the first consumer, with pinned messages. A module-load throw reports the same mistakes at the call. No call-site type mechanism found; the guard variant measured eager.
18. Accepted at the type level. Same id and same Model, and equal `Owner<string, false>` Definitions, pass the types and throw at load (runtime probe).
19. Accepted at the type level, rejected at runtime. Shared-namespace siblings throw because each `makeDefinition` call has its own mark (runtime probe).
20. Handled. The producer's Block is returned as the identical object; the runtime probe checks identity and `defaultViewOf`.
21. Superseded. The mark replaces the owner, Model and OutMessage comparison and covers what that could not.
22. Handled. A mark passed through `define`, `makeBaseDefinition` and `makeDefinition` is registered in `assembleBlock`; chained Blocks inherit it (probe).
23. Handled. Messages follow `assertBindingParentContracts`; tests use `Reflect.apply` and `toThrow`. The tests are planned, the messages are probed.
24. Handled by design. Enrich after producing (`Object.assign` probe). Query and Toast `test` follow; Query is unchanged.
25. Handled. Factories with a Definition use the function-type producer (281 against 83,013). Composition-only code stays on `assembleBlock`. The UI `Completed<...>` text gate is untested.
26. Accepted. The methods are not on `Block.Definition` or `Block.Base`. The two methods change the three budget fixtures by less than the run-to-run spread (about 1%).
27. Handled. Toast payloads differ by Model at the type level and by mark at runtime. Slider's two Definitions differ by mark.
28. Planned, not run. Add both method names to `isCompletedBlockVariable`.
29. Planned, not run. Add both names to the `isCompletion` check and add a rule test with a produced Block.
30. Handled in the sketch. No casts, no `as const`, no `switch`; TSDoc on every export. The stale `ProducedCompositionBlock` text is deleted with the type.
31. Handled. Fixtures and the `checks` entry are named and pass against dist, emitted and relocated declarations.
32. Handled. Every rejected statement is one line. The Program root line carries TS2589 and TS2769 on one line; one directive covers both.
33. Handled. Emission with `noEmitOnError`, `skipLibCheck: false` and `exactOptionalPropertyTypes` passes, including a cross-module Binding and relocated consumers. `typeof assembleX` prints as a local declaration or expands to the function type.
34. Planned. `produceBlock.test.ts` for runtime and `expectTypeOf`. Not run here.
35. Handled by measurement. Budget fixtures moved by under 1% from the prototype, well inside the existing headroom. New fixture `produce-block-20`: 398,276 instantiations with named producers.
36. Planned. Two profiler pairs as described under Gates. Not run here.
37. Planned. Rebuild `dist` before every gate.
38. Planned. Rebase onto 9a5f9307 and import its equality helper.
39. Handled in design. Minor changeset for `foldkit` and for the lint plugin. Public names: `ProducedBlock`, `ProducedBlockKind`, four reachable interfaces. Docs section and snippet in wave 0.

## Probe log

All commands run from `candidate-2/probes/`. The compiler is `typescript@7.0.2` (`tsc`) unless the line says TS 6.0.3 API. `probes/run-all.sh > results.txt` reruns sections 1 to 9. Two scripts hold the mutation checks.

| section | command | observed |
|---|---|---|
| shapes, chained, overloads, messages | `node $TSC -p tsconfig.json` | no diagnostics in `shapes.ts`, `chained.ts`, `overloads.ts`, `messages.ts` |
| rejections | same | `rejected.ts`: 13 x TS2769 and 1 x TS2589 (Program root); `roots.ts`: 9 |
| without exactOptionalPropertyTypes | `node $TSC -p tsconfig.noexact.json` | same 13 TS2769 |
| deferral matrix | `node defer/count.mjs $TS6 <consumer>` | table under Shape |
| naked-parameter tax | `defer/gen.py`, `defer/count.mjs`, `--extendedDiagnostics` | naked 1,148,589; `Function` 1,148,610; `object` 1,148,337; contextual signature 156,401 (read 156,798); `P & Check<P>` 155,237 (read 155,634); named 153,907 (read 124) |
| twenty Blocks | `perf/gen.py`, same tools | 397,664 / 2,248,006 / 398,276; reads 401,430 / 3,942 / 3,942 |
| budget fixtures | `tsc --extendedDiagnostics perf/{proto,mine}/<fixture>.ts` | baseline 1,841 both; deep 879,962 and 884,648; wide 1,963,639 and 1,977,815; command 912,704 and 913,348. Repeated runs swap which is larger |
| declaration emit | `emit/tsconfig.json`, `tsconfig.cross.json`, then the two consumer projects | all exit 0 |
| factory | `factory/consumer.*.ts` | new 281, old 83,013 |
| annotation alternative | `annotated/annotated.ts` | `Good` accepted, two foreign cases rejected at lines 29 and 30; read `Model` 1,788 |
| enrichment | `enriched.ts` | no diagnostics |
| runtime | `node runtime.mjs` (patched copy of dist) | 15 cases, `ALL AS EXPECTED` |
| type mutations | `./mutation.sh` | `mutation-results.txt` |
| fixture gate emulation | `sketch/fixtures/relocate.sh` | against dist, emitted and relocated declarations: exit 0 |
| fixture mutations | `sketch/fixtures/mutation.sh` | table under Gates |

Not probed: the oxlint rule and detection changes, the codemod, the Website native language service timing, the real Listbox, Combobox, Tabs, Menu, RadioGroup, VirtualList, Toast and Slider factories, `pnpm` builds, vitest, and the UI emitted-text gate. The runtime was exercised through a hand-patched copy of `dist` JavaScript, not through a build of patched source.
