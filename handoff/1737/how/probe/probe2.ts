import { Schema } from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/node_modules/effect/dist/index.js'
import * as Block from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/src/block/public.ts'
import type { DefaultViewTypeId } from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/src/block/defaultView.ts'
import type { LocalEffectsLayerTypeId, LocalMountsTypeId } from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/src/block/definition.ts'
import * as Message from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/src/message/public.ts'

type Invalid = Readonly<{ 'Block producer must return a completed Block': never }>
type Foreign<O> = Readonly<{ 'Block producer must return a Block of this Definition': O }>
type Member<OwnerValue, ModelSchema, Producer, Key extends PropertyKey> =
  [Producer] extends [never] ? Invalid
  : Producer extends (...args: ReadonlyArray<any>) => infer C
    ? [C] extends [never] ? Invalid
      : C extends Readonly<{ owner: infer O; Model: infer M }>
        ? [O, OwnerValue] extends [OwnerValue, O]
          ? [M, ModelSchema] extends [ModelSchema, M]
            ? Key extends keyof C ? C[Key] : Invalid
            : Foreign<M>
          : Foreign<O>
        : Invalid
    : Invalid
interface Produced<OwnerValue, ModelSchema extends Schema.Codec<any, any, any, any>, P> {
  readonly Model: ModelSchema
  readonly owner: Member<OwnerValue, ModelSchema, P, 'owner'>
  readonly Message: Member<OwnerValue, ModelSchema, P, 'Message'>
  readonly mounts: Member<OwnerValue, ModelSchema, P, 'mounts'>
  readonly [LocalMountsTypeId]: Member<OwnerValue, ModelSchema, P, typeof LocalMountsTypeId>
  readonly bindings: Member<OwnerValue, ModelSchema, P, 'bindings'>
  readonly init: Member<OwnerValue, ModelSchema, P, 'init'>
  readonly update: Member<OwnerValue, ModelSchema, P, 'update'>
  readonly operations: Member<OwnerValue, ModelSchema, P, 'operations'>
  readonly subscriptions: Member<OwnerValue, ModelSchema, P, 'subscriptions'>
  readonly managedResources: Member<OwnerValue, ModelSchema, P, 'managedResources'>
  readonly EffectsLayer: Member<OwnerValue, ModelSchema, P, 'EffectsLayer'>
  readonly [LocalEffectsLayerTypeId]: Member<OwnerValue, ModelSchema, P, typeof LocalEffectsLayerTypeId>
  readonly __blockHandlerRequirements: Member<OwnerValue, ModelSchema, P, '__blockHandlerRequirements'>
  readonly hostHandlers: Member<OwnerValue, ModelSchema, P, 'hostHandlers'>
  readonly makeView: Member<OwnerValue, ModelSchema, P, 'makeView'>
  readonly replaceEffectsLayer: Member<OwnerValue, ModelSchema, P, 'replaceEffectsLayer'>
  readonly provideHandlers: Member<OwnerValue, ModelSchema, P, 'provideHandlers'>
  readonly OutMessage?: never
  readonly [DefaultViewTypeId]: Member<OwnerValue, ModelSchema, P, typeof DefaultViewTypeId>
}
const ModelA = Schema.Struct({ a: Schema.String })
const ModelB = Schema.Struct({ b: Schema.Number })
const Msg = Message.defineMessageUnion({ Clicked: {} })
const DefA = Block.makeDefinition('Same', { Model: ModelA, Message: Msg })
const DefSameId = Block.makeDefinition('Same', { Model: ModelA, Message: Msg })
const DefB = Block.makeDefinition('Other', { Model: ModelB, Message: Msg })
const DefC = Block.makeDefinition('Third', { Model: ModelA, Message: Msg })
declare function produce<O, M extends Schema.Codec<any, any, any, any>>(definition: { owner: O; Model: M }): <P>(p: P) => Produced<O, M, P>
const CompA = DefA.makeComposition()
const CompB = DefB.makeComposition()
const CompC = DefC.makeComposition()
const CompSameId = DefSameId.makeComposition()
const viewA = CompA.makeView((_m, h) => h.div([]))
const viewB = CompB.makeView((_m, h) => h.div([]))
const viewC = CompC.makeView((_m, h) => h.div([]))
const viewS = CompSameId.makeView((_m, h) => h.div([]))
export const Own = produce(DefA)(() => CompA.assembleBlock({ init: CompA.makeInit(() => ({ model: ModelA.make({ a: '' }) })), update: (model: typeof ModelA.Type) => ({ model }), view: viewA }))
export const ForeignModel = produce(DefA)(() => CompB.assembleBlock({ init: CompB.makeInit(() => ({ model: ModelB.make({ b: 1 }) })), update: (model: typeof ModelB.Type) => ({ model }), view: viewB }))
export const ForeignSameModel = produce(DefA)(() => CompC.assembleBlock({ init: CompC.makeInit(() => ({ model: ModelA.make({ a: '' }) })), update: (model: typeof ModelA.Type) => ({ model }), view: viewC }))
export const ForeignSameId = produce(DefA)(() => CompSameId.assembleBlock({ init: CompSameId.makeInit(() => ({ model: ModelA.make({ a: '' }) })), update: (model: typeof ModelA.Type) => ({ model }), view: viewS }))
const Parent = Block.makeDefinition('Parent', { Model: Schema.Struct({ x: ModelA }), Message: Msg })
export const b1 = Parent.makeBinding(Own, { field: 'x' })
export const b2 = Parent.makeBinding(ForeignModel, { field: 'x' })
export const b3 = Parent.makeBinding(ForeignSameModel, { field: 'x' })
export const b4 = Parent.makeBinding(ForeignSameId, { field: 'x' })
