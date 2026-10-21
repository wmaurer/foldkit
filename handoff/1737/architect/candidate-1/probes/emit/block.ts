import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'

import { producerOf } from './produced.js'

export const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
const EmitDefinition = Block.makeDefinition('Emit', { Model, Message: ChildMessage })
const EmitComposition = EmitDefinition.makeComposition()
const assembleEmitBlock = () =>
  EmitComposition.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: EmitComposition.makeUpdate((model, _message) => ({ model })),
    view: EmitComposition.makeView((model, h) => h.div([], [String(model.count)])),
  })
export const EmitBlock = producerOf(EmitDefinition).produceBlock(assembleEmitBlock)
