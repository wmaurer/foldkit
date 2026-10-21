import { Layer, Schema, Tuple } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'

import type { Assert, Equal, MembersEqual } from './harness.js'

const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
const ChildOut = Message.defineMessageUnion({ Done: {} })
const Def = Block.makeDefinition('Over', { Model, Message: ChildMessage, OutMessage: ChildOut })
const Comp = Def.makeComposition()
const init = () => ({ model: Model.make({ count: 0 }) })
const update = Comp.makeUpdate((model, _message) => ({ model }))
const view = Comp.makeView((model, h) => h.div([], [String(model.count)]))

const withOperations = () => Comp.assembleBlock({ init, update, view, operations: { ping: () => Tuple.make(ChildMessage.Clicked()) } })
const withLayer = () => Comp.assembleBlock({ init, update, view, EffectsLayer: Layer.empty })
const headlessLayer = () => Comp.assembleBlock({ init, update, EffectsLayer: Layer.empty })
const headlessOperations = () => Comp.assembleBlock({ init, update, operations: { ping: () => Tuple.make(ChildMessage.Clicked()) } })

const A = Def.produceBlock(withOperations)
const B = Def.produceBlock(withLayer)
const C = Def.produceHeadlessBlock(headlessLayer)
const D = Def.produceHeadlessBlock(headlessOperations)
export type O1 = Assert<MembersEqual<ReturnType<typeof withOperations>, typeof A>>
export type O2 = Assert<MembersEqual<ReturnType<typeof withLayer>, typeof B>>
export type O3 = Assert<MembersEqual<ReturnType<typeof headlessLayer>, typeof C>>
export type O4 = Assert<MembersEqual<ReturnType<typeof headlessOperations>, typeof D>>
export type K1 = Assert<Equal<keyof ReturnType<typeof withOperations>, keyof typeof A>>
export type K4 = Assert<Equal<keyof ReturnType<typeof headlessOperations>, keyof typeof D>>
