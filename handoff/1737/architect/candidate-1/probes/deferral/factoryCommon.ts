import { Layer, Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Update from 'foldkit/update'
import { modifyFields } from 'foldkit/struct'

export const Model = Schema.Struct({ count: Schema.Number, label: Schema.String })
export const ChildMessage = Message.defineMessageUnion({ Clicked: {}, Renamed: { label: Schema.String } })
export const ChildOutMessage = Message.defineMessageUnion({ Chose: { label: Schema.String } })
export const FactoryNamespace = Block.makeNamespace('Factory')
export const makeParts = <Item extends string>() => {
  const Definition = FactoryNamespace.makeDefinition({ Model, Message: ChildMessage, OutMessage: ChildOutMessage })
  const Composition = Definition.makeComposition()
  const update = Composition.makeUpdate((model, message) =>
    ChildMessage.match<Update.ReturnWithOutMessage<typeof Model.Type, typeof ChildMessage.Type, typeof ChildOutMessage.Type>>(message, {
      Clicked: () => ({ model: modifyFields(model, { count: count => count + 1 }) }),
      Renamed: ({ label }) => ({ model: modifyFields(model, { label: () => label }), outMessage: ChildOutMessage.Chose({ label }) }),
    }),
  )
  const view = Composition.makeView((model, h) => h.div([], [h.span([], [model.label])]))
  const items: ReadonlyArray<Item> = []
  const init = Composition.makeInit(() => ({ model: Model.make({ count: 0, label: '' }) }))
  return { Definition, composition: Composition, implementation: { init, update, view, operations: { rename: (label: Item) => [ChildMessage.Renamed({ label })] }, EffectsLayer: Layer.empty }, items }
}
