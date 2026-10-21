# Explorer: completed Block shapes and their consumers

Scope: the completed Block's type shape, which consumers key on which members, and whether the `produced.ts` interfaces from prototype commit d8626087d can stand in for every shape.

Line numbers are from the prototype checkout `wt-base`. `packages/foldkit/src` is byte-identical between `wt-base` (minus produced.ts / define.ts / public.ts edits) and `wt-tip` (9a5f9307 only touches `packages/website/src/model.ts` and `packages/website/src/page/ui/index.ts`), so the `definition.ts`, `binding.ts`, `bindChild.ts`, `keyedBinding.ts`, and runtime line numbers apply to both. `define.ts` in wt-base is 11 lines longer than in wt-tip because of the prototype.

Probes were run in a scratch project at `scratchpad/shapes-probe/` (symlinks to the wt-base built `dist`, `tsc` 7.0.2, `strict` + `exactOptionalPropertyTypes`, matching `tsconfig.base.json:9`). Probe files: `probe.ts`, `probe2.ts`, `probe3.ts`, `probe4.ts` in that directory. Nothing in either checkout was modified.

## Components Found

### Completed shape interfaces (packages/foldkit/src/block/definition.ts)

- `NoOutMessage` (definition.ts:1168): `{ readonly OutMessage?: never }`. Mixed into every no-OutMessage shape.
- `NoDefaultView` (definition.ts:1172): `{ readonly [DefaultViewTypeId]?: never }`. Mixed into every headless shape.
- `BlockOperations` (definition.ts:1839): `makeView`, `replaceEffectsLayer`, `provideHandlers`. `provideHandlers` is the type `never` when `hostHandlers` is empty (definition.ts:1906-1909). Both `replaceEffectsLayer` and `provideHandlers` return `Block<...>`, the intersection type, not one of the interfaces.
- `BlockContractFields` (definition.ts:1930): `owner`, `Model`, `Message`, `mounts`, `[LocalMountsTypeId]`, `bindings`, `init`, `update`, `operations`, `subscriptions`, `managedResources`, `EffectsLayer`, `[LocalEffectsLayerTypeId]`, `__blockHandlerRequirements` (required here; phantom, absent at runtime), `hostHandlers`.
- `BlockContract` (definition.ts:2001): `BlockContractFields & BlockOperations`. 18 members.
- `CompletedBlockWithViewAndOutMessage` (definition.ts:2038): `BlockContract` + required `OutMessage: OutMessageSchema` + required `[DefaultViewTypeId]: ImplementationValue['view']`.
- `CompletedBlockWithView` (definition.ts:2069): `BlockContract` + `NoOutMessage` + required `[DefaultViewTypeId]`.
- `CompletedBlockWithOutMessage` (definition.ts:2101): `BlockContract` + `NoDefaultView` + required `OutMessage`.
- `CompletedBlockWithoutViewOrOutMessage` (definition.ts:2133): `BlockContract` + `NoOutMessage` + `NoDefaultView`.
- `CompletedWithViewArguments` / `CompletedWithViewArgument` (definition.ts:2158, 2189): infer Owner/Model/Message/Mounts/Children from a Composition value and the implementation; feed the two derived interfaces below.
- `CompletedWithViewAndOutMessage<DefinitionValue, ImplementationValue>` (definition.ts:2209): extends `CompletedBlockWithViewAndOutMessage` via `CompletedWithViewArgument` lookups. Never returned by `AssembleBlock`; used only as an explicit annotation in `@foldkit/ui` (for example `ui/src/popover/block.ts:732`, `ui/src/dialog/block.ts:626`, `ui/src/datePicker/block.ts:477`, generic `Completed<Item>` interfaces at `ui/src/virtualList/virtualList.ts:1587`, `ui/src/menu/menu.ts:1419`, listbox/combobox/tabs/radioGroup).
- `CompletedWithView<DefinitionValue, ImplementationValue>` (definition.ts:2238): extends `CompletedBlockWithView` via the same lookups. Returned by exactly one overload (overload 5 below).
- `Block<...>` (definition.ts:2268): `BlockContract & (OutMessage conditional) & (view conditional)`. Intersection, not an interface. Returned by `replaceEffectsLayer`, `provideHandlers`, and used for Query blocks (`experimental/query/query.ts:360`, `keyedQuery.ts:629`).
- `CompletedBlock<...>` (definition.ts:2302): conditional selector. OutMessage branch keys on `OutMessageSchema extends Schema.Codec` (the Definition's schema). View branch keys on `ImplementationValue extends Readonly<{ view: AnyAuthoredView }>` (the implementation).
- `Completed<DefinitionValue, ImplementationValue>` (definition.ts:2358): public helper that computes `CompletedBlock` from a Composition type and implementation type. Used in `declaration-tests/accepted.ts:202, 313, 589`.
- `CompletedForValidation` (definition.ts:2394): `@internal`, builds `Block<>` instead of `CompletedBlock`.
- `AnyBlock` (definition.ts:2428): structural bound. Optional members: `__blockHandlerRequirements?: unknown`, `[DefaultViewTypeId]?: AnyAuthoredView`, `OutMessage?: AnySchema`. Everything else required.

### Symbols

- `DefaultViewTypeId` (defaultView.ts:4): `export declare const ... unique symbol`. Type-only. No runtime property exists; the default view lives in a `WeakMap` keyed by the block object (`registerDefaultView`, defaultView.ts:16; `defaultViewOf`, defaultView.ts:27).
- `DefaultViewOf<BlockValue>` (defaultView.ts:7): `BlockValue extends Readonly<{ [DefaultViewTypeId]: infer View }> ? View : never`. Requires the key to be required.
- `LocalMountsTypeId` (identity.ts, re-exported definition.ts:163): real runtime symbol, set on the block object (definition.ts:4188).
- `LocalEffectsLayerTypeId` (definition.ts:161): real runtime symbol, set at definition.ts:4197.
- `ConcreteOwnerTypeId` (owner.ts:2): brand inside `Owner<Id, Concrete>` (owner.ts:6).

### AssembleBlock overloads (definition.ts:2542-3290), in order

1. (2550) `ImplementationValue extends DefinitionImplementation` with `view?: never`. `DefinitionImplementation` requires `EffectsLayer` (definition.ts:1243). Returns `CompletedBlock` → headless shape (WithOutMessage or WithoutViewOrOutMessage).
2. (2582) `init`, `update`, `view`, `EffectsLayer` required, no subscriptions/managedResources/operations/hostHandlers. Returns `CompletedBlock` → view shape.
3. (2646) as 2 plus `subscriptions`. View shape.
4. (2729) as 3 plus `AdditionalImplementation`. View shape.
5. (2814) `this: CompositionValue` where the Composition has `OutMessage` undefined, `ImplementationValue extends { view }`, `EffectsLayer?: never`. Returns `CompletedWithView<CompositionValue, DefaultEffectsImplementation<...>>`. This is the overload `UiComposition.assembleBlock({ init, update, view })` hits. Probe confirmed: view + no OutMessage + no EffectsLayer prints as `CompletedWithView<Composition<...>, ...>`.
6. (2860) generic `ImplementationValue extends object` without `EffectsLayer`. Returns `CompletedBlock<... DefaultEffectsImplementation>`. Probe: headless without EffectsLayer → `CompletedBlockWithoutViewOrOutMessage`; view + OutMessage without EffectsLayer → `CompletedBlockWithViewAndOutMessage`.
7. (2904) `ErasedImplementation`: the broad `Implementation<Model, Message>` type. Returns `never`. Probe: the call compiles silently; the resulting value is `never`.
8. (2924) generic object with `EffectsLayer`. `CompletedBlock`.
9-12. (2960, 3045, 3125, 3210) view + managedResources / operations / subscriptions combinations. `CompletedBlock` → view shapes.

What decides the shape:
- OutMessage: the Definition's `OutMessageSchema` (carried into the Composition by `Pick<Definition, 'OutMessage' ...>`, definition.ts:3425-3439). The Definition knows this without the producer.
- View: whether the implementation object has a `view` key. Only the implementation knows this. The Definition does not.
- `never`: an implementation typed as the broad `Implementation` contract.
- `Block<>` intersection: any `replaceEffectsLayer` / `provideHandlers` result, and Query blocks.

### Prototype (d8626087d)

- `ProducedMember<Producer, Key>` (produced.ts:10): `[Producer] extends [never]` → `InvalidBlockProducer`; `Producer extends (...args) => infer Completed` → `Completed[Key]` if the key exists, else `InvalidBlockProducer`. The pattern is `(...args: ReadonlyArray<any>)`, so a thunk with required parameters is accepted at the type level but called with no arguments at runtime (define.ts prototype line 280).
- `ProducedBlockFields` (produced.ts:20): `Model: ModelSchema` direct; the other 17 `BlockContract` members via `ProducedMember`.
- Four interfaces (produced.ts:50, 59, 68, 77) mirror the four `CompletedBlock*` shapes. The OutMessage/view member modifiers (required vs `?: never`) are static, so they never type the producer.
- `ProducedCompositionBlock` (produced.ts:89) picks only `ProducedBlockWithViewAndOutMessage` or `ProducedBlockWithView`, based on the Definition's `OutMessageSchema`. `ProducedBlockWithOutMessage` and `ProducedBlockWithoutViewOrOutMessage` are exported (public.ts) but nothing reaches them.
- `produceBlock` sits only on `AuthoringDefinition` (define.ts:171-176), the type returned by `Block.makeDefinition` and `Namespace.makeDefinition`. It is not on `Block.Definition` (definition.ts:3318) or `Base` (definition.ts:3549). Runtime: `produceBlock = (produce) => produce()` (define.ts:280), which returns the original block object, so WeakMap-keyed registrations (default view, `localChannels`, `registerRuntimeBindings`, host identities, definition.ts:4206-4213) keep working.

### Consumers by type, and what they key on

Bindings (`Definition.makeBinding`, `BindChildConstructor`, bindChild.ts:2075):
- Constraint `const BlockValue extends BindableBlock` (bindChild.ts:2082, 2211). The message-free keyed overload uses `BindableBlock & Readonly<{ Message: Readonly<{ Type: never }> }>` (bindChild.ts:2157).
- `BindableBlock` (binding.ts:339): no `[DefaultViewTypeId]`, no `makeView` / `replaceEffectsLayer` / `provideHandlers`, no `[LocalEffectsLayerTypeId]`. Optional `OutMessage?: Readonly<{ Type: any }>` and `__blockHandlerRequirements?: unknown`.
- OutMessage presence: required-key checks `BlockValue extends Readonly<{ OutMessage: Readonly<{ Type: ... }> }>` at bindChild.ts:208, 307, 315, 696, 1045, 1911, 2049; binding.ts:559, 1191; keyedBinding.ts:255, 484; directConnection.ts:74. An optional `OutMessage?: never` fails these, so the result is the no-OutMessage branch.
- Default view presence: `BlockValue extends Readonly<{ [DefaultViewTypeId]: infer View extends AnyBlockView }>` at binding.ts:1058 (`embedView`) and keyedBinding.ts:315. Requires a required key.
- Placement default and Block id: `BlockValue extends Readonly<{ owner: Readonly<{ id: infer Id }> }>` (bindChild.ts:49, binding.ts:750, 1198, 1230, keyedBinding.ts:273).
- Child Model: mostly `BlockValue['Model']['Type']` (bindChild.ts, 23 uses; `keyof BlockValue['Model']['Type']` for `field`). But `BlockModel` in binding.ts:394 is `Parameters<BlockValue['update']>[0]`, so it reads `update`, not `Model`.
- Mapped types over members, never over the whole block: `keyof BlockValue['operations']` (binding.ts:799, keyedBinding.ts:344), `['subscriptions']` (binding.ts:463, 545, 932), `['managedResources']` (binding.ts:965).
- `BindingRequirement` (binding.ts:1274) and `BlockOfBinding` (binding.ts:1314) keep the whole `BlockValue` as evidence inside the Binding type, so a produced interface type flows into Binding types and their emitted declarations.
- `ValidateConcreteComposition` (requirements.ts:840) branches on `owner extends Owner<string, true | false>`; if `owner` is neither, it returns `unknown` (it does not reject).

Program / root (`runtime/program.ts`, `runtime/programRoot.ts`):
- Constraint `BlockValue extends AnyBlock` (program.ts:437-596).
- `ValidatePresentProgramBlock` (programRoot.ts:154): `[BlockValue] extends [never]` → "Program block must be a completed Block". This is the downstream gate for overload 7.
- `RootOutMessage` (programRoot.ts:37): required-key `OutMessage` infer.
- `RootHandlerEvidence` (programRoot.ts:59): required-key `__blockHandlerRequirements` infer.
- `ValidateNoHostHandlers` (programRoot.ts:50): `BlockValue['hostHandlers'][number]`.
- `ValidateOneRootView` (programRoot.ts:125) through `DefaultViewOf`: `[View] extends [never]` → "must have a default view"; otherwise `ValidateViewMember`.
- Server (`experimental/server/server.ts:1146-1210`): `AnyBlock` + `Parameters<BlockValue['init']>`.
- Runtime: `lowerBlock(block: AnyBlock)` (lowering.ts:25), `installBlock` (application.ts:731), `compositionRuntime.ts` on `BindableBlock`.

Other consumers:
- `experimental/query` `enrichQuery` / `enrichKeyedQuery` (query.ts:237, keyedQuery.ts:430) on `Block.AnyBlock`. Query blocks add `Fetch`, `read`, `run`, `toLayer`, and so on beyond the contract (query.ts:256+).
- Public `Block.AnyBlock` assertions: `declaration-tests/query-block.consume.ts:47` (`typeof Notes extends Block.AnyBlock`), `ui/src/mountRequirements.test.ts:35`.
- `keyof` on a block: `declaration-tests/operation-constructor.accepted.ts:371` (`'expose' extends keyof typeof ChildBlock`), `subscription-registry.consume.ts:33` (`keyof typeof registryBlock.subscriptions`).
- devtools / devtools-mcp: no type-level use of `AnyBlock`, `DefaultViewTypeId`, or `LocalMountsTypeId` (grep over packages found these only in foldkit and one ui test).
- oxlint plugin: `isCompletedBlockVariable` (oxlint-plugin-foldkit/src/message.ts:199) recognizes a completed Block variable when the initializer is directly a `...assembleBlock(...)` call (`isOwnedDefinitionCall(init, 'assembleBlock')`), an `@foldkit/ui` `create` call, or a same-file binding use. `no-child-message-construction-in-root.ts:906` also keys on `operation === 'assembleBlock'`.

## Flow

1. `Block.makeDefinition(id, { Model, Message, OutMessage? })` (define.ts:288-404) → `makeNamespace(id).makeDefinition` → `authoring.define` → `makeBaseDefinition(owner, config)` (definition.ts:4309). Type `AuthoringDefinition<Id, ModelSchema, MessageSchema, OutMessageSchema | undefined, Concrete, ChildInitContextSchema>`.
2. `Definition.makeComposition({ mounts?, bindings? })` → `Composition<Owner<Id,Concrete>, ModelSchema, MessageSchema, OutMessageSchema, Mounts, Children>` (definition.ts:3418). Model, OutMessage, and owner come straight from the Definition. `Message` becomes `DispatchSchemaFor<MessageSchema, Children>` (definition.ts:3442), and `mounts` / `bindings` come from the graph, so those cannot come from the Definition.
3. `Composition.assembleBlock(impl)` → one of the 12 overloads → `CompletedBlock` / `CompletedWithView` / `never`. Runtime builds `{ owner, Model: config.Model, Message: dispatchMessage, OutMessage?, makeView, mounts, [LocalMountsTypeId], bindings, init, update, operations, subscriptions, managedResources, EffectsLayer, hostHandlers, [LocalEffectsLayerTypeId], replaceEffectsLayer, provideHandlers }` (definition.ts:4183-4203), then registers the default view, local channels, bindings, and host identities in WeakMaps keyed by that object.
4. Prototype: `Definition.produceBlock(() => Composition.assembleBlock(impl))` returns the same object at runtime. The type is `ProducedCompositionBlock<ModelSchema, OutMessageSchema, typeof thunk>`. Reading `.Model` gives the Definition's `ModelSchema` and evaluates no `ProducedMember`.
5. A parent reads the block:
   - `makeBinding(block, config)` checks the block against `BindableBlock`, which evaluates every `ProducedMember` it lists and so types the producer.
   - `embedView` and `withOutMessagePolicy` are selected by required-key `extends` checks.
   - `Program.make*` checks `AnyBlock`, then `ValidateProgramBlock`.

## Files Read

- wt-base `git show d8626087d` (define.ts, produced.ts, public.ts, website `page/ui/block.ts`)
- packages/foldkit/src/block/definition.ts: 1150-1280, 1495-1575, 1830-3570, 3956-3990, 4150-4370
- packages/foldkit/src/block/define.ts (whole file)
- packages/foldkit/src/block/defaultView.ts, identity.ts, owner.ts, public.ts
- packages/foldkit/src/block/named.ts: 565-627
- packages/foldkit/src/block/binding.ts: 330-480, 1030-1130, 1270-1330, plus a grep of every `BlockValue[...]` / `extends Readonly<{` site
- packages/foldkit/src/block/bindChild.ts: 1990-2290, plus a grep
- packages/foldkit/src/block/keyedBinding.ts: 290-340, plus a grep
- packages/foldkit/src/block/requirements.ts: 840-870, plus a grep
- packages/foldkit/src/block/recordModelInference.test.ts, genericComposition.test.ts
- packages/foldkit/src/runtime/programRoot.ts: 1-215; program.ts: 30-100
- packages/foldkit/src/experimental/server/server.ts: 1140-1215; experimental/query/query.ts: 225-380; keyedQuery.ts: 425-440; block/lowering.ts: 20-40
- packages/ui/src/popover/block.ts: 725-735; ui/src/virtualList/virtualList.ts: 1575-1600
- packages/oxlint-plugin-foldkit/src/message.ts: 170-300; rules/no-child-message-construction-in-root.ts: 895-921
- packages/website/src/page/ui/{definition,composition}.ts heads; website/src/definition.ts; UiBlock grep (model.ts:47, view/blog.ts:33, composition/composition.ts:71)
- packages/foldkit/type-performance/README.md, fixtures.json; declaration-tests listing and tsconfig.base.json / tsconfig.consumer.json; scripts/check-emitted-declarations.ts head

## Boundaries

- The Definition can supply, without typing the producer: `Model` (same type parameter the Composition passes through), `OutMessage` presence and schema, and the `owner` type `Owner<Id, Concrete>`. It cannot supply `Message` (the dispatch schema depends on `Children`), `mounts`, `bindings`, `init`, `update`, or anything else.
- The shape question is a property-modifier question. Whether `OutMessage` and `[DefaultViewTypeId]` are required or `?: never` is fixed when the interface is chosen. A conditional or mapped type that depends on the producer would make property lookup on `UiBlock` resolve the producer. OutMessage presence is fine because the Definition knows it. View presence is not.
- Probe results for each encoding of the view member when view presence is unknown (`scratchpad/shapes-probe/probe2.ts`, `probe4.ts`):
  - Required `[DefaultViewTypeId]: ProducedMember<...>`, the prototype's encoding. For a headless producer the member resolves to `undefined`: under `exactOptionalPropertyTypes`, `{ [K]?: never }[K]` is `undefined`.
    - `embedView` correctly falls back to the alternate-view-only signature.
    - The produced block fails `extends Block.AnyBlock`. Probe: `typeof BBlock extends Block.AnyBlock` gives "fails" for both headless shapes (B: no OutMessage, D: OutMessage), while the plain assembled headless block passes. A required `undefined` does not fit `[DefaultViewTypeId]?: AnyAuthoredView` under `exactOptionalPropertyTypes`.
    - `Program.makeElement({ block: producedHeadless })` reports TS2589 "Type instantiation is excessively deep and possibly infinite" plus the overload failure. The assembled headless block reports only the clean overload failure.
  - Required `[DefaultViewTypeId]: never`. A headless block then gets a phantom canonical `embedView` overload (two call signatures instead of one). It passes `AnyBlock`, and Program rejects it.
  - Optional `[DefaultViewTypeId]?: View`. A view block loses its canonical `embedView` overload, `DefaultViewOf` becomes `never`, and `Program.makeElement` rejects a block that has a view.
  - So no single interface encodes "view unknown" correctly for every consumer. View presence has to be selected without typing the producer: a separate entry point, an explicit type-level flag, or an interface choice the caller makes.
- `keyof` is safe. Probe: `Equal<keyof typeof produced, keyof typeof assembled>` is `true` for both the view and headless cases, because the produced interfaces declare the same 20 keys (18 contract members + `OutMessage` + `[DefaultViewTypeId]`).
- The produced interfaces drop members outside the contract. A producer returning a Query block (extra `Fetch`, `read`, `run`, `toLayer`, and so on) or any `Object.assign`-enriched block would lose those members at the type level, though they exist at runtime.

## Non-Obvious Things

- The prototype does not reject a producer from another Definition. Probe E (`probe.ts`): `EDef.produceBlock(() => BAssembled)` compiles. `EBlock.Model` is E's `OtherModel`, `EBlock.owner` is `Owner<"B", true>`, and `ReturnType<typeof EBlock.init>` is B's `{ model: { count: number } }`. No error appears anywhere until a consumer happens to notice the mismatch.
- Rejection that keeps the deferral has to be lazy, inside `ProducedMember`. For example, gate `Completed[Key]` on `Completed extends Readonly<{ owner: Owner<Id, Concrete>; Model: ModelSchema }>`, which needs `Id`/`Concrete` threaded into the produced interfaces. Any check placed on the parameter (`produce: Producer & Validate<Producer>`) or a constraint (`Producer extends () => AnyBlock`) is evaluated during call resolution, and reading `typeof UiBlock` triggers call resolution. That reasoning is inferred from TS call-resolution behavior and the prototype's commit message, not measured here.
  - Consequence: the error then surfaces where a member is read (`makeBinding`, `Program`) as "`InvalidBlockProducer` is not assignable to `Owner<any>`", not at the `produceBlock` call.
- Owner identity alone is weak:
  - `Owner<Id, Concrete>` carries only the id string and the concrete flag, so two Definitions with the same id have identical owner types.
  - At runtime, one namespace (`makeNamespace`) shares one `owner` object across every `Namespace.makeDefinition` call (named.ts:575, 620).
  - A runtime check of `block.owner === base.owner && block.Model === base.Model` is available in `makeNamespace.makeDefinition` (define.ts:269-282). Completed blocks carry the same `owner` and `config.Model` objects (definition.ts:4184-4185). Nothing links a block back to the specific Definition object that made its Composition.
- `ProducedMember` matches `(...args: ReadonlyArray<any>) => infer`. Using `() => infer Completed` would reject thunks with required parameters, since a function with more required parameters is not assignable to `() => ...`. A non-function argument (`produceBlock(block)`) yields a valid-looking `.Model` and `InvalidBlockProducer` for every other member.
- An erased implementation (overload 7) returns `never` silently (probe3 `AErased`). Through `produceBlock`, `.Model` still looks valid while every other member is `InvalidBlockProducer` (probe3 `n6`, `n7`). The `[BlockValue] extends [never]` gate at programRoot.ts:154 therefore never fires for a produced block. The failure moves to the `AnyBlock` constraint.
- `provideHandlers` is the type `never` on blocks without host handlers (probe3 `n9`). `ProducedMember` passes `never` through, which matches the original.
- `CompletedWithView` is returned only by overload 5 (no OutMessage, view, no `EffectsLayer`), which is UiBlock's path. A view block with OutMessage and no `EffectsLayer` goes through overload 6 and returns `CompletedBlockWithViewAndOutMessage` directly. `CompletedWithViewAndOutMessage` is annotation-only.
- `BlockModel` in binding.ts:394 reads `Parameters<BlockValue['update']>[0]` rather than `BlockValue['Model']['Type']`, so some binding paths type the producer through `update` even where only the Model would be needed.
- `__blockHandlerRequirements`, `[DefaultViewTypeId]`, and the `never` from `provideHandlers` are phantom or type-only. `[LocalMountsTypeId]` and `[LocalEffectsLayerTypeId]` are real runtime properties.
- `@foldkit/ui` already avoids inference cost with explicit `Block.CompletedWithViewAndOutMessage<typeof Composition, typeof implementation>` annotations. The implementation is a separately declared const, so this is the existing alternative pattern.
- The lint plugin's syntactic detection of completed Blocks (`isOwnedDefinitionCall(init, 'assembleBlock')`) does not see through `produceBlock(() => X.assembleBlock(...))`, because the initializer is the `produceBlock` call. Same-file `makeBinding` use still marks it. Cross-file bindings, such as UiBlock bound in `composition/composition.ts`, do not.

## Open Questions

- Gates not traced in depth from this angle:
  - `check:emitted-declarations` compiles declaration fixtures and probes Binding completions through the TS API (scripts/check-emitted-declarations.ts).
  - `check:block-type-performance` gates `Instantiations`/`Types` on three fixtures that do not use `produceBlock`.
  - Unknown: whether the emitted `.d.ts` for a produced block (which must print `Producer`'s type, so the emitter types the thunk) stays portable, and whether a fixture or declaration test is required for the new API.
- Whether the oxlint rules `got-block-message-name`, `got-prefix-requires-block-payload`, and `no-child-message-construction-in-root` miss real cases for a `produceBlock` initializer. Not tested.
- Whether `ProducedMember` evaluation at binding sites costs more than the direct interface (an extra conditional per member). Not measured.
- Without `exactOptionalPropertyTypes`, the prototype's headless `undefined` member would pass `AnyBlock`. Consumer tsconfigs vary; only the repo's strict setting was probed.
