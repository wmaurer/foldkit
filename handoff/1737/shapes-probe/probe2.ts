import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Program from 'foldkit/program'

type Equal<Left, Right> =
  (<V>() => V extends Left ? 1 : 2) extends <V>() => V extends Right ? 1 : 2 ? true : false

const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })

const BDef = Block.makeDefinition('B2', { Model, Message: ChildMessage })
const BComp = BDef.makeComposition()
const BAssembled = BComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: BComp.makeUpdate((model, _message) => ({ model })),
})
const BBlock = BDef.produceBlock(() => BAssembled)

const ADef = Block.makeDefinition('A2', { Model, Message: ChildMessage })
const AComp = ADef.makeComposition()
const AAssembled = AComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: AComp.makeUpdate((model, _message) => ({ model })),
  view: AComp.makeView((model, h) => h.div([], [String(model.count)])),
})
const ABlock = ADef.produceBlock(() => AAssembled)

export const keysEqualB: Equal<keyof typeof BBlock, keyof typeof BAssembled> = null!
export const keysEqualA: Equal<keyof typeof ABlock, keyof typeof AAssembled> = null!
export const k1: 'zzz' = keysEqualB
export const k2: 'zzz' = keysEqualA

const ParentModel = Schema.Struct({ a: Model, b: Model })
const ParentMessage = Message.defineMessageUnion({ Noted: {} })
const ParentDef = Block.makeDefinition('P2', { Model: ParentModel, Message: ParentMessage })
const ABinding = ParentDef.makeBinding(ABlock, { field: 'a' })
const BBinding = ParentDef.makeBinding(BBlock, { field: 'b' })
const BAssembledBinding = ParentDef.makeBinding(BAssembled, { field: 'b', placement: 'B2x' })
export const embedA: 'zzz' = null! as Parameters<typeof ABinding.embedView>
export const embedB: 'zzz' = null! as typeof BBinding.embedView
export const embedBAssembled: 'zzz' = null! as typeof BAssembledBinding.embedView

export const programB = Program.makeElement({ block: BBlock, container: document.body })
export const programBAssembled = Program.makeElement({ block: BAssembled, container: document.body })
