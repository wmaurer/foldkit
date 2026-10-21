# Explorer: Definitions, owner identity, and who creates Blocks

Paths are relative to the prototype checkout `wt-base` (65d1cd9c + d8626087d) unless marked `wt-tip`. `wt-tip` (9a5f9307) has no `produceBlock`; its only change is website/foldkit-declaration-test Schema re-exports (`export { Model } from './model'` in page barrels, `packages/website/src/model.ts` reading `Ui.Model` instead of `UiBlock.Model`, new `packages/foldkit/declaration-tests/schema-boundary*.ts`). `packages/foldkit/src` is identical between the two apart from the prototype.

Probe files I wrote (scratch only): `scratchpad/how/probe/probe.ts`, `probe2.ts`, `probe3.ts`, `runtime.mjs`; site classifier `scratchpad/how/tools/{sites.mjs,outmsg.mjs,sites.jsonl,shapes.tsv}`.

## Components Found

- `makeNamespace` — packages/foldkit/src/block/define.ts:250-286. The only runtime factory that attaches `produceBlock`. It creates one authoring context (one owner) per call, and each `makeDefinition(contracts)` call on the namespace builds `base = authoring.define(contracts)` and returns a new spread object `{ ...base, ...primitives, makeComposition, produceBlock }` (line 282). The prototype's `produceBlock` is `(produce) => produce()` (line 280), with no closure over owner or Schemas.
- `makeDefinition` (public) — define.ts:290-416. Four overloads: literal id with or without OutMessage (`Concrete = true`), and non-literal id with or without OutMessage (`Concrete = false`). The implementation calls `makeNamespace(id).makeDefinition(config)` (413-415), so every `Block.makeDefinition` gets a fresh owner and the prototype's `produceBlock`.
- `NamespaceMakeDefinition<Id, Concrete>` — define.ts:181-235. Two overloads (OutMessage required, OutMessage forbidden). Both return `AuthoringDefinition`.
- `AuthoringDefinition<Id, ModelSchema, MessageSchema, OutMessageSchema, Concrete, ChildInitContextSchema>` — define.ts:142-177. `Omit<Base<Owner<Id, Concrete>, ...>, 'makeComposition'> & Primitives & { makeComposition: AuthoringMakeComposition; produceBlock: <Producer>(produce: Producer) => ProducedCompositionBlock<ModelSchema, OutMessageSchema, Producer> }`. This is the only public Definition type that has `produceBlock`. `Id` and `Concrete` are in scope here but are not passed to `ProducedCompositionBlock`.
- `Base`, `Definition`, `DefineBlock`, `Composition`, `MakeComposition` types — packages/foldkit/src/block/definition.ts:3549, 3318, 3567, 3418, 3492. None of them has `produceBlock`. `Composition` is a `Pick` of Definition fields plus `Message: DispatchSchemaFor<...>`, `makeInit`, `makeUpdate`, `makeView`, `assembleBlock`.
- `makeAuthoringContext` (internal) — packages/foldkit/src/block/named.ts:563-627. It calls `assertBlockId`, then `makeOwner(id)`, and returns `Object.assign(owner, { define, makeCommand, makeMount, makeMountStream, makeResource })`. So the runtime owner object is also the authoring context. Its only caller is `makeNamespace`.
- `makeBaseDefinition` (internal) — definition.ts:4309-4369. It builds `base = makeDefinition(owner, config)`. Its `makeComposition(graph)` builds a second runtime definition `makeDefinition(owner, { ...config, ...graph }, base)` and returns a `publicComposition` object, registered in the `compositions` WeakSet (definition.ts:131).
- runtime `makeDefinition(owner, config, authoring?)` — definition.ts:3956-4241. Holds `assembleBlock` (4079-4211). Every block it returns carries `owner` (the same object), `Model: config.Model`, `Message: dispatchMessage`, and an optional `OutMessage: config.OutMessage`. It also registers WeakMaps keyed by the block object: `registerRuntimeBindings`, `registerDefaultView`, `localChannels`, `registerBlockHostIdentities` (4201-4208). `replaceEffectsLayer` and `provideHandlers` call `assembleBlock` again in the same closure, so they keep the same owner.
- `Owner<Id, Concrete>` — packages/foldkit/src/block/owner.ts:6-11. The fields are `{ id: Id; namespace: Id; token: object; [ConcreteOwnerTypeId]: Concrete }`. `token` is a plain `{}` at runtime and an unbranded `object` in the type. `makeOwner` (14-21) always returns `Owner<Id, true>`; the `false` comes only from the overload return types. `IsConcreteOwner` is at 24-25.
- `assertBlockId`, `makeOwnedName` — packages/foldkit/src/block/ownerName.ts:4-40. These validate ids and build `${id}/${localName}` primitive names.
- identity registries — packages/foldkit/src/block/identity.ts:93-253. `registerDefinition(owner, definition, localName)` keys declarations by owner object. A second declaration with the same name under the same owner throws (170-174). There is no registry from a block or Composition to its Definition.
- `assertBindingParentContracts` — packages/foldkit/src/block/composition.ts:218-229. This is the existing runtime "same Definition" test, for parents. It compares `ownerToken`, `Model`, `Message`, `OutMessage`, and `ChildInitContext` by identity and throws "belongs to a different parent Definition contract".
- `ValidateViewOwner` — definition.ts:1670-1679. The existing type-level owner-equality pattern: `[ViewOwner, OwnerValue] extends [OwnerValue, ViewOwner]` produces the error key `'Block view must be authored by its definition'`.
- `ValidateConcreteComposition` / `ValidateComposition` / `ValidateImplementationComposition` — packages/foldkit/src/block/requirements.ts:839-876. These choose full validation or host-definition validation from `IsConcreteOwner`.
- Completed Block shapes — definition.ts:2038-2156 (four `CompletedBlock*` interfaces), 2209-2262 (`CompletedWithViewAndOutMessage` / `CompletedWithView`, Definition-and-implementation keyed), 2268-2300 (`Block<...>` intersection alias), 2302-2352 (`CompletedBlock` selector), 2358-2392 (`Completed`), 2428-2449 (`AnyBlock`). `NoOutMessage` and `NoDefaultView` (1168-1174) are `OutMessage?: never` and `[DefaultViewTypeId]?: never`.
- `AssembleBlock` overloads — definition.ts:2542 onward. Most return `CompletedBlock<...>`. The `this: CompositionValue` overload returns `CompletedWithView<CompositionValue, ...>` (~2814-2859). An erased-implementation overload returns `never` (~2895-2915).
- prototype `produced.ts` — packages/foldkit/src/block/produced.ts:1-95. `ProducedMember<Producer, Key>` returns `Completed[Key]`, or `InvalidBlockProducer` when the producer is never, not a function, returns never, or lacks the key. There are four `ProducedBlock*` interfaces. `ProducedCompositionBlock` (89-95) selects only on `OutMessageSchema`, so only `WithViewAndOutMessage` and `WithView` are reachable. Exported in public.ts:87-93.
- `DefaultViewTypeId` / `registerDefaultView` / `defaultViewOf` — packages/foldkit/src/block/defaultView.ts. `DefaultViewTypeId` is `declare const` (type-only). The runtime default view lives in a WeakMap keyed by the block object.
- prototype consumer — packages/website/src/page/ui/block.ts:1-13. The only `produceBlock` call in the repo. `UiDefinition` (page/ui/definition.ts) is `Block.makeDefinition('Ui', { Model, Message, ChildInitContext: CalendarDate })`, so it has no OutMessage and the WithView variant applies.

## Flow

1. `Block.makeDefinition('Ui', cfg)` → `makeNamespace('Ui')` → `makeAuthoringContext('Ui')` → `assertBlockId` → `owner = makeOwner('Ui')` (`token: {}`) → `Object.assign(owner, { define, ... })`.
2. `namespace.makeDefinition(cfg)` → `assertDefinitionContracts` → `base = owner.define(cfg)` = `makeBaseDefinition(owner, cfg)` → runtime `makeDefinition(owner, cfg)`. The returned user-facing Definition is a new spread object: `{ ...base, ...primitives, makeComposition (wrapper), produceBlock }`. Runtime check: its keys are `owner, Model, Message, mounts, bindings, makeStep, makeOutMessageFold, makeFieldsStep, makeNoopStep, makeCommandsStep, makeSubscriptions, makeManagedResources, makeBinding, makeComposition, makeCommand, makeMount, makeMountStream, makeResource, produceBlock`, plus the symbol `LocalMountsTypeId` and optional `OutMessage`/`makeOutMessageForward`/`ChildInitContext`.
3. `Definition.makeComposition(graph)` → `makeDefinition(owner, { ...cfg, ...graph }, base)` → `publicComposition` `{ owner, Model, Message (dispatch), OutMessage?, mounts, [LocalMountsTypeId], bindings, makeInit, makeUpdate, makeView, assembleBlock }`. A Composition has no `produceBlock` (verified at runtime).
4. `Composition.assembleBlock(impl)` → a block object holding `owner` (=== Definition.owner === Composition.owner), `Model` (=== Definition.Model), `Message` (the dispatch Schema; === config.Message only when no generated child envelopes), and `OutMessage` (=== config.OutMessage). The block is registered in four WeakMaps by identity.
5. `Definition.produceBlock(thunk)` (prototype) returns `thunk()` unchanged. Runtime check: `own === blockA` is true, so the WeakMap identities survive. At the type level the result is `ProducedCompositionBlock<ModelSchema, OutMessageSchema, typeof thunk>`. `Model` comes from the Definition and every other member is `ProducedMember<thunk, Key>`.

How a completed Block records its Definition:
- Type level: only `owner: OwnerValue` (`Owner<Id, Concrete>`), `Model: ModelSchema`, `Message`, and `OutMessage`. There is no Definition-unique brand: `token: object` is unbranded.
- Runtime: `block.owner` (an object shared by every Definition from one namespace), `block.Model`, and `block.OutMessage` (identity). `block.Message` is identity-comparable to the Definition only when the Composition has no generated envelopes. `ChildInitContext` is not on the Block. No WeakMap links a block, or a Composition, back to the Definition object.

## Files Read

- packages/foldkit/src/block/define.ts (all)
- packages/foldkit/src/block/produced.ts (all; prototype)
- packages/foldkit/src/block/owner.ts, ownerName.ts, identity.ts, named.ts (all)
- packages/foldkit/src/block/definition.ts: 113-180, 340-400, 1160-1180, 1636-1775, 1830-2470, 2466-2620, 2812-2965, 3290-3620, 3950-4370
- packages/foldkit/src/block/public.ts, defaultView.ts, requirements.ts:830-876, composition.ts:200-250, childEnvelope.ts:85-110, binding.ts:1050-1072, keyedBinding.ts:310-322
- packages/foldkit/src/runtime/programRoot.ts:1-60, 120-150
- packages/foldkit/src/experimental/query/query.ts:237-262, 340-640 (keyedQuery.ts by grep)
- packages/ui/src/toast/toast.ts:150-359, toast/update.ts:100-116 and its return, toast/schema.ts:95-130
- packages/ui/src/listbox/shared.ts:1-80, listbox/single.ts:80-200, combobox/single.ts:140-160, slider/slider.ts:850-895; popover/dialog/datePicker completion sites; grep of tabs/menu/radioGroup/virtualList/combobox/listbox factories
- packages/ui/declaration-tests/generic-composition.accepted.ts:425-640, generic-composition.consume.ts:100-125
- packages/foldkit/declaration-tests/query-block.rejected.ts
- packages/website/src/page/ui/{definition,block,composition}.ts
- wt-tip: `git show 9a5f9307 --stat`, website model.ts diff, schema-boundary-{equality,block}.ts
- packages/foldkit/dist/block/{define.d.ts,define.js,produced.d.ts} (the built prototype; consumers resolve `foldkit/block` through `dist/block/public.d.ts`)

## Boundaries

Definition creation paths and `produceBlock` coverage:

| Path | Runtime has `produceBlock` | Type has `produceBlock` |
|---|---|---|
| `Block.makeDefinition(literalId, cfg)` (Concrete true, ± OutMessage) | yes (via makeNamespace) | yes (AuthoringDefinition) |
| `Block.makeDefinition(nonLiteralId, cfg)` (Concrete false) | yes | yes |
| `Block.makeNamespace(id).makeDefinition(cfg)` (literal or generic id) | yes | yes |
| internal `makeAuthoringContext(id).define(cfg)` → `makeBaseDefinition` | no | `Base`/`Definition` have none |
| `Definition.makeComposition()` → Composition | no | no |
| Completed Block (`makeView`, `replaceEffectsLayer`, `provideHandlers`) | no | no |

Every public path reaches `AuthoringDefinition`, so every public Definition got `produceBlock`. Code that holds only a Composition cannot call it. Annotations written with `Block.Definition`/`Block.Base` types also have no `produceBlock`.

Concrete flag (probe3.ts):
- `<Name extends string>(name: Name) => Block.makeNamespace(name).makeDefinition(...)` instantiates to `Owner<'Q', false>`.
- `Block.makeDefinition('Toastish', ...)` inside a generic function is `Owner<'Toastish', true>`.
- `Block.makeDefinition(dyn: string, ...)` is `Owner<string, false>`. Two such Definitions have mutually assignable owner types.

`ProducedCompositionBlock` does not use `Concrete`.

Block creation census. These are non-test `.assembleBlock(` calls across packages/ui (src and declaration-tests), packages/website, examples, packages/typing-game, packages/foldkit/src, and packages/devtools: **132 sites**.

By package:
- examples: 51
- packages/website: 43 (30 in `src/snippet/`, 13 app code; one is the prototype `produceBlock`)
- packages/ui: 30 (25 src, 5 declaration-tests)
- packages/foldkit/src: 4 (Query ×2, KeyedQuery ×2)
- packages/typing-game: 3
- packages/devtools: 1

By shape. OutMessage presence comes from each site's Definition config and view presence from the `view` key; the classification is a heuristic script plus spot checks.
- WithView, no OutMessage: 80 (79 classified, plus the generic `author(composition)` at ui declaration-tests:451).
- WithViewAndOutMessage: 37:
  - 25 literal sites;
  - 3 annotated as `Block.CompletedWithViewAndOutMessage<typeof XComposition, typeof implementation>` (popover/block.ts:735, dialog/block.ts:629, datePicker/block.ts:480);
  - the declaration test `WithViewAndOutMessage` (generic-composition.accepted.ts:614);
  - 8 generic `makeBlockParts` factories: listbox single/multi, combobox single/multi, tabs, menu, radioGroup, virtualList. All return `interface Completed<...> extends Block.CompletedWithViewAndOutMessage<BlockParts['composition'], BlockParts['implementation']>`.
- WithOutMessage, viewless: 3 (website snippets antiPatternChildInitSettings.ts:34, antiPatternBlockBoundaryGood.ts:6, ui declaration test :618).
- WithoutViewOrOutMessage: 12. These include Query.ts:457/520, keyedQuery.ts:761/843, ui declaration test :631, and website snippets commandHostContract, updateCurriedStep, managedResourcesLift, informingBlocksChild, blockMessageFreeChild, blockOptionalKeyedInstance, plus examples/ui-showcase/src/ui/block.ts:6.

By declaration form:
- 104 unannotated module-level `export const X = Composition.assembleBlock({...})`: examples 51, website 35, typing-game 3, ui 12 (virtualList, calendar, tabs, hoverIntent, animation, dragAndDrop, slider, menu, fileDrop, tooltip, radioGroup, test/apps/disabledButton), plus 4 ui declaration-test exports.
- 3 annotated (popover, dialog, datePicker).
- 10 `return composition.assembleBlock(...)` inside generic factories: 8 makeBlock factories, `slider.forRoot`, website `blockGenericFactory.ts:68`.
- Local consts: Toast `makeFixture`, Query/KeyedQuery ×4, devtools overlay.ts:1144, 4 website snippets.

Chained producers in non-test code: `EditorBlock.provideHandlers(...)` (website snippet commandHostImplementation.ts:30) and `Settings.SettingsBlock.replaceEffectsLayer(...)` (blockEffectsLayerSelection.ts:7). Declaration tests use both. These return the `Block<...>` intersection alias, not a `CompletedBlock*` interface.

Factories and whether each can adopt `Definition.produceBlock`:
- **Query / KeyedQuery** (query.ts:439-559): one `Block.makeNamespace(config.name)` per call (generic `Name` → `Concrete = false`), fresh Model/Message Schemas per call. The return is annotated `Query<Name, A, AI, E, EI, ...>` built on `Block.Block<Block.Owner<Name, false>, QueryModel<...>, ...>`, so Model already comes from a written type and no consumer inference is deferred. `enrichQuery` (237-262) uses `Object.assign(block, { Fetch, read, run, toLayer, ... })` and re-wraps `replaceEffectsLayer`/`provideHandlers`. `produceBlock` would drop those extra members, because `ProducedBlockFields` exposes a fixed key list. No benefit.
- **Toast** (toast.ts:153-359, update.ts:103-116): `makeRuntime<A, I>` calls `Block.makeDefinition('Toast', ...)` once per payload Schema. That gives `Owner<'Toast', true>` for every payload, and the Model is Schema-dependent (`makeModel(payloadSchema)`). `makeRuntime` does not return `ToastDefinition`; `makeFixture` sees only `ToastComposition`. The public `Completed<A, I> extends ReturnType<typeof makeFixture<A, I>>['block']`, so reading `.Model` forces `makeFixture`'s whole return type (`toastRuntime`, `block.operations`, `makeTest(...)`). The block is enriched with `Object.assign(block, { test })`. Adopting it needs the Definition exposed (or a Composition-level `produceBlock`), a `Completed` type not derived from `ReturnType<makeFixture>`, and preservation of the `test` member.
- **Listbox / Combobox** (listbox/shared.ts:38, combobox/shared.ts:30): one module-level namespace shared by the single and multi variants. Each `makeBlockParts<...>()` call runs `Namespace.makeDefinition({ Model: <static module Model>, ... })`. Listbox reuses the static `Message` and casts the static `OutMessage`. Combobox builds `ItemMessage`/`ItemOutMessage` per Item Schema. The public `Completed<...>` extends `Block.CompletedWithViewAndOutMessage<BlockParts['composition'], BlockParts['implementation']>`. Reading `.Model` goes through `CompletedWithViewArguments`, whose conditional also requires `CompletedImplementationValue<ImplementationValue>`, so the factory's `ReturnType<typeof makeBlockParts<...>>` is instantiated for a Model read. These factories return `composition`, not the Definition, so the call site holds no Definition. Adoption could be type-only: rebuild `Completed` on a Definition-sourced Model (`typeof Model`, static) with the rest read lazily. That needs a public type that takes the Model and a producer type, without a thunk value.
- **Tabs / Menu / RadioGroup**: a module-level namespace. A static module Definition (`TabsDefinition` etc.) and per-call refined Definitions in the same namespace use the same static Model and Message and a cast of the same OutMessage. The same pattern and the same adoption needs as Listbox apply.
- **Slider** (slider.ts:95, 857): `Block.makeDefinition('Slider', ...)` is called twice (module level and `forRoot`), so two distinct runtime owners share the type `Owner<'Slider', true>`.
- Generic `author(composition: Composition)` (ui declaration-tests:443-452): a Block authored from a Composition parameter with no Definition in scope.

## Non-Obvious Things

1. **The prototype accepts a producer from another Definition, and the hole reaches parents.** probe.ts and probe2.ts compile `DefA.produceBlock(() => CompB.assembleBlock(...))`. `Model` is typed as DefA's `ModelA`, while `init` returns `ModelB`. `ParentDef.makeBinding(Foreign, { field: <ModelA field> })` type-checks. A control that binds a ModelA Block into a ModelB field does error, so the binding check runs on the lying `Model`. Runtime check (runtime.mjs): `foreign.owner.id === 'Other'` and `foreign.Model === ModelB`, with no throw.
2. **A lazy type-level owner/Model check works only at the first consumer, not at the `produceBlock` call.** In probe2.ts every non-Model member is `Member<OwnerValue, ModelSchema, P, Key>`, which yields an error-key record when `Completed['owner']` or `Completed['Model']` is not mutually assignable with the Definition's. Results:
   - a foreign owner with a different id and Model is rejected at `makeBinding` ("Types of property 'owner' are incompatible ... 'Block producer must return a Block of this Definition': Owner<\"Other\", true>");
   - a foreign Definition with a different id and the same Model is also rejected (owner differs);
   - a different Definition with the **same id** (`Block.makeDefinition('Same', ...)` twice) is accepted, because `Owner<'Same', true>` is identical;
   - the Block's own Definition is accepted.

   Any validation in the parameter type (`produce: Producer & Validate<Producer>`) would force the thunk's return type during call resolution. That is the eager computation the prototype avoids. (I did not measure this; it is TypeScript call-resolution behavior.)
3. **Owner identity is per namespace, not per Definition.** At runtime, `Block.makeDefinition('Same')` called twice gives distinct owner objects and tokens, while `NS.makeDefinition` called twice gives a shared owner and distinct Definition objects (runtime.mjs). At the type level, owner types are equal for the same literal id, and equal for any two `Owner<string, false>`. Shared-namespace factories therefore cannot distinguish their Definitions by owner at either level:
   - Listbox single vs multi, Combobox single vs multi;
   - Tabs, Menu, and RadioGroup static vs refined.

   Listbox single vs multi differ by static Model Schema. Tabs, Menu, and RadioGroup static vs refined share owner, Model, and Message identities, and their OutMessage is a cast of the same object.
4. **The runtime precedent for "same Definition" is contract identity, not owner alone.** `assertBindingParentContracts` (composition.ts:218-229) compares `ownerToken`, `Model`, `Message`, `OutMessage`, and `ChildInitContext`. For a Block, `owner`, `Model`, and `OutMessage` compare cleanly. `Message` does not: `block.Message` is the dispatch Schema, a new object when the Composition registers generated child envelopes (`makeDispatchSchema` returns the local Schema only when there are none; childEnvelope.test.ts:50,86). `ChildInitContext` is not on the Block. The prototype's runtime `produceBlock` closes over nothing. A hardened version would need to capture `base.owner`, `contracts.Model`, and `contracts.OutMessage` in define.ts:267-283.
5. **The user-held Definition object is not the internal `base`.** define.ts:282 spreads `base` into a new object, and `assembleBlock`'s closure receives `base` as `authoring`. A block-to-Definition WeakMap would have to be keyed by something both sides share (`base`, or a per-Definition token passed into `makeBaseDefinition`). Nothing like that exists today.
6. **`produceBlock` must return the identical object.** Default view, runtime bindings, local channels, and host identities are WeakMaps keyed by block identity (definition.ts:4201-4208; defaultView.ts). Wrapping or spreading the block would break them. The prototype returns `produce()` directly, which runtime.mjs confirms.
7. **The view dimension of the four shapes cannot be decided lazily inside one interface.** The Definition knows whether an OutMessage exists, but view presence belongs to the implementation. `ProducedCompositionBlock` always picks a `WithView` variant. For viewless producers (12 + 3 sites today, including Query), probe.ts confirms `(typeof Produced)[typeof DefaultViewTypeId]` is `undefined` (required) instead of the real `[DefaultViewTypeId]?: never`. This holds with and without OutMessage. Consumers that match `extends Readonly<{ [DefaultViewTypeId]: infer V ... }>` are affected:
   - `DefaultViewOf` (defaultView.ts:7-12) yields `undefined`, not `never`;
   - `programRoot.ts` `ValidateOneRootView` (124-136) tests `[View] extends [never]` to report "Program root Block must have a default view". A viewless produced root would bypass that branch.
   - `binding.ts:1059` and `keyedBinding.ts:316` constrain with `extends AnyBlockView`, so `undefined` falls through as if absent.

   Property optionality is fixed when the interface is declared, so producing an optional-never member for viewless producers and a required View member for viewful ones needs a decision outside the deferred member. Options include a separate method or overload, or a type argument. `ProducedBlockWithOutMessage` and `ProducedBlockWithoutViewOrOutMessage` exist and are exported but unreachable.
8. **The `OutMessage` presence member is safe.** With a Definition OutMessage the member is required `ProducedMember<...,'OutMessage'>`. Without one it is `OutMessage?: never`, the same as `NoOutMessage`. `RootOutMessage` (programRoot.ts:37-40) and binding.ts:1825 (`OutMessage?: never`) see the same structure as for real Blocks.
9. **Other completed shapes produceBlock must tolerate.**
   - `CompletedBlock*` interfaces from most overloads.
   - `CompletedWithView<CompositionValue, ...>` from the `this`-typed overload.
   - The `Block<...>` intersection from `replaceEffectsLayer`/`provideHandlers` and Query's type.
   - `never` from the erased overload (the prototype maps it to `InvalidBlockProducer`).
   - `any`: a producer returning `any` makes every member `any`, with no rejection.
   - Enriched blocks (Query: `Fetch/read/run/toLayer` and re-wrapped methods; Toast: `test`), whose extra members are dropped by the fixed field list.
   - Thunks with parameters, which are accepted; runtime calls them with no arguments.
10. **The prototype's member list matches the full Block surface.** It covers `BlockContractFields` (owner, Model, Message, mounts, `[LocalMountsTypeId]`, bindings, init, update, operations, subscriptions, managedResources, EffectsLayer, `[LocalEffectsLayerTypeId]`, `__blockHandlerRequirements`, hostHandlers), `BlockOperations` (makeView, replaceEffectsLayer, provideHandlers), `OutMessage`, and `[DefaultViewTypeId]`. That is every key of `AnyBlock`.
11. **The doc comment on `ProducedCompositionBlock` (produced.ts:86) says "a Composition's `produceBlock`".** The method is on the Definition; Compositions do not have it. The website consumer imports `UiDefinition` into block.ts only to call it.
12. **Consumers type-check against `packages/foldkit/dist/*.d.ts`.** `package.json` exports `./block` → `dist/block/public.d.ts`. The prototype's dist contains `produced.d.ts` and `produceBlock` in `define.d.ts`, so the measured hover depends on the emitted declaration shape.

## Open Questions

- Does a parameter-level or overload-level check force the thunk's return type during call resolution for the consumer hover? I reasoned from TypeScript's applicability checking and did not measure it. The perf/gates explorer should time `produce: Producer & Check<Producer>` against the unconstrained form.
- Should "reject a producer from a different Definition" cover the same-id and shared-namespace cases? Owner types cannot express either. The runtime can catch the same-id case (distinct owner objects) but not the shared-namespace case (Tabs/Menu/RadioGroup refined vs static) without a new per-Definition token registered in `assembleBlock`.
- Is the program-root behavior for a viewless produced block (`DefaultViewOf` = `undefined`) actually wrong in a root check? I verified the type is `undefined` but did not run a `Program.makeApplication` probe.
- Should `produceBlock` also live on Composition, or should a type-only `Produced` interface be public? Toast and the eight generic factories hold only the Composition, and Listbox/Combobox/Tabs/Menu/RadioGroup/VirtualList could gain from a Definition-sourced static Model in their `Completed` interfaces.
- I did not check whether the website snippets or docs (`packages/website/src/page/core/block.md`, projectOrganization.md, skills) need a `produceBlock` mention, or how wt-tip's Schema-export guidance interacts with it.
