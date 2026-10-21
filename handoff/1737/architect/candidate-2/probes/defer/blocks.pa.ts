import { Schema } from 'effect'
import * as Block from 'foldkit-proto/block'
import * as Message from 'foldkit-proto/message'

export const Model = Schema.Struct({ count: Schema.Number, label: Schema.String })
const ChildMessage = Message.defineMessageUnion({ Clicked: {}, Reset: {} })
const GrandDef = Block.makeDefinition('Grand', { Model, Message: ChildMessage })
const GrandComp = GrandDef.makeComposition()
const GrandBlock = GrandComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0, label: '' }) }),
  update: GrandComp.makeUpdate((model, _message) => ({ model })),
  view: GrandComp.makeView((model, h) => h.div([], [String(model.count)])),
})
export const ParentModel = Schema.Struct({ child: Model, other: Model })
const Def = Block.makeDefinition('Parent', { Model: ParentModel, Message: ChildMessage })
const First = Def.makeBinding(GrandBlock, { field: 'child' })
const Second = Def.makeBinding(GrandBlock, { field: 'other', placement: 'Second' })
const Comp = Def.makeComposition({ bindings: [First, Second] })
export const V = Def.produceBlock(() => Comp.assembleBlock({
    init: () => ({ model: ParentModel.make({ child: Model.make({ count: 0, label: "" }), other: Model.make({ count: 0, label: "" }) }) }),
    update: Comp.makeUpdate((model, _message) => ({ model })),
    view: Comp.makeView((model, h) => h.div([], [String(model.child.count)])),
  }))
