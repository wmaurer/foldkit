import { Schema } from 'effect'
import { Block, Message } from 'foldkit'

export const Model = Schema.Struct({ count: Schema.Number })
export const OtherModel = Schema.Struct({ name: Schema.String })
export const CounterMessage = Message.defineMessageUnion({
  ClickedIncrement: {},
  CompletedSaveCount: {},
})
export const CounterOutMessage = Message.defineMessageUnion({
  ReachedLimit: {},
})

const HostNamespace = Block.makeNamespace('ProducedHost')
export const SaveCount = HostNamespace.makeCommand('SaveCount', {
  args: { count: Schema.Number },
  messages: [CounterMessage.CompletedSaveCount],
})

export const ViewDefinition = Block.makeDefinition('ProducedView', {
  Model,
  Message: CounterMessage,
})
export const ViewlessDefinition = Block.makeDefinition('ProducedViewless', {
  Model,
  Message: CounterMessage,
})
export const ViewOutDefinition = Block.makeDefinition('ProducedViewOut', {
  Model,
  Message: CounterMessage,
  OutMessage: CounterOutMessage,
})
export const ViewlessOutDefinition = Block.makeDefinition(
  'ProducedViewlessOut',
  { Model, Message: CounterMessage, OutMessage: CounterOutMessage },
)
export const HostDefinition = HostNamespace.makeDefinition({
  Model,
  Message: CounterMessage,
})
export const ForeignDefinition = Block.makeDefinition('ProducedForeign', {
  Model,
  Message: CounterMessage,
})
export const SameIdDefinition = Block.makeDefinition('ProducedView', {
  Model: OtherModel,
  Message: CounterMessage,
})
export const ParentDefinition = Block.makeDefinition('ProducedParent', {
  Model: Schema.Struct({ child: Model }),
  Message: Message.defineMessageUnion({ ClickedParent: {} }),
})
