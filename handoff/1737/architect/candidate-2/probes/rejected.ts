import { Layer, Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Program from 'foldkit/program'


const Model = Schema.Struct({ count: Schema.Number })
const OtherModel = Schema.Struct({ name: Schema.String })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
const ChildOut = Message.defineMessageUnion({ Done: {} })


const OwnDef = Block.makeDefinition('Own', { Model, Message: ChildMessage })
const OwnComp = OwnDef.makeComposition()
const ownImpl = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: OwnComp.makeUpdate((model, _message) => ({ model })),
  view: OwnComp.makeView((model, h) => h.div([], [String(model.count)])),
}
const ownHeadlessImpl = { init: ownImpl.init, update: ownImpl.update }
const OwnAssembled = OwnComp.assembleBlock(ownImpl)
const OwnHeadlessAssembled = OwnComp.assembleBlock(ownHeadlessImpl)

// foreign: different id, different Model
const ForeignDef = Block.makeDefinition('Foreign', { Model: OtherModel, Message: ChildMessage })
const ForeignComp = ForeignDef.makeComposition()
const ForeignAssembled = ForeignComp.assembleBlock({
  init: () => ({ model: OtherModel.make({ name: '' }) }),
  update: ForeignComp.makeUpdate((model, _message) => ({ model })),
  view: ForeignComp.makeView((_model, h) => h.div([])),
})
// different id, same Model
const SameModelDef = Block.makeDefinition('SameModel', { Model, Message: ChildMessage })
const SameModelComp = SameModelDef.makeComposition()
const SameModelAssembled = SameModelComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: SameModelComp.makeUpdate((model, _message) => ({ model })),
  view: SameModelComp.makeView((_model, h) => h.div([])),
})
// same id, different Model
const SameIdDef = Block.makeDefinition('Own', { Model: OtherModel, Message: ChildMessage })
const SameIdComp = SameIdDef.makeComposition()
const SameIdAssembled = SameIdComp.assembleBlock({
  init: () => ({ model: OtherModel.make({ name: '' }) }),
  update: SameIdComp.makeUpdate((model, _message) => ({ model })),
  view: SameIdComp.makeView((_model, h) => h.div([])),
})
// same id, same Model: type level cannot tell
const TwinDef = Block.makeDefinition('Own', { Model, Message: ChildMessage })
const TwinComp = TwinDef.makeComposition()
const TwinAssembled = TwinComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: TwinComp.makeUpdate((model, _message) => ({ model })),
  view: TwinComp.makeView((_model, h) => h.div([])),
})
// same id, same Model, but with OutMessage
const OutTwinDef = Block.makeDefinition('Own', { Model, Message: ChildMessage, OutMessage: ChildOut })
const OutTwinComp = OutTwinDef.makeComposition()
const OutTwinAssembled = OutTwinComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: OutTwinComp.makeUpdate((model, _message) => ({ model })),
  view: OutTwinComp.makeView((_model, h) => h.div([])),
})
const erased: Block.Implementation<typeof Model.Type, typeof ChildMessage.Type> = null!
const ErasedAssembled = OwnComp.assembleBlock(erased)

export const Good = OwnDef.produceBlock(() => OwnAssembled)
export const GoodHeadless = OwnDef.produceHeadlessBlock(() => OwnHeadlessAssembled)
export const GoodLayer = OwnDef.produceBlock(() => OwnAssembled.replaceEffectsLayer(Layer.empty))
export const BadForeign = OwnDef.produceBlock(() => ForeignAssembled)
export const BadSameModel = OwnDef.produceBlock(() => SameModelAssembled)
export const BadSameId = OwnDef.produceBlock(() => SameIdAssembled)
export const TwinOk = OwnDef.produceBlock(() => TwinAssembled)
export const BadOutTwin = OwnDef.produceBlock(() => OutTwinAssembled)
export const BadNever = OwnDef.produceBlock(null! as never)
export const BadNotFunction = OwnDef.produceBlock(OwnAssembled)
export const BadParameter = OwnDef.produceBlock((_value: number) => OwnAssembled)
export const OkOptionalParameter = OwnDef.produceBlock((_value?: number) => OwnAssembled)
export const BadAny = OwnDef.produceBlock(() => null! as any)
export const BadErased = OwnDef.produceBlock(() => ErasedAssembled)
export const BadViewDeclaredHeadless = OwnDef.produceBlock(() => OwnHeadlessAssembled)
export const BadHeadlessDeclaredView = OwnDef.produceHeadlessBlock(() => OwnAssembled)

const ParentModel = Schema.Struct({ child: Model })
const ParentDef = Block.makeDefinition('Parent', { Model: ParentModel, Message: Message.defineMessageUnion({ Noted: {} }) })
export const bindGood = ParentDef.makeBinding(Good, { field: 'child' })
export const bindGoodHeadless = ParentDef.makeBinding(GoodHeadless, { field: 'child' })
export const bindGoodLayer = ParentDef.makeBinding(GoodLayer, { field: 'child' })
export const bindForeign = ParentDef.makeBinding(BadForeign, { field: 'child' })
export const bindSameModel = ParentDef.makeBinding(BadSameModel, { field: 'child' })
export const bindSameId = ParentDef.makeBinding(BadSameId, { field: 'child' })
export const bindTwin = ParentDef.makeBinding(TwinOk, { field: 'child' })
export const bindOutTwin = ParentDef.makeBinding(BadOutTwin, { field: 'child' })
export const bindNever = ParentDef.makeBinding(BadNever, { field: 'child' })
export const bindNotFunction = ParentDef.makeBinding(BadNotFunction, { field: 'child' })
export const bindParameter = ParentDef.makeBinding(BadParameter, { field: 'child' })
export const bindOptionalParameter = ParentDef.makeBinding(OkOptionalParameter, { field: 'child' })
export const bindAny = ParentDef.makeBinding(BadAny, { field: 'child' })
export const bindErased = ParentDef.makeBinding(BadErased, { field: 'child' })
export const bindViewHeadless = ParentDef.makeBinding(BadViewDeclaredHeadless, { field: 'child' })
export const bindHeadlessView = ParentDef.makeBinding(BadHeadlessDeclaredView, { field: 'child' })
export const rootGood = Program.makeElement({ block: Good, container: document.body })
export const rootHeadless = Program.makeElement({ block: GoodHeadless, container: document.body })
export const rootForeign = Program.makeElement({ block: BadForeign, container: document.body })
