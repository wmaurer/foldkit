import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Program from 'foldkit/program'

import type { Assert, Equal, MembersEqual } from './harness.js'

const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
const ChildOut = Message.defineMessageUnion({ Done: {} })

const ViewDef = Block.makeDefinition('V', { Model, Message: ChildMessage })
const ViewComp = ViewDef.makeComposition()
const viewImpl = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: ViewComp.makeUpdate((model, _message) => ({ model })),
  view: ViewComp.makeView((model, h) => h.div([], [String(model.count)])),
}
const ViewAssembled = ViewComp.assembleBlock(viewImpl)
const ViewProduced = ViewDef.produceBlock(() => ViewComp.assembleBlock(viewImpl))

const ViewOutDef = Block.makeDefinition('VO', { Model, Message: ChildMessage, OutMessage: ChildOut })
const ViewOutComp = ViewOutDef.makeComposition()
const viewOutImpl = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: ViewOutComp.makeUpdate((model, _message) => ({ model })),
  view: ViewOutComp.makeView((model, h) => h.div([], [String(model.count)])),
}
const ViewOutAssembled = ViewOutComp.assembleBlock(viewOutImpl)
const ViewOutProduced = ViewOutDef.produceBlock(() => ViewOutComp.assembleBlock(viewOutImpl))

const HeadlessDef = Block.makeDefinition('H', { Model, Message: ChildMessage })
const HeadlessComp = HeadlessDef.makeComposition()
const headlessImpl = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: HeadlessComp.makeUpdate((model, _message) => ({ model })),
}
const HeadlessAssembled = HeadlessComp.assembleBlock(headlessImpl)
const HeadlessProduced = HeadlessDef.produceHeadlessBlock(() => HeadlessComp.assembleBlock(headlessImpl))

const HeadlessOutDef = Block.makeDefinition('HO', { Model, Message: ChildMessage, OutMessage: ChildOut })
const HeadlessOutComp = HeadlessOutDef.makeComposition()
const headlessOutImpl = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: HeadlessOutComp.makeUpdate((model, _message) => ({ model })),
}
const HeadlessOutAssembled = HeadlessOutComp.assembleBlock(headlessOutImpl)
const HeadlessOutProduced = HeadlessOutDef.produceHeadlessBlock(() => HeadlessOutComp.assembleBlock(headlessOutImpl))

export type K1 = Assert<Equal<keyof typeof ViewProduced, keyof typeof ViewAssembled>>
export type K2 = Assert<Equal<keyof typeof ViewOutProduced, keyof typeof ViewOutAssembled>>
export type K3 = Assert<Equal<keyof typeof HeadlessProduced, keyof typeof HeadlessAssembled>>
export type K4 = Assert<Equal<keyof typeof HeadlessOutProduced, keyof typeof HeadlessOutAssembled>>
export type M1 = Assert<MembersEqual<typeof ViewAssembled, typeof ViewProduced>>
export type M2 = Assert<MembersEqual<typeof ViewOutAssembled, typeof ViewOutProduced>>
export type M3 = Assert<MembersEqual<typeof HeadlessAssembled, typeof HeadlessProduced>>
export type M4 = Assert<MembersEqual<typeof HeadlessOutAssembled, typeof HeadlessOutProduced>>
export type R1 = Assert<MembersEqual<typeof ViewProduced, typeof ViewAssembled>>

export const anyBlocks: ReadonlyArray<Block.AnyBlock> = [ViewProduced, ViewOutProduced, HeadlessProduced, HeadlessOutProduced]

const ParentModel = Schema.Struct({ a: Model, b: Model, c: Model, d: Model })
const ParentDef = Block.makeDefinition('P', { Model: ParentModel, Message: Message.defineMessageUnion({ Noted: {} }) })
export const bA = ParentDef.makeBinding(ViewProduced, { field: 'a' })
export const bB = ParentDef.makeBinding(ViewOutProduced, { field: 'b' }).withOutMessagePolicy({ fold: () => ({ model: null! }) as never })
export const bC = ParentDef.makeBinding(HeadlessProduced, { field: 'c' })
const refA = ParentDef.makeBinding(ViewAssembled, { field: 'a' })
const refC = ParentDef.makeBinding(HeadlessAssembled, { field: 'c' })
export type E1 = Assert<Equal<typeof bA.embedView, typeof refA.embedView>>
export type E2 = Assert<Equal<typeof bC.embedView, typeof refC.embedView>>
export const programView = Program.makeElement({ block: ViewProduced, container: document.body })
export const programViewRef = Program.makeElement({ block: ViewAssembled, container: document.body })
export type P1 = Assert<Equal<typeof programView, typeof programViewRef>>
