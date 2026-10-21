import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Program from 'foldkit/program'

const Model = Schema.Struct({ count: Schema.Number })
const OtherModel = Schema.Struct({ name: Schema.String })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })

const OwnDefinition = Block.makeDefinition('Own', { Model, Message: ChildMessage })
const OwnComposition = OwnDefinition.makeComposition()
const ownImplementation = {
  init: OwnComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
  update: OwnComposition.makeUpdate((model, _message) => ({ model })),
  view: OwnComposition.makeView((model, h) => h.div([], [String(model.count)])),
}
const OwnAssembled = OwnComposition.assembleBlock(ownImplementation)

const SameModelDefinition = Block.makeDefinition('SameModel', { Model, Message: ChildMessage })
const SameModelComposition = SameModelDefinition.makeComposition()
const SameModelAssembled = SameModelComposition.assembleBlock({
  init: SameModelComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
  update: SameModelComposition.makeUpdate((model, _message) => ({ model })),
  view: SameModelComposition.makeView((model, h) => h.div([], [String(model.count)])),
})

const SameIdOtherModelDefinition = Block.makeDefinition('Own', { Model: OtherModel, Message: ChildMessage })

const SameIdSameModelDefinition = Block.makeDefinition('Own', { Model, Message: ChildMessage })

const OtherDefinition = Block.makeDefinition('Other', { Model: OtherModel, Message: ChildMessage })
const OtherComposition = OtherDefinition.makeComposition()
const OtherAssembled = OtherComposition.assembleBlock({
  init: OtherComposition.makeInit(() => ({ model: OtherModel.make({ name: '' }) })),
  update: OtherComposition.makeUpdate((model, _message) => ({ model })),
  view: OtherComposition.makeView((model, h) => h.div([], [model.name])),
})

const erased: Block.Implementation<typeof Model.Type, typeof ChildMessage.Type> = null!
declare const anyValue: any
declare const neverProducer: never

export const ForeignOtherId = OwnDefinition.produceBlock(() => OtherAssembled)
export const ForeignSameModel = OwnDefinition.produceBlock(() => SameModelAssembled)
export const SameIdOtherModel = SameIdOtherModelDefinition.produceBlock(() => OwnAssembled)
export const SameIdSameModel = SameIdSameModelDefinition.produceBlock(() => OwnAssembled)
export const NeverProducer = OwnDefinition.produceBlock(neverProducer)
export const Erased = OwnDefinition.produceBlock(() => OwnComposition.assembleBlock(erased))
export const NotAFunction = OwnDefinition.produceBlock(OwnAssembled)
export const WithParameters = OwnDefinition.produceBlock((count: number) => (count > 0 ? OwnAssembled : OwnAssembled))
export const AnyReturn = OwnDefinition.produceBlock(() => anyValue)
export const Enriched = OwnDefinition.produceBlock(() => Object.assign(OwnAssembled, { extra: 1 }))

const ViewlessDefinition = Block.makeDefinition('Viewless', { Model, Message: ChildMessage })
const ViewlessComposition = ViewlessDefinition.makeComposition()
export const ViewlessBlock = ViewlessDefinition.produceBlock(() =>
  ViewlessComposition.assembleBlock({
    init: ViewlessComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
    update: ViewlessComposition.makeUpdate((model, _message) => ({ model })),
  }),
)

const ParentModel = Schema.Struct({ own: Model, other: OtherModel })
const ParentMessage = Message.defineMessageUnion({ Noted: {} })
const ParentDefinition = Block.makeDefinition('Parent', { Model: ParentModel, Message: ParentMessage })

// Accepted at the type level: identical owner and Model types. The runtime check rejects it.
export const sameIdSameModelBinding = ParentDefinition.makeBinding(SameIdSameModel, { field: 'own', placement: 'SameIdSameModel' })

// (directive removed)
export const foreignOtherIdBinding = ParentDefinition.makeBinding(ForeignOtherId, { field: 'own', placement: 'ForeignOtherId' })
// (directive removed)
export const foreignSameModelBinding = ParentDefinition.makeBinding(ForeignSameModel, { field: 'own', placement: 'ForeignSameModel' })
// (directive removed)
export const sameIdOtherModelBinding = ParentDefinition.makeBinding(SameIdOtherModel, { field: 'other', placement: 'SameIdOtherModel' })
// (directive removed)
export const neverBinding = ParentDefinition.makeBinding(NeverProducer, { field: 'own', placement: 'Never' })
// (directive removed)
export const erasedBinding = ParentDefinition.makeBinding(Erased, { field: 'own', placement: 'Erased' })
// (directive removed)
export const notAFunctionBinding = ParentDefinition.makeBinding(NotAFunction, { field: 'own', placement: 'NotAFunction' })
// (directive removed)
export const withParametersBinding = ParentDefinition.makeBinding(WithParameters, { field: 'own', placement: 'WithParameters' })
// (directive removed)
export const anyReturnBinding = ParentDefinition.makeBinding(AnyReturn, { field: 'own', placement: 'AnyReturn' })
// (directive removed)
export const enrichedBinding = ParentDefinition.makeBinding(Enriched, { field: 'own', placement: 'Enriched' })

// (directive removed)
export const foreignAnyBlock: Block.AnyBlock = ForeignOtherId
// (directive removed)
export const erasedAnyBlock: Block.AnyBlock = Erased

// (directive removed)
Program.makeElement({
  block: ForeignOtherId,
  container: null,
})
// (directive removed)
Program.makeElement({ block: ViewlessBlock, container: null })

const ViewlessBinding = ParentDefinition.makeBinding(ViewlessBlock, { field: 'own', placement: 'ViewlessChild' })
// (directive removed)
ViewlessBinding.embedView({ slotId: 'viewless', model: Model.make({ count: 0 }) })

// (directive removed)
Program.makeElement({ block: Erased, container: null })
// (directive removed)
Program.makeElement({ block: NotAFunction, container: null })
