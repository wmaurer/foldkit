import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'

export const Model = Schema.Struct({ count: Schema.Number })
export const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
export const ChildOutMessage = Message.defineMessageUnion({ Done: {} })

export const ViewDefinition = Block.makeDefinition('EmitView', { Model, Message: ChildMessage })
export const ViewComposition = ViewDefinition.makeComposition()
export const ViewBlock = ViewDefinition.produceBlock(() =>
  ViewComposition.assembleBlock({
    init: ViewComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
    update: ViewComposition.makeUpdate((model, _message) => ({ model })),
    view: ViewComposition.makeView((model, h) => h.div([], [String(model.count)])),
  }),
)

export const HeadlessDefinition = Block.makeDefinition('EmitHeadless', { Model, Message: ChildMessage, OutMessage: ChildOutMessage })
export const HeadlessComposition = HeadlessDefinition.makeComposition()
export const HeadlessBlock = HeadlessDefinition.produceBlock(() =>
  HeadlessComposition.assembleBlock({
    init: HeadlessComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
    update: HeadlessComposition.makeUpdate((model, _message) => ({ model })),
  }),
)
