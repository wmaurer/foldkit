// Runtime facts the candidate's produceBlock check relies on, read from the prototype build.
import { Layer, Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import { defaultViewOf } from '../../../wt-base/packages/foldkit/dist/block/defaultView.js'

const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
const namespace = Block.makeNamespace('RuntimeShared')
const Static = namespace.makeDefinition({ Model, Message: ChildMessage })
const Refined = namespace.makeDefinition({ Model, Message: ChildMessage })
const StaticComposition = Static.makeComposition()
const RefinedComposition = Refined.makeComposition()
const implementation = composition => ({
  init: () => ({ model: { count: 0 } }),
  update: composition.makeUpdate(model => ({ model })),
})
const staticView = StaticComposition.makeView((_model, h) => h.div([]))
const StaticBlock = StaticComposition.assembleBlock({ ...implementation(StaticComposition), view: staticView, EffectsLayer: Layer.empty })
const RefinedBlock = RefinedComposition.assembleBlock(implementation(RefinedComposition))
const Replaced = StaticBlock.replaceEffectsLayer(Layer.empty)

console.log('shared-namespace owner equal:', StaticBlock.owner === RefinedBlock.owner)
console.log('shared-namespace Model equal:', StaticBlock.Model === RefinedBlock.Model)
console.log('view registered for view Block:', defaultViewOf(StaticBlock) !== undefined)
console.log('view registered for viewless Block:', defaultViewOf(RefinedBlock) !== undefined)
console.log('replaceEffectsLayer keeps view:', defaultViewOf(Replaced) !== undefined, 'keeps owner:', Replaced.owner === StaticBlock.owner, 'new object:', Replaced !== StaticBlock)
console.log('prototype produceBlock on Definition:', typeof Static.produceBlock, 'identity kept:', Static.produceBlock(() => StaticBlock) === StaticBlock)
console.log('prototype accepts shared-namespace sibling at runtime:', Static.produceBlock(() => RefinedBlock) === RefinedBlock)
