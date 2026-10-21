import { Schema } from 'effect'
import type { Block } from 'foldkit'
import * as BlockModule from 'foldkit/block'
import * as Message from 'foldkit/message'

const Model = Schema.Struct({ count: Schema.Number })
const OtherModel = Schema.Struct({ name: Schema.String })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })

const OwnDef = BlockModule.makeDefinition('Own', { Model, Message: ChildMessage })
const OwnComp = OwnDef.makeComposition()
const assembleOwn = () =>
  OwnComp.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: OwnComp.makeUpdate((model, _message) => ({ model })),
    view: OwnComp.makeView((model, h) => h.div([], [String(model.count)])),
  })
const ForeignDef = BlockModule.makeDefinition('Foreign', { Model: OtherModel, Message: ChildMessage })
const ForeignComp = ForeignDef.makeComposition()
const assembleForeign = () =>
  ForeignComp.assembleBlock({
    init: () => ({ model: OtherModel.make({ name: '' }) }),
    update: ForeignComp.makeUpdate((model, _message) => ({ model })),
    view: ForeignComp.makeView((_model, h) => h.div([])),
  })

type Produced<Producer> = Block.ProducedBlockWithView<(typeof OwnDef)['owner'], (typeof OwnDef)['Model'], Producer>
export const Good: Produced<typeof assembleOwn> = assembleOwn()
export const Bad: Produced<typeof assembleForeign> = assembleForeign()
export const AlsoBad: Produced<typeof assembleOwn> = assembleForeign()
