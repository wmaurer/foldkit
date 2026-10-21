import { Schema } from 'effect'
import { Block } from 'foldkit'
import * as Message from 'foldkit/message'

export const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
const ChildOut = Message.defineMessageUnion({ Done: {} })

export const ViewDef = Block.makeDefinition('EmitView', { Model, Message: ChildMessage })
const ViewComp = ViewDef.makeComposition()
const assembleView = () =>
  ViewComp.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: ViewComp.makeUpdate((model, _message) => ({ model })),
    view: ViewComp.makeView((model, h) => h.div([], [String(model.count)])),
  })
export const ViewBlock = ViewDef.produceBlock(assembleView)

export const ViewOutDef = Block.makeDefinition('EmitViewOut', { Model, Message: ChildMessage, OutMessage: ChildOut })
const ViewOutComp = ViewOutDef.makeComposition()
const assembleViewOut = () =>
  ViewOutComp.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: ViewOutComp.makeUpdate((model, _message) => ({ model })),
    view: ViewOutComp.makeView((model, h) => h.div([], [String(model.count)])),
  })
export const ViewOutBlock = ViewOutDef.produceBlock(assembleViewOut)

export const HeadlessDef = Block.makeDefinition('EmitHeadless', { Model, Message: ChildMessage })
const HeadlessComp = HeadlessDef.makeComposition()
const assembleHeadless = () =>
  HeadlessComp.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: HeadlessComp.makeUpdate((model, _message) => ({ model })),
  })
export const HeadlessBlock = HeadlessDef.produceHeadlessBlock(assembleHeadless)
const replaceLayer = () => HeadlessBlock.replaceEffectsLayer(HeadlessBlock.EffectsLayer)
export const ReplacedBlock = HeadlessDef.produceHeadlessBlock(replaceLayer)
