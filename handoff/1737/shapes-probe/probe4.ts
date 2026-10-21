import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import * as Program from 'foldkit/program'
import type { DefaultViewTypeId, DefaultViewOf } from '../wt-base/packages/foldkit/dist/block/defaultView.js'

const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
const BDef = Block.makeDefinition('B4', { Model, Message: ChildMessage })
const BComp = BDef.makeComposition()
const BAssembled = BComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: BComp.makeUpdate((model, _message) => ({ model })),
})
const ADef = Block.makeDefinition('A4', { Model, Message: ChildMessage })
const AComp = ADef.makeComposition()
const AAssembled = AComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: AComp.makeUpdate((model, _message) => ({ model })),
  view: AComp.makeView((model, h) => h.div([], [String(model.count)])),
})
interface HeadlessNever extends Omit<typeof BAssembled, typeof DefaultViewTypeId> { readonly [DefaultViewTypeId]: never }
interface ViewOptional extends Omit<typeof AAssembled, typeof DefaultViewTypeId> { readonly [DefaultViewTypeId]?: DefaultViewOf<typeof AAssembled> }
declare const headlessNever: HeadlessNever
declare const viewOptional: ViewOptional

const ParentModel = Schema.Struct({ a: Model, b: Model })
const ParentMessage = Message.defineMessageUnion({ Noted: {} })
const ParentDef = Block.makeDefinition('P4', { Model: ParentModel, Message: ParentMessage })
const NeverBinding = ParentDef.makeBinding(headlessNever, { field: 'b' })
const OptionalBinding = ParentDef.makeBinding(viewOptional, { field: 'a' })
export const e1: 'zzz' = null! as typeof NeverBinding.embedView
export const e2: 'zzz' = null! as typeof OptionalBinding.embedView
export const any1: typeof headlessNever extends Block.AnyBlock ? 'never-shape ok' : 'never-shape fails' = null!
export const p1 = Program.makeElement({ block: viewOptional, container: document.body })
export const p2 = Program.makeElement({ block: headlessNever, container: document.body })
export const r1: 'zzz' = any1
export const dv: 'zzz' = null! as DefaultViewOf<typeof AAssembled>
type IsAny<T> = 0 extends 1 & T ? 'any' : [T] extends [never] ? 'never' : 'concrete'
export const dvKind: 'zzz' = null! as unknown as IsAny<DefaultViewOf<typeof AAssembled>>
export const optKind: 'zzz' = null! as unknown as IsAny<DefaultViewOf<ViewOptional>>
export const keysA: 'zzz' = null! as unknown as Exclude<keyof typeof AAssembled, string>
