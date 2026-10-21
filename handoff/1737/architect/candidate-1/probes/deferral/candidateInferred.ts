import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Update from 'foldkit/update'
import { modifyFields } from 'foldkit/struct'
import { producerOf, type ProduceMethods } from '../produced.js'

const Model = Schema.Struct({ count: Schema.Number, label: Schema.String, items: Schema.Array(Schema.String) })
const ChildMessage = Message.defineMessageUnion({ Clicked: {}, Renamed: { label: Schema.String }, Added: { item: Schema.String }, Cleared: {} })
const Definition = Block.makeDefinition('CandidateInferred', { Model, Message: ChildMessage })
const Composition = Definition.makeComposition()
const update = Composition.makeUpdate((model, message) =>
  ChildMessage.match<Update.Return<typeof Model.Type, typeof ChildMessage.Type>>(message, {
    Clicked: () => ({ model: modifyFields(model, { count: count => count + 1 }) }),
    Renamed: ({ label }) => ({ model: modifyFields(model, { label: () => label }) }),
    Added: ({ item }) => ({ model: modifyFields(model, { items: items => [...items, item] }) }),
    Cleared: () => ({ model: modifyFields(model, { items: () => [] }) }),
  }),
)
const view = Composition.makeView((model, h) =>
  h.div([], [h.span([], [String(model.count)]), h.span([], [model.label]), h.ul([], model.items.map(item => h.li([], [item])))]),
)
const init = Composition.makeInit(() => ({ model: Model.make({ count: 0, label: '', items: [] }) }))
declare const methods: ProduceMethods<Block.Owner<'CandidateInferred', true>, typeof Model, undefined>
void producerOf
void methods
export const TheBlock = producerOf(Definition).produceBlock(() => Composition.assembleBlock({ init, update, view }))
