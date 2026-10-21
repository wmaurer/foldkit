import { Schema } from 'effect'
import { Block } from 'foldkit'
import * as Message from 'foldkit/message'

import { ChildBlock } from './childblock.js'

const ParentModel = Schema.Struct({ child: ChildBlock.Model })
export const ParentDefinition = Block.makeDefinition('XParent', {
  Model: ParentModel,
  Message: Message.defineMessageUnion({ Noted: {} }),
})
export const ChildBinding = ParentDefinition.makeBinding(ChildBlock, { field: 'child' })
const ParentComposition = ParentDefinition.makeComposition({ bindings: [ChildBinding] })
const assembleParent = () =>
  ParentComposition.assembleBlock({
    init: () => ({ model: ParentModel.make({ child: { count: 0 } }) }),
    update: ParentComposition.makeUpdate((model, _message) => ({ model })),
    view: ParentComposition.makeView((_model, h) => h.div([])),
  })
export const ParentBlock = ParentDefinition.produceBlock(assembleParent)
