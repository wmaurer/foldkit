import { Schema } from 'effect'
import { Block } from 'foldkit'
import * as Message from 'foldkit/message'

export const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
export const ChildDefinition = Block.makeDefinition('XChild', { Model, Message: ChildMessage })
const ChildComposition = ChildDefinition.makeComposition()
const assembleChild = () =>
  ChildComposition.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: ChildComposition.makeUpdate((model, _message) => ({ model })),
    view: ChildComposition.makeView((model, h) => h.div([], [String(model.count)])),
  })
export const ChildBlock = ChildDefinition.produceBlock(assembleChild)
