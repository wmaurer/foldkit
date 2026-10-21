import { Layer, Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'

const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
const ChildOut = Message.defineMessageUnion({ Done: {} })

const ADef = Block.makeDefinition('A3', { Model, Message: ChildMessage })
const AComp = ADef.makeComposition()
const AView = AComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: AComp.makeUpdate((model, _message) => ({ model })),
  view: AComp.makeView((model, h) => h.div([], [String(model.count)])),
})
const AViewLayer = AComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: AComp.makeUpdate((model, _message) => ({ model })),
  view: AComp.makeView((model, h) => h.div([], [String(model.count)])),
  EffectsLayer: Layer.empty,
})
const AHeadlessLayer = AComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: AComp.makeUpdate((model, _message) => ({ model })),
  EffectsLayer: Layer.empty,
})
const CDef = Block.makeDefinition('C3', { Model, Message: ChildMessage, OutMessage: ChildOut })
const CComp = CDef.makeComposition()
const CView = CComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: CComp.makeUpdate((model, _message) => ({ model })),
  view: CComp.makeView((model, h) => h.div([], [String(model.count)])),
})
const erased: Block.Implementation<typeof Model.Type, typeof ChildMessage.Type> = null!
const AErased = AComp.assembleBlock(erased)
const AErasedProduced = ADef.produceBlock(() => AComp.assembleBlock(erased))
const AProvided = ADef.produceBlock(() => AViewLayer.replaceEffectsLayer(Layer.empty))

export const n1: 'zzz' = AView
export const n2: 'zzz' = AViewLayer
export const n3: 'zzz' = AHeadlessLayer
export const n4: 'zzz' = CView
export const n5: 'zzz' = AErased
export const n6: 'zzz' = AErasedProduced.owner
export const n7: 'zzz' = AErasedProduced.Model
export const n8: 'zzz' = null! as typeof AProvided.owner
export const n9: 'zzz' = AView.provideHandlers
