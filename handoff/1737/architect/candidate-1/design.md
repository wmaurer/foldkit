# Candidate 1: named producers, two publishing methods, one verdict

## Problem

A parent that reads only a child's Model Schema (`uiPages: UiBlock.Model`) makes TypeScript resolve the child's whole `assembleBlock` call, because the type of `UiBlock` is that call's return type. The prototype `UiDefinition.produceBlock(() => UiComposition.assembleBlock(...))` takes `Model` from the Definition and reads every other member from the thunk on demand. It has three known holes: viewless producers get the wrong `[DefaultViewTypeId]` member, a producer from another Definition is accepted at both levels, and no gate knows the API exists.

The shape is constrained in four ways. Reading `.Model` must never type the producer, so `Producer` stays a naked type parameter and no return-position choice may depend on it (grounding 1 to 4). View presence decides a property modifier, which only something other than the producer can supply (7). A type-level guard can only live inside deferred members, so its errors land at the first consumer (15, 17). Owners are per namespace, so exact "same Definition" identity needs a runtime token (21, 22).

Probing this candidate surfaced a fifth constraint the grounding does not list. **The prototype's inline producer is about 8.4 times as expensive as an eager assembly whenever the producer is finally typed.** In a full TS 7.0.2 program, `produceBlock(() => Composition.assembleBlock({...}))` plus one consumer reading `.init` costs 1,530,123 instantiations, against 182,252 for the eager export. The same Block costs 183,390 when the producer is a named const, a function declaration, a block body that stores the assembly in a local const, or `() => assembled`. Only the case where the producer is an inline function whose returned expression is the `assembleBlock` call is slow. Per-request native LSP timing agrees: reading `.init` takes 357 to 413 ms inline, 110 ms eager, and 116 to 128 ms named. Reading `.Model` is cheap in every produced form (57 to 67 ms, eager 111 to 117 ms). So the prototype trades a Model-read win for a regression at every binding site and in every full typecheck. Probes P3, P4 and P5 below have the numbers.

## Usage (caller's view)

A feature publishes its exported Block from its Definition and passes a named producer:

```ts
// packages/website/src/page/ui/block.ts
import { UiComposition } from './composition'
import { UiDefinition } from './definition'
import { init } from './init'
import { update } from './update'
import { view } from './view'

const assembleUiBlock = () =>
  UiComposition.assembleBlock({ init, update, view })

export const UiBlock = UiDefinition.produceBlock(assembleUiBlock)
```

A parent's Schema reads the Block. That read never types `assembleUiBlock`:

```ts
// packages/website/src/model.ts (on TIP this line reverts from Ui.Model)
export const Model = Schema.Struct({
  // ...
  uiPages: UiBlock.Model,
})
```

A Block without a default view uses the viewless method. The Definition already knows whether an OutMessage exists, so only view presence is spelled at the call:

```ts
const assembleNotesBlock = () =>
  NotesComposition.assembleBlock({ init, update, operations, EffectsLayer })

export const NotesBlock = NotesDefinition.produceViewlessBlock(assembleNotesBlock)
```

A chained Block is produced by a producer that chains:

```ts
const assembleEditorBlock = () =>
  EditorComposition.assembleBlock({ init, update, view, EffectsLayer, hostHandlers: [SaveDocument] })
    .provideHandlers(SaveDocumentLayer)

export const EditorBlock = EditorDefinition.produceBlock(assembleEditorBlock)
```

Everything downstream is unchanged. `makeBinding(UiBlock, ...)`, `embedView`, `Program.makeElement({ block: UiBlock, ... })` and `Block.AnyBlock` see exactly the members, modifiers and overloads that `assembleBlock` gives them (probe P1).

Mistakes, and where each one surfaces:

| Mistake | Type error at | Runtime |
|---|---|---|
| Producer returns another Definition's Block | first consumer of a producer-read member: `makeBinding`, `Program.make*`, `AnyBlock` assignment. Text names `InvalidBlockProducer<"Block producer must return a Block of this Definition", Owner<"Other", true>>` | throws at module load |
| Same id, different Model | same | throws |
| Same types, different Definition (same-id twice, shared-namespace siblings) | none: the types are identical, so nothing is mistyped | throws |
| `produceBlock` with a viewless Block, or the reverse | first consumer: `"produceBlock requires a Block with a default view. Use produceViewlessBlock."` | throws |
| Producer is not a function, takes parameters, is `never` or `any` | first consumer: `"Block producer must be a function with no parameters"` | throws for a non-function |
| Producer returns `never` (erased implementation) or `any` | first consumer: `"must return a completed Block"`, `"must not return any"` | throws (not a registered Block) |
| Members added before production (Query, Toast enrichment) | first consumer: `"...Add members to the produced Block instead."` with the extra keys as evidence | accepted |
| Inline producer | `foldkit/named-block-producer` lint error | works, costs about 8x |

## Shape

### Data

One public input, the Definition's own type parameters, and one deferred input, `Producer`. The Definition supplies `owner`, `Model`, `OutMessage` presence and Schema. The method name supplies view presence. Those four facts form a `ProducerExpectation`. The producer supplies every other member.

Four exported interfaces mirror the four completed shapes, member for member and modifier for modifier:

- `ProducedBlockWithViewAndOutMessage<Owner, Model, OutMessage, Producer>`
- `ProducedBlockWithView<Owner, Model, Producer>`
- `ProducedBlockWithOutMessage<Owner, Model, OutMessage, Producer>`
- `ProducedBlockWithoutViewOrOutMessage<Owner, Model, Producer>`

Each declares `owner`, `Model` and (when present) `OutMessage` directly from the Definition. `NoOutMessage` and `NoDefaultView` supply the `?: never` modifiers, the same mixins the completed interfaces use. A view shape declares `[DefaultViewTypeId]` as a required producer-read member. The other 16 members come from one homomorphic mapped type over the contract template's keys, filtered with an `as` clause. The key union is static, so resolving a produced Block's member list never types the producer. Member TSDoc carries over from the contract (probe P7). There is no hand list: a key added to `BlockContract` appears on every produced shape automatically, and the accepted fixture's per-member `Equal` fails if its type drifts.

### Flow

`produceBlock<Producer>(produce: Producer)` returns `ProducedBlockFor<Owner<Id, Concrete>, ModelSchema, OutMessageSchema, 'View', Producer>`. That alias is a conditional over `OutMessageSchema` and the literal view presence only. It never inspects `Producer` (grounding 3).

Every producer-read member is `ProducedMember<Expectation, Producer, Key>`, which reads one alias, `ProducedCompletion<Expectation, Producer>`. TypeScript caches alias instantiations by argument identity, so the producer is typed and judged once per produced Block, however many members a consumer reads. `ProducedCompletion` yields either `readonly [Completed]` or one `InvalidBlockProducer<Reason, Evidence>`. The checks run in this order:

1. The producer must not be `any` or `never`, and must be assignable to `() => infer Completed`, which rejects required parameters (grounding 13).
2. `Completed` must not be `any` or `never`. The erased overload 7 is now rejected instead of slipping past `ValidatePresentProgramBlock` (13).
3. `owner` and `Model` must be mutually assignable with the Definition's, using the `ValidateViewOwner` pattern (15). The Definition's `Id` and `Concrete` reach the check through `Owner<Id, Concrete>` (16).
4. OutMessage presence and Schema must agree with the Definition.
5. The default view must be present for `produceBlock` and absent for `produceViewlessBlock` (9).
6. The key set must equal the completed Block's key set: nothing missing and nothing added (24).

A rejected verdict replaces every producer-read member, so any consumer that checks the Block structurally reports it. `InvalidBlockProducer` is a named interface, so the reason string and the evidence type appear verbatim in the diagnostic (probe P2).

At runtime, `assembleBlock` gains a fifth registration, `producingDefinitions.set(block, authoring)`. `authoring` is the inner runtime definition that `makeBaseDefinition` creates once per Definition and passes to its Composition. `makeBaseDefinition` owns `base`, so it also builds `produceBlock` and `produceViewlessBlock` beside `makeComposition`. Each method checks that the producer is a function, calls it once, then checks that `producingDefinitions.get(block) === base` and that the default view registry agrees with the method name. It then returns the identical object, which keeps the four existing WeakMap registrations valid (20). `replaceEffectsLayer` and `provideHandlers` re-enter the same `assembleBlock`, so their Blocks carry the same token (22). The prototype's closure in `makeNamespace` is deleted, and the spread of `base` carries the methods. That leaves one writer of the token (`assembleBlock`) and one reader (the produce methods), both in `definition.ts`.

### Load-bearing decisions

- **The producer is a named function.** The inline form compiles and behaves correctly, but costs about 8x the instantiations when the producer is typed. The types cannot see syntax, so the rule lives in a lint rule whose message names the fix, per encode-lessons-in-structure. The new perf fixture also fails its budget if one of its producers is made inline. The naming convention is `assemble<Feature>Block`, which names exactly what the function does.
- **View presence is the method name.** Two entry points keep every member and modifier identical to `assembleBlock`'s result. That is the only way the per-member `Equal` fixture can hold (grounding 7, 10). The mismatch state is representable, but it is rejected at both levels with a message that names the other method.
- **`owner`, `Model`, `OutMessage` are direct.** They come from the single source of truth, the Definition. The verdict guarantees the producer agrees with them, and reads of them stay cheap.
- **Exact identity is runtime-only.** The type level rejects every case where the types differ. When the types are identical, as with shared-namespace siblings or the same id twice, the produced type tells no lie about types, and the runtime token rejects the wrong Definition at module load (18, 19, 21).
- **Enrichment happens after production.** `KeysAgree` rejects members added inside the producer instead of silently dropping them. Factories that enrich (Toast's `test`) produce first and then `Object.assign` the produced Block, keeping object identity (24).

### Interface depth

The public surface is two methods and four interfaces. Behind it sit the shape selection, the producer verdict with six checks, the derived member set, and the runtime token. A caller learns one rule ("pass a named producer; say whether it has a view") and never touches `ProducedMember`, `ProducerExpectation` or `InvalidBlockProducer`. Those types stay module-private, because emitted consumer declarations only need the interface names (probe P8 prints `ProducedBlockWithView<Block.Owner<"Emit", true>, ..., typeof assembleEmitBlock>`).

### What it deliberately does not do

- No `produceBlock` on Compositions, `Block.Definition` or `Block.Base`. Composition-sourced Models measured 560 ms slower (grounding 2), and widening every Definition annotation is unmeasured (26).
- No type-level error at the `produceBlock(` line. No mechanism reports there without making `.Model` eager (17). The runtime check fires at the same call during module evaluation instead.
- No change to `assembleBlock`, its overloads, `AnyBlock`, `BindableBlock`, or any binding conditional.

### `assembleBlock`, `Block.Model`, and Composition-only factories

- **`assembleBlock`** stays the only assembly operation, and the Composition owns it. `produceBlock` is the publication boundary for a Definition's Block. An exported Block is published through `produceBlock`. `assembleBlock` calls appear only inside producers, in factories that have not been migrated, in tests, and in Query. Once the migration wave is done, a second lint rule, `foldkit/produce-exported-block`, reports `export const XBlock = XComposition.assembleBlock(...)`. That leaves one way to export a Block.
- **`Block.Model`.** With produced Blocks, `ChildBlock.Model` is as cheap as the barrel `Model` re-export that 9a5f9307 introduced, so the re-export becomes a second way to do one task. The first implementation reverts the Website's Ui to `UiBlock.Model` and removes `export { Model }` from `page/ui/index.ts`. Each migrated feature drops its re-export in the same change. The wave ends by deleting the AGENTS.md "may re-export its canonical Model" guidance. The `schema-boundary` fixtures keep passing throughout, since they test a pattern that remains legal (38).
- **Composition-only factories** (Toast `makeFixture`, the eight `makeBlockParts` factories, `slider.forRoot`, `blockGenericFactory.ts`, `author(composition)`) stay on `assembleBlock` in the first implementation. Their migration path is a restructure, not a new surface. A small factory function returns only the Definition. The named producer builds the parts and assembles inside its own body. The factory returns `Definition.produceBlock(assemble)`, and the public `Completed<...>` becomes `ReturnType<typeof makeBlock<...>>`. In probe P10 this cut a consumer's `.Model` read from 58,964 to 3,039 instantiations. Member fidelity for generic factories is not yet probed. Query keeps its written `Query<...>` type, which already avoids inference.

### Migration of the remaining sites (not in the first implementation)

This is a codemod over the 104 unannotated module-level exports:

1. Name the Definition where it is inlined in `Block.makeDefinition(...).makeComposition()`. AGENTS.md's "keep a named Definition only when code uses Definition authoring members" then holds, because `produceBlock` is one.
2. Hoist the `assembleBlock` call into `const assemble<Name>Block = () => ...`.
3. Replace the initializer with `produceBlock`, or with `produceViewlessBlock` when the implementation literal has no `view` key. A wrong guess fails at module load and at the first consumer.
4. Drop the barrel `Model` re-export, and switch parents back to `ChildBlock.Model`.

The 3 annotated UI Blocks (popover, dialog, datePicker) replace their `CompletedWithViewAndOutMessage` annotation with a named producer. The generic factories follow the restructure above.

## Synthesis decision

## Tradeoffs accepted

- We accept errors at the first consumer instead of the `produceBlock` line, in exchange for keeping `.Model` reads cheap. Module evaluation throws at the call, so a test or page load reports the mistake eagerly.
- We accept one extra `const` per site (the named producer) and a lint rule in exchange for avoiding an 8.4x instantiation cost. That cost hits every full typecheck and every binding-site request.
- We accept two method names, and a representable mismatch that both levels reject, in exchange for member and modifier fidelity with `assembleBlock`.
- We accept that same-type Definitions are told apart only at runtime. When the types are equal, the type is truthful.
- We accept about 1,300 extra instantiations per produced Block at a binding site (205,171 eager vs 206,681 candidate, +0.74%, probe P6) for the verdict and the derived member set.
- We accept that `Program.makeElement` with an invalid produced Block reports TS2589 next to the overload error, on the same line. The prototype shows the same (probe P2b). Valid Blocks are unaffected.
- We accept rejecting members added inside the producer instead of dropping them. An author who wraps an enriched Block gets an error that names the extra keys.
- We accept an interim second way to obtain a child Model Schema (the 9a5f9307 barrel re-exports) until the migration wave deletes it.
- We accept two new members on every `AuthoringDefinition`. Their effect on the three existing budgets is unmeasured, and the gate decides.

## Alternatives considered

- **One `produceBlock` that infers view presence lazily, with a required `[DefaultViewTypeId]: never` for viewless producers.** Callers would never choose. But it needs `[View] extends [never]` guards in `embedView` (`binding.ts:1058`, `keyedBinding.ts:315`) to avoid a phantom canonical overload. It also creates a second representation of "no default view" that every future consumer of `DefaultViewTypeId` must know, and it breaks per-member `Equal` with the assembled Block. It exposes less at the call site but leaks an internal rule to every consumer.
- **Keep the prototype's inline arrow.** It is the shortest call site, and it costs 8.4x the instantiations whenever the producer is typed (P5). The surface is the same as this candidate's. The cost lands on every binding site.
- **A free function `Block.produce(definition, producer)`.** It would also work with `Block.Definition` and `Base` annotations, but it infers the Definition's type at every call. In P3 the inferred stand-in read `.Model` for 2,908 instantiations against 635 for the method form. It also adds an import to every feature.
- **Type-only factory adoption: annotate a generic factory's return as `ProducedBlockWith...<..., () => CompletedWithViewAndOutMessage<...>>`.** Inside the generic body, the producer-read members are unresolved conditional types, so returning the assembled Block is not expected to type-check without a cast. Not probed; the restructure above has a probe.
- **Composition-level `produceBlock`.** This is the shortest path for Composition-only factories. It measured 1874 ms against 1312 ms for the Definition variant (grounding 2), because its Model comes from the Composition type.

## Implementation reconciliation

## Open questions and risks

- Is the inline-producer cost a TypeScript behavior worth reporting upstream, or worth avoiding inside `assembleBlock` itself? The hypothesis is that an inline producer gives the returned call a contextual type (the arrow's own pending return type), which triggers return-type inference across the 12 overloads. The probes show only that the cost tracks "returned expression of an inline function argument". The mechanism is unverified.
- Does the prototype's inline `UiBlock` already inflate the Website's full typecheck and its `composition.ts` requests? P5 predicts it does. The LSP benchmark labels do not cover a `UiPagesBinding` request. Should the implementation add a Website `tsc --extendedDiagnostics` comparison and a `UiPagesBinding` hover label?
- Should Website docs and a snippet for `produceBlock` land with the first implementation or with the migration wave? This design defers them, since only Ui adopts.
- Is `produceViewlessBlock` the right name? The Website docs say "viewless Block". "Headless" collides with Headless UI.
- Generic factories: does a produced Block built inside a generic `makeBlock<Item>` keep exact member types when instantiated? P10 shows the `.Model` win but not fidelity, because the probe's own generic `assembleBlock` call failed overload resolution.
- Does `isOwnedDefinitionCall(init, 'produceBlock', references)` recognize a Definition receiver the way it recognizes a Composition receiver for `assembleBlock`? This comes from reading the code and is untested.

## Next implementation step

Write `packages/foldkit/src/block/produced.ts` from the probe's type core (keys derived from `BlockContract`), wire both method types into `AuthoringDefinition`, and land the `produced-block` declaration fixture from P1 and P2 before touching the runtime or the Website.

## Gates and fixtures

Rebuild foldkit before every gate below (37). Run the LSP benchmark alone.

1. **Declaration gate entry `produced-block`** in `packages/foldkit/scripts/check-emitted-declarations.ts`: `{ name: 'produced-block', accepted: ['produced-block.accepted.ts'], rejected: ['produced-block.rejected.ts'], consumers: ['produced-block.consume.ts'] }`.
   - `declaration-tests/produced-block-blocks.ts`: Definitions, Compositions, named producers and Blocks for the six probe cases (A view, B viewless, C view with OutMessage, D viewless with OutMessage, E `replaceEffectsLayer`, F `provideHandlers`), plus each assembled counterpart. It imports `Equal` and `Assert` from TIP's `schema-boundary-equality.ts`.
   - `produced-block.accepted.ts`, and `produced-block.consume.ts` byte-identical to it: per-shape `Equal<keyof>` and per-member `Equal` (the drift gate for 11), `AnyBlock` assignability, `DefaultViewOf` equality, `embedView` equality against the assembled Binding, `Program.makeElement` with a view root, and `Equal<typeof ABlock.Model, typeof Model>`.
   - `produced-block.rejected.ts`: the 16 cases of probe P2, one `@ts-expect-error` per consumer line, each consumer call on one line (32).
   - An emitted-text assertion: the emitted `produced-block-blocks.d.ts` must contain `ProducedBlockWithView<` and `typeof assemble`. This proves the deferral boundary survives emission (33). Mutation check: change the method's return type to the completed type and watch the assertion fail.
2. **Source tests** `packages/foldkit/src/block/produceBlock.test.ts`.
   - Runtime: the identical object is returned; the producer is called once; `replaceEffectsLayer` and `provideHandlers` Blocks are accepted. These calls throw, each written with `Reflect.apply` in the `compositionSafety.test.ts` style (23): a foreign id, the same id from two `makeDefinition` calls, a shared-namespace sibling, a view mismatch either way, and a non-function.
   - A few `expectTypeOf` checks for Model identity and one `@ts-expect-error` foreign binding, enforced by `pnpm --filter foldkit typecheck` against source (34).
3. **Perf**: `type-performance/produced-composition-8.ts` is `deep-composition-8` with each Block published through a named producer. Add a `fixtures.json` entry and a budget from `pnpm update:block-type-performance produced-composition-8`. The three existing budgets must not rise (35). Mutation check: make one producer inline and watch the fixture exceed its budget. Append a README section, "Produced Block boundaries", with before and after tables.
4. **oxlint**:
   - `named-block-producer` rule with tests. Invalid: an arrow, a function expression, and a block-bodied arrow returning the call. Valid: an identifier.
   - `isCompletedBlockVariable` accepts `produceBlock` and `produceViewlessBlock` initializers, with a `got-block-message-name` test on a same-file `XBlock.Message`.
   - A `no-child-message-construction-in-root` test with a produced root (28, 29).
5. **Website**: `page/ui/block.ts` as in Usage. `model.ts` reads `UiBlock.Model`. `page/ui/index.ts` exports only `UiBlock`. That makes the parent's `UiBlock.Model` read the latency control inside the hashed workload (36). Run the LSP benchmark in three serial arms: TIP (`Ui.Model`), prototype inline, candidate named. Also record Website `tsc --extendedDiagnostics` instantiations for the same three arms.
6. **Release**:
   - `minor` changesets for `foldkit` (new methods and interfaces; `ProducedCompositionBlock` is removed before release, so nothing breaks) and for `oxlint-plugin-foldkit` (new rule).
   - AGENTS.md: add a line on `produceBlock` and named producers.
   - TSDoc on all four interfaces and both methods.
   - A full `pnpm pre-push` (39).

## Probes

Shorthands: `TSC` = `/home/mrwe1@office.begasoft.ch/projects/foldkit/foldkit/node_modules/.pnpm/typescript@7.0.2/node_modules/typescript/bin/tsc`, `TS6` = `/home/mrwe1@office.begasoft.ch/projects/foldkit/foldkit/node_modules/.pnpm/typescript@6.0.3/node_modules/typescript`, `NATIVE` = `/home/mrwe1@office.begasoft.ch/projects/foldkit/foldkit/node_modules/.pnpm/@typescript+typescript-linux-x64@7.0.2/node_modules/@typescript/typescript-linux-x64/lib/tsc`, `P` = `/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/architect/candidate-1/probes`. Every probe resolves `foldkit` to the wt-base build through `P/node_modules/foldkit`. The type core under test is `P/produced.ts`. A stand-in `producerOf(definition)` or `declare const methods: ProduceMethods<...>` plays the method, because wt-base cannot be edited.

- **P1 accepted shapes.** `cd P && $TSC -p tsconfig.json` (strict, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`) gives exit 0, no output. `$TSC -p tsconfig.loose.json` (`exactOptionalPropertyTypes: false`) also gives exit 0, no output. `P/accepted.ts` asserts these for A to F: `Equal<keyof>` and per-member `Equal` against the assembled or chained Block; `extends Block.AnyBlock`; `DefaultViewOf` equality (and `never` for B); `embedView` type equality between produced and assembled Bindings for A to D; Binding `keyof` equality; `Program.makeElement` on A; `Equal<typeof ABlock.Model, typeof Model>`.
- **P2 rejected cases.** `$TSC -p tsconfig.rejected.json` and `$TSC -p tsconfig.rejected.loose.json` both exit 0, so every one of the 16 `@ts-expect-error` lines in `P/rejected.ts` is used. Stripping the directives (`tsconfig.messages.json`) gives these diagnostics, for example:
  - `Property 'Type' is missing in type 'InvalidBlockProducer<"Block producer must return a Block of this Definition", Owner<"RejectG", true>>'` at the `makeBinding` line;
  - `InvalidBlockProducer<"produceBlock requires a Block with a default view. Use produceViewlessBlock.", never>`;
  - `InvalidBlockProducer<"Block producer must return the completed Block. Add members to the produced Block instead.", "extra">`;
  - `"Block producer must not return any"`;
  - `"Block producer must be a function with no parameters"` for a non-function, a parameter, `never` and an `any` producer.

  The viewless Program root and the erased root each give one clean `TS2769`. Two lines also assert that the `Equal` helper is not vacuous.
- **P2b TS2589.** The first `Program.makeElement` call in a file with an invalid produced Block reports `TS2589` plus `TS2769` on the same line. `P/rm3.ts` reproduces it with the prototype's own `produceBlock` (`rm3.ts(17,19): error TS2589`).
- **P3 deferral, TS 6.0.3 API, consumer-only check.** Command: `node P/deferral/measure.mjs $TS6 P/deferral` and `node P/deferral/measure3.mjs $TS6 P/deferral <variants>`. Instantiations when a consumer reads only `typeof TheBlock.Model`:

  | variant | Model read | `.init` read |
  |---|---|---|
  | eager `assembleBlock` | 91,108 | 91,376 |
  | prototype inline | 2,520 | 759,956 |
  | candidate method, inline | 635 (418 with the type-only consumer of measure3) | 760,869 |
  | candidate inferred stand-in, inline | 2,908 | 760,998 |
  | candidate named const producer | 418 | 92,437 |
  | prototype named const producer | 2,477 | 91,522 |
  | candidate `() => assembled` | 418 | 92,437 |
  | candidate block body `{ const a = ...; return a }` | 418 | 92,437 |
  | candidate block body `{ return call }` | n/a | 1,530,071 in P5 |

  Constraining `Producer extends Function`, `extends object`, a rest tuple, or a trailing `NoInfer` parameter leaves the Model read cheap (373 to 397), and none of them fixes the inline cost (760,8xx).
- **P4 native TS 7 LSP, pull-diagnostics time of one consumer file** (3 fresh servers each). Command: `node .../scratchpad/repro/lsp.mjs $NATIVE P/deferral <files>`.
  - Model read: eager 113/117/111 ms, prototype 64/63/65, candidate inline 67/67/64, candidate named 62/62/66, noBlock 73/74/71.
  - `.init` read: eager 115/112/110, prototype inline 357/364/362, candidate inline 377/413/401, candidate named 128/125/116.
  - makeBinding: eager 130/138/132, candidate inline 471/378/421.
- **P5 full program, TS 7.0.2 `--extendedDiagnostics`, producing file plus a `.init` consumer.** Command: `$TSC -p P/deferral/tsconfig.full.json --extendedDiagnostics`. Instantiations: eager 182,252; prototype inline 1,529,157; candidate inline 1,530,123; inline `{ return call }` 1,530,071; block body with local const 183,338; named const 183,390; function declaration 183,286; `() => assembled` 183,390.
- **P6 full program with a parent `makeBinding` and `makeComposition`.** Instantiations: eager 205,171; prototype named 205,349; candidate named 206,681.
- **P7 TSDoc through the mapped members.** `node P/docs.mjs $TS6 P`: `init`, `update`, `operations` and `Message` on produced A and C report the contract's TSDoc. `Model` and `OutMessage` report none in the probe, because the probe interfaces declare those members without TSDoc. The sketch adds it.
- **P8 declaration emit.** `cd P/emit && $TSC -p tsconfig.json` (`declaration`, `noEmitOnError`, `skipLibCheck: false`, `exactOptionalPropertyTypes`) gives exit 0. The emitted `out/block.d.ts` has `declare const assembleEmitBlock: () => Block.CompletedWithView<...>` and `export declare const EmitBlock: import("./produced.js").ProducedBlockWithView<Block.Owner<"Emit", true>, Schema.Struct<...>, typeof assembleEmitBlock>`. It has only package-specifier imports and no `../`.
- **P9 runtime facts on the prototype build.** `node P/runtime.mjs`:
  - shared-namespace owner equal: true; shared-namespace Model equal: true;
  - view registered for view Block: true; for viewless Block: false;
  - `replaceEffectsLayer` keeps the view: true; keeps the owner: true; returns a new object: true;
  - prototype keeps identity: true; prototype accepts the shared-namespace sibling: true.

  The token registration itself is inferred from `definition.ts:4309-4320` and not executed.
- **P10 generic factory.** `node P/deferral/measure4.mjs $TS6 P/deferral consumer.fmodel.factoryCurrent consumer.fmodel.factoryProducedSplit` reports Model read 58,964 for the current `interface Completed extends CompletedWithViewAndOutMessage<BlockParts...>` pattern, and 3,039 with a separate Definition factory and a producer that assembles in its own body. The probe's own generic `assembleBlock` call fails overload resolution (`factoryCurrent` reports 2 diagnostics), so member fidelity is not established. The produced variant's verdict reported that failed assembly as `"produceBlock requires a Block with a default view"`.

## Constraint coverage

1. Handled: `Producer` is naked and unconstrained, with no contextual signature (P3 Model read 418 to 635).
2. Handled: `Model` is the Definition's `ModelSchema` type parameter, declared directly on every interface.
3. Handled: `ProducedBlockFor` branches only on `OutMessageSchema` and the method's literal view presence.
4. Handled: there is no parameter-level check. Measured: `extends Function`, `extends object`, rest tuple and `NoInfer` variants keep Model reads cheap (P3).
5. Handled: four interfaces with `NoOutMessage` and `NoDefaultView` modifiers, all reachable (P1).
6. Handled: OutMessage presence is selected from `OutMessageSchema`, and `OutMessage` is declared directly from the Definition.
7. Handled: view presence comes from the method name (`produceBlock` or `produceViewlessBlock`).
8. Handled: P1 and P2 pass with and without `exactOptionalPropertyTypes`.
9. Handled: `ViewAgrees` rejects lazily, and the runtime rejects through `defaultViewOf` (P2).
10. Handled: `Equal<keyof>` and per-member `Equal` for A to F, including `provideHandlers: never` and `__blockHandlerRequirements` (P1).
11. Handled: members are derived from the `BlockContract` keys, and the per-member `Equal` fixture fails on drift.
12. Handled: the four interfaces, `CompletedWithView` (A), the `replaceEffectsLayer` result (E) and the `provideHandlers` result (F) are probed.
13. Handled: `never` producer, non-function, erased `never` return, parameters and `any` are all rejected (P2). Rejecting `any` is a deliberate decision.
14. Handled: a foreign producer is rejected at `makeBinding`, `AnyBlock` and `Program` (P2).
15. Handled: the guard lives inside `ProducedMember` through the shared `ProducedCompletion`. Binding-site cost measured at +1,510 instantiations (P6).
16. Handled: `Owner<Id, Concrete>` is threaded into `ProducedBlockFor`.
17. Accepted: type errors land at the first consumer (the table in Usage), and the runtime throws at the `produceBlock` call during module evaluation.
18. Handled at runtime, accepted at type level: same-type Definitions are not distinguishable by type, and the type is truthful there.
19. Handled at runtime by the per-Definition token. Accepted at type level for Tabs, Menu and RadioGroup siblings.
20. Handled: the identical object is returned, and the registrations stay valid (P9 identity).
21. Superseded: the token compares the producing Definition directly, which also covers the owner and Model cases.
22. Handled: `producingDefinitions` is written in `assembleBlock` and read in `makeBaseDefinition`, and chained Blocks re-enter `assembleBlock`. Inferred, not executed.
23. Handled: messages follow the `[foldkit] Block "<id>" ...` style, with `Reflect.apply` tests in `produceBlock.test.ts`.
24. Handled: extra keys are rejected by `KeysAgree`. Toast-style enrichment happens after production. Query is left unchanged.
25. Accepted for the first implementation: Composition-only factories stay on `assembleBlock`. Migration path: restructure (P10, Model read only).
26. Accepted: there is no member on `Block.Definition` or `Base`.
27. Handled: Toast payloads are rejected by the Model comparison, and Slider's two Definitions by the runtime token.
28. Handled: `isCompletedBlockVariable` recognizes `produceBlock` and `produceViewlessBlock`, with rule tests.
29. Handled: a `no-child-message-construction-in-root` test with a produced root. The inner `assembleBlock` call stays inside the named producer.
30. Handled: `produced.ts` is types only. The runtime uses `Predicate.isFunction` and `Predicate.isObject` and needs no assertions. TSDoc goes on all exports, and `ProducedCompositionBlock` is deleted.
31. Handled: the `produced-block` gate entry and the fixtures listed in Gates.
32. Handled: one consumer call per line under each directive, and the rejected file imports only `produced-block-blocks.ts`.
33. Handled: emission probed portable (P8), plus an emitted-text assertion in the gate.
34. Handled: `produceBlock.test.ts` with runtime and `expectTypeOf` coverage.
35. Handled: a `produced-composition-8` fixture and budget, the README section, and the existing budgets gated. The effect of the `AuthoringDefinition` members is unmeasured.
36. Handled: the Website parent reads `UiBlock.Model` again, and a three-arm benchmark is run serially.
37. Handled: rebuild before every gate, with no overlap with builds.
38. Handled: the design targets TIP, and the `schema-boundary` fixtures are untouched.
39. Handled: `minor` changesets, a public surface of 4 interfaces and 2 methods, docs deferred to the migration wave (open question), and a full `pre-push`.
