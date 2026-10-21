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

export const ProducedDefinition = Block.makeDefinition('Produced', { Model, Message: ChildMessage })
const ProducedComposition = ProducedDefinition.makeComposition()
export const Produced = ProducedDefinition.produceBlock(() =>
  ProducedComposition.assembleBlock({
    init: ProducedComposition.makeInit(() => ({ model: Model.make({ count: 0, label: '', items: [] }) })),
    update: ProducedComposition.makeUpdate((model, message) =>
      ChildMessage.match<Update.Return<typeof Model.Type, typeof ChildMessage.Type>>(message, {
        Clicked: () => ({ model: { ...model, count: model.count + 1 } }),
        Renamed: ({ label }) => ({ model: { ...model, label } }),
        Added: ({ item }) => ({ model: { ...model, items: [...model.items, item] } }),
        Removed: () => ({ model }),
      }),
    ),
    view: ProducedComposition.makeView((model, h) =>
      h.div([h.Class('root')], [
        h.span([], [String(model.count)]),
        h.button([h.OnClick(ChildMessage.Clicked())], ['+']),
        h.ul([], model.items.map(item => h.li([], [item]))),
        h.input([h.Value(model.label), h.OnInput(label => ChildMessage.Renamed({ label }))]),
      ]),
    ),
  }),
)
