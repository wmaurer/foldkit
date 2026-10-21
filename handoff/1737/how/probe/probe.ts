import { Layer, Schema } from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/node_modules/effect/dist/index.js'
import * as Block from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/src/block/public.ts'
import type { DefaultViewTypeId } from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/src/block/defaultView.ts'
import * as Message from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/src/message/public.ts'

const ModelA = Schema.Struct({ a: Schema.String })
const ModelB = Schema.Struct({ b: Schema.Number })
const Msg = Message.defineMessageUnion({ Clicked: {} })
const Out = Message.defineMessageUnion({ Done: {} })

const DefA = Block.makeDefinition('Same', { Model: ModelA, Message: Msg })
const DefA2 = Block.makeDefinition('Same', { Model: ModelA, Message: Msg })
const DefB = Block.makeDefinition('Other', { Model: ModelB, Message: Msg })
const DefOut = Block.makeDefinition('WithOut', { Model: ModelA, Message: Msg, OutMessage: Out })

type Eq<L, R> = [L, R] extends [R, L] ? true : false
export const sameOwnerType: Eq<typeof DefA.owner, typeof DefA2.owner> = true
export const diffOwnerType: Eq<typeof DefA.owner, typeof DefB.owner> = false

const dyn: string = 'x' + Math.random()
const DynDef1 = Block.makeDefinition(dyn, { Model: ModelA, Message: Msg })
const DynDef2 = Block.makeDefinition(dyn, { Model: ModelB, Message: Msg })
export const dynOwnerEq: Eq<typeof DynDef1.owner, typeof DynDef2.owner> = true

const CompA = DefA.makeComposition()
const CompB = DefB.makeComposition()
const CompOut = DefOut.makeComposition()

// viewless producer
export const Viewless = DefA.produceBlock(() => CompA.assembleBlock({ init: CompA.makeInit(() => ({ model: ModelA.make({ a: '' }) })), update: (model: typeof ModelA.Type) => ({ model }) }))
export type ViewlessKeys = keyof typeof Viewless

// foreign producer: DefA.produceBlock returns DefB's block
export const Foreign = DefA.produceBlock(() => CompB.assembleBlock({ init: CompB.makeInit(() => ({ model: ModelB.make({ b: 1 }) })), update: (model: typeof ModelB.Type) => ({ model }) }))
export const foreignModelIsA: Eq<typeof Foreign.Model, typeof ModelA> = true
export const foreignOwnerIsB: Eq<typeof Foreign.owner, typeof DefB.owner> = true

// OutMessage definition with viewless producer
export const OutViewless = DefOut.produceBlock(() => CompOut.assembleBlock({ init: CompOut.makeInit(() => ({ model: ModelA.make({ a: '' }) })), update: (model: typeof ModelA.Type) => ({ model }) }))

// replaceEffectsLayer producer
export const Replaced = DefA.produceBlock(() => CompA.assembleBlock({ init: CompA.makeInit(() => ({ model: ModelA.make({ a: '' }) })), update: (model: typeof ModelA.Type) => ({ model }) }).replaceEffectsLayer(Layer.empty))

// Bind the produced Blocks into a parent
const ParentModel = Schema.Struct({ viewless: ModelA, foreign: ModelA })
const ParentDef = Block.makeDefinition('Parent', { Model: ParentModel, Message: Msg })
export const bindViewless = ParentDef.makeBinding(Viewless, { field: 'viewless' })
export const bindForeign = ParentDef.makeBinding(Foreign, { field: 'foreign' })

export type DV = (typeof Viewless)[typeof DefaultViewTypeId]
export const dvIsUndefined: Eq<DV, undefined> = true
export type OutViewlessDV = (typeof OutViewless)[typeof DefaultViewTypeId]
export const outDvIsUndefined: Eq<OutViewlessDV, undefined> = true
export type ReplacedOwner = (typeof Replaced)['owner']
export const replacedOwnerOk: Eq<ReplacedOwner, typeof DefA.owner> = true
export const foreignInitModel: Eq<ReturnType<(typeof Foreign)['init']>['model'], typeof ModelB.Type> = true
type IsAny<T> = 0 extends 1 & T ? true : false
export const dvNotAny: IsAny<DV> = false
export const initNotAny: IsAny<(typeof Foreign)['init']> = false
export const ownerNotAny: IsAny<(typeof Foreign)['owner']> = false
const WrongParent = Block.makeDefinition('WrongParent', { Model: Schema.Struct({ x: ModelB }), Message: Msg })
// control: binding a ModelA Block into a ModelB field should error
export const bindWrong = WrongParent.makeBinding(Viewless, { field: 'x' })
