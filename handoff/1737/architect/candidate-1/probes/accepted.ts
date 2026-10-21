import { Effect, Layer, Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Program from 'foldkit/program'
import * as Command from 'foldkit/command'
import * as Update from 'foldkit/update'

import type { DefaultViewOf } from '../../../wt-base/packages/foldkit/dist/block/defaultView.js'
import { producerOf } from './produced.js'

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false
type Assert<Value extends true> = Value
type EveryMemberEqual<Produced, Assembled> = {
  [Key in keyof Assembled]-?: Key extends keyof Produced
    ? Equal<Produced[Key], Assembled[Key]>
    : false
}[keyof Assembled]
type Same<Produced, Assembled> = [
  Equal<keyof Produced, keyof Assembled>,
  EveryMemberEqual<Produced, Assembled>,
]

const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {}, CompletedObserve: {} })
const ChildOutMessage = Message.defineMessageUnion({ Finished: {} })

// A: view, no OutMessage (the UiBlock shape, assembleBlock overload 5)
const ADefinition = Block.makeDefinition('ProbeA', { Model, Message: ChildMessage })
const AComposition = ADefinition.makeComposition()
const AAssembled = AComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: AComposition.makeUpdate((model, _message) => ({ model })),
  view: AComposition.makeView((model, h) => h.div([], [String(model.count)])),
})
export const ABlock = producerOf(ADefinition).produceBlock(() => AAssembled)

// B: viewless, no OutMessage
const BDefinition = Block.makeDefinition('ProbeB', { Model, Message: ChildMessage })
const BComposition = BDefinition.makeComposition()
const BAssembled = BComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: BComposition.makeUpdate((model, _message) => ({ model })),
})
export const BBlock = producerOf(BDefinition).produceViewlessBlock(() => BAssembled)

// C: view and OutMessage
const CDefinition = Block.makeDefinition('ProbeC', {
  Model,
  Message: ChildMessage,
  OutMessage: ChildOutMessage,
})
const CComposition = CDefinition.makeComposition()
const CAssembled = CComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: CComposition.makeUpdate((model, _message) => ({ model })),
  view: CComposition.makeView((model, h) => h.div([], [String(model.count)])),
})
export const CBlock = producerOf(CDefinition).produceBlock(() => CAssembled)

// D: viewless with OutMessage
const DDefinition = Block.makeDefinition('ProbeD', {
  Model,
  Message: ChildMessage,
  OutMessage: ChildOutMessage,
})
const DComposition = DDefinition.makeComposition()
const DAssembled = DComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: DComposition.makeUpdate((model, _message) => ({ model })),
})
export const DBlock = producerOf(DDefinition).produceViewlessBlock(() => DAssembled)

// E: replaceEffectsLayer result (Block<...> intersection)
const EDefinition = Block.makeDefinition('ProbeE', { Model, Message: ChildMessage })
const EComposition = EDefinition.makeComposition()
const EAssembled = EComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: EComposition.makeUpdate((model, _message) => ({ model })),
  view: EComposition.makeView((model, h) => h.div([], [String(model.count)])),
  EffectsLayer: Layer.empty,
}).replaceEffectsLayer(Layer.empty)
export const EBlock = producerOf(EDefinition).produceBlock(() => EAssembled)

// F: provideHandlers result
const FDefinition = Block.makeDefinition('ProbeF', { Model, Message: ChildMessage })
const Observe = FDefinition.makeCommand('Observe', {
  args: {},
  messages: [ChildMessage.CompletedObserve],
})
const FComposition = FDefinition.makeComposition()
const FAssembled = FComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: FComposition.makeUpdate((model, message) =>
    ChildMessage.match<Update.Return<typeof Model.Type, typeof ChildMessage.Type, Command.HandlerOf<typeof Observe>>>(message, {
      Clicked: () => ({ model, commands: [Observe({})] }),
      CompletedObserve: () => ({ model }),
    }),
  ),
  view: FComposition.makeView((model, h) => h.div([], [String(model.count)])),
  operations: { click: () => [ChildMessage.Clicked()] },
  EffectsLayer: Layer.empty,
  hostHandlers: [Observe],
})
const FProvided = FAssembled.provideHandlers(
  Observe.toLayer(Effect.succeed(() => Effect.succeed(ChildMessage.CompletedObserve()))),
)
export const FHostBlock = producerOf(FDefinition).produceBlock(() => FAssembled)
export const FBlock = producerOf(FDefinition).produceBlock(() => FProvided)

export type SameA = Assert<Equal<Same<typeof ABlock, typeof AAssembled>, [true, true]>>
export type SameB = Assert<Equal<Same<typeof BBlock, typeof BAssembled>, [true, true]>>
export type SameC = Assert<Equal<Same<typeof CBlock, typeof CAssembled>, [true, true]>>
export type SameD = Assert<Equal<Same<typeof DBlock, typeof DAssembled>, [true, true]>>
export type SameE = Assert<Equal<Same<typeof EBlock, typeof EAssembled>, [true, true]>>
export type FAssembledIsNever = Assert<Equal<[typeof FAssembled] extends [never] ? 1 : 0, 0>>
export type SameFHost = Assert<Equal<Same<typeof FHostBlock, typeof FAssembled>, [true, true]>>
export type SameF = Assert<Equal<Same<typeof FBlock, typeof FProvided>, [true, true]>>

export type AnyA = Assert<typeof ABlock extends Block.AnyBlock ? true : false>
export type AnyB = Assert<typeof BBlock extends Block.AnyBlock ? true : false>
export type AnyC = Assert<typeof CBlock extends Block.AnyBlock ? true : false>
export type AnyD = Assert<typeof DBlock extends Block.AnyBlock ? true : false>
export type AnyE = Assert<typeof EBlock extends Block.AnyBlock ? true : false>
export type AnyF = Assert<typeof FBlock extends Block.AnyBlock ? true : false>

export type DefaultViewA = Assert<
  Equal<DefaultViewOf<typeof ABlock>, DefaultViewOf<typeof AAssembled>>
>
export type DefaultViewB = Assert<Equal<DefaultViewOf<typeof BBlock>, never>>

const ParentModel = Schema.Struct({ a: Model, b: Model, c: Model, d: Model })
const ParentMessage = Message.defineMessageUnion({ Noted: {} })
const ParentDefinition = Block.makeDefinition('ProbeParent', {
  Model: ParentModel,
  Message: ParentMessage,
})
export const ABinding = ParentDefinition.makeBinding(ABlock, { field: 'a' })
export const AAssembledBinding = ParentDefinition.makeBinding(AAssembled, { field: 'a' })
export const BBinding = ParentDefinition.makeBinding(BBlock, { field: 'b' })
export const BAssembledBinding = ParentDefinition.makeBinding(BAssembled, { field: 'b' })
export const CBinding = ParentDefinition.makeBinding(CBlock, { field: 'c' })
export const CAssembledBinding = ParentDefinition.makeBinding(CAssembled, { field: 'c' })
export const DBinding = ParentDefinition.makeBinding(DBlock, { field: 'd' })
export const DAssembledBinding = ParentDefinition.makeBinding(DAssembled, { field: 'd' })

export type EmbedA = Assert<
  Equal<typeof ABinding.embedView, typeof AAssembledBinding.embedView>
>
export type EmbedB = Assert<
  Equal<typeof BBinding.embedView, typeof BAssembledBinding.embedView>
>
export type EmbedC = Assert<
  Equal<typeof CBinding.embedView, typeof CAssembledBinding.embedView>
>
export type EmbedD = Assert<
  Equal<typeof DBinding.embedView, typeof DAssembledBinding.embedView>
>
export type BindingKeysC = Assert<
  Equal<keyof typeof CBinding, keyof typeof CAssembledBinding>
>

export const ARoot = Program.makeElement({ block: ABlock, container: document.body })
export type ModelOnly = Assert<Equal<typeof ABlock.Model, typeof Model>>
