import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Update from 'foldkit/update'

const Model = Schema.Struct({ count: Schema.Number, label: Schema.String, items: Schema.Array(Schema.String) })
const ChildMessage = Message.defineMessageUnion({
  Clicked: {},
  Renamed: { label: Schema.String },
  Added: { item: Schema.String },
  Removed: { index: Schema.Number },
})

export const EagerDefinition = Block.makeDefinition('Eager', { Model, Message: ChildMessage })
const EagerComposition = EagerDefinition.makeComposition()
export const Eager = EagerComposition.assembleBlock({
  init: EagerComposition.makeInit(() => ({ model: Model.make({ count: 0, label: '', items: [] }) })),
  update: EagerComposition.makeUpdate((model, message) =>
    ChildMessage.match<Update.Return<typeof Model.Type, typeof ChildMessage.Type>>(message, {
      Clicked: () => ({ model: { ...model, count: model.count + 1 } }),
      Renamed: ({ label }) => ({ model: { ...model, label } }),
      Added: ({ item }) => ({ model: { ...model, items: [...model.items, item] } }),
      Removed: () => ({ model }),
    }),
  ),
  view: EagerComposition.makeView((model, h) =>
    h.div([h.Class('root')], [
      h.span([], [String(model.count)]),
      h.button([h.OnClick(ChildMessage.Clicked())], ['+']),
      h.ul([], model.items.map(item => h.li([], [item]))),
      h.input([h.Value(model.label), h.OnInput(label => ChildMessage.Renamed({ label }))]),
    ]),
  ),
})

export const read = Eager.init
