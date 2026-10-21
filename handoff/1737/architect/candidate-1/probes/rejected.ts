import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Program from 'foldkit/program'

import { producerOf } from './produced.js'

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false
type Assert<Value extends true> = Value

const Model = Schema.Struct({ count: Schema.Number })
const OtherModel = Schema.Struct({ name: Schema.String })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })

const ADefinition = Block.makeDefinition('RejectA', { Model, Message: ChildMessage })
const AComposition = ADefinition.makeComposition()
const AAssembled = AComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: AComposition.makeUpdate((model, _message) => ({ model })),
  view: AComposition.makeView((model, h) => h.div([], [String(model.count)])),
})
const BDefinition = Block.makeDefinition('RejectB', { Model, Message: ChildMessage })
const BComposition = BDefinition.makeComposition()
const BAssembled = BComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: BComposition.makeUpdate((model, _message) => ({ model })),
})
const GDefinition = Block.makeDefinition('RejectG', { Model, Message: ChildMessage })
const GComposition = GDefinition.makeComposition()
const GAssembled = GComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: GComposition.makeUpdate((model, _message) => ({ model })),
  view: GComposition.makeView((model, h) => h.div([], [String(model.count)])),
})
const SameIdOtherModel = Block.makeDefinition('RejectA', { Model: OtherModel, Message: ChildMessage })

const ParentModel = Schema.Struct({ a: Model, other: OtherModel })
const ParentMessage = Message.defineMessageUnion({ Noted: {} })
const ParentDefinition = Block.makeDefinition('RejectParent', {
  Model: ParentModel,
  Message: ParentMessage,
})

const ForeignId = producerOf(ADefinition).produceBlock(() => GAssembled)
// @ts-expect-error a Block of another Definition cannot be bound
export const ForeignIdBinding = ParentDefinition.makeBinding(ForeignId, { field: 'a' })
// @ts-expect-error a Block of another Definition is not a completed Block
export const ForeignIdAny: Block.AnyBlock = ForeignId
// @ts-expect-error a Block of another Definition cannot be a Program root
export const ForeignIdRoot = Program.makeElement({ block: ForeignId, container: document.body })

const ForeignModel = producerOf(SameIdOtherModel).produceBlock(() => AAssembled)
// @ts-expect-error the same id with a different Model is another Definition
export const ForeignModelBinding = ParentDefinition.makeBinding(ForeignModel, { field: 'other' })

declare const neverProducer: never
const NeverProducer = producerOf(ADefinition).produceBlock(neverProducer)
// @ts-expect-error a never producer is rejected
export const NeverProducerBinding = ParentDefinition.makeBinding(NeverProducer, { field: 'a' })

declare const erasedProducer: () => never
const Erased = producerOf(ADefinition).produceBlock(erasedProducer)
// @ts-expect-error an erased implementation is rejected
export const ErasedRoot = Program.makeElement({ block: Erased, container: document.body })

const NotAFunction = producerOf(ADefinition).produceBlock(AAssembled)
// @ts-expect-error a producer must be a function
export const NotAFunctionBinding = ParentDefinition.makeBinding(NotAFunction, { field: 'a' })

const WithParameter = producerOf(ADefinition).produceBlock((_isReady: boolean) => AAssembled)
// @ts-expect-error a producer must take no parameters
export const WithParameterBinding = ParentDefinition.makeBinding(WithParameter, { field: 'a' })

declare const anyValue: any
const ReturnsAny = producerOf(ADefinition).produceBlock(() => anyValue)
// @ts-expect-error a producer returning any is rejected
export const ReturnsAnyBinding = ParentDefinition.makeBinding(ReturnsAny, { field: 'a' })
const AnyProducer = producerOf(ADefinition).produceBlock(anyValue)
// @ts-expect-error an any producer is rejected
export const AnyProducerBinding = ParentDefinition.makeBinding(AnyProducer, { field: 'a' })

const DeclaredViewButViewless = producerOf(BDefinition).produceBlock(() => BAssembled)
// @ts-expect-error produceBlock needs a Block with a default view
export const DeclaredViewBinding = ParentDefinition.makeBinding(DeclaredViewButViewless, { field: 'a' })

const DeclaredViewlessButView = producerOf(ADefinition).produceViewlessBlock(() => AAssembled)
// @ts-expect-error produceViewlessBlock needs a Block without a default view
export const DeclaredViewlessBinding = ParentDefinition.makeBinding(DeclaredViewlessButView, { field: 'a' })

const Viewless = producerOf(BDefinition).produceViewlessBlock(() => BAssembled)
// @ts-expect-error a viewless Block cannot be a page-owning Program root
export const ViewlessRoot = Program.makeElement({ block: Viewless, container: document.body })

const Enriched = producerOf(ADefinition).produceBlock(() => Object.assign(AAssembled, { extra: 1 }))
// @ts-expect-error members added before production are rejected
export const EnrichedBinding = ParentDefinition.makeBinding(Enriched, { field: 'a' })

const Own = producerOf(ADefinition).produceBlock(() => AAssembled)
// @ts-expect-error the member equality helper is not vacuous
export type NotVacuous = Assert<Equal<typeof Own.init, typeof BAssembled.Message>>
// @ts-expect-error the Model of a produced Block is the Definition's Model
export type ModelIsDefinitions = Assert<Equal<typeof Own.Model, typeof OtherModel>>
