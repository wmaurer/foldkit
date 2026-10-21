import { Schema } from 'effect'
import { Block } from 'foldkit'
import { defineMessageUnion } from 'foldkit/message'

export const Model = Schema.Struct({ count: Schema.Number })
export const OtherModel = Schema.Struct({ name: Schema.String })
export const Message = defineMessageUnion({ Clicked: {} })
export const OutMessage = defineMessageUnion({ Done: {} })

export const ViewDefinition = Block.makeDefinition('ProduceView', {
  Model,
  Message,
})
export const ViewOutDefinition = Block.makeDefinition('ProduceViewOut', {
  Model,
  Message,
  OutMessage,
})
export const HeadlessDefinition = Block.makeDefinition('ProduceHeadless', {
  Model,
  Message,
})
export const HeadlessOutDefinition = Block.makeDefinition(
  'ProduceHeadlessOut',
  { Model, Message, OutMessage },
)
export const ForeignDefinition = Block.makeDefinition('ProduceForeign', {
  Model: OtherModel,
  Message,
})
export const SameModelDefinition = Block.makeDefinition('ProduceSameModel', {
  Model,
  Message,
})
export const SameIdDefinition = Block.makeDefinition('ProduceView', {
  Model: OtherModel,
  Message,
})
export const TwinDefinition = Block.makeDefinition('ProduceView', {
  Model,
  Message,
})
export const OutTwinDefinition = Block.makeDefinition('ProduceView', {
  Model,
  Message,
  OutMessage,
})
export const ParentDefinition = Block.makeDefinition('ProduceParent', {
  Model: Schema.Struct({ child: Model }),
  Message: defineMessageUnion({ Noted: {} }),
})
