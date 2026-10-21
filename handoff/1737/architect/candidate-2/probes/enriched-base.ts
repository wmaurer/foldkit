import { Schema } from 'effect'
import * as BlockModule from 'foldkit/block'
import * as Message from 'foldkit/message'

const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
export const OwnDef = BlockModule.makeDefinition('OwnEnriched', { Model, Message: ChildMessage })
const OwnComp = OwnDef.makeComposition()
export const assembleOwn = () =>
  OwnComp.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: OwnComp.makeUpdate((model, _message) => ({ model })),
    view: OwnComp.makeView((model, h) => h.div([], [String(model.count)])),
  })
export const Ok = 1
