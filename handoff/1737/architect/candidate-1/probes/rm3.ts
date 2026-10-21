import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Program from 'foldkit/program'
const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
const ADefinition = Block.makeDefinition('RejectA', { Model, Message: ChildMessage })
const GDefinition = Block.makeDefinition('RejectG', { Model, Message: ChildMessage })
const GComposition = GDefinition.makeComposition()
const GAssembled = GComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: GComposition.makeUpdate((model, _message) => ({ model })),
  view: GComposition.makeView((model, h) => h.div([], [String(model.count)])),
})
const Prototype = ADefinition.produceBlock(() => GAssembled)
const ProtoNotFn = ADefinition.produceBlock(GAssembled)
export const R1 = Program.makeElement({ block: ProtoNotFn, container: document.body })
export const R2 = Program.makeElement({ block: Prototype, container: document.body })
