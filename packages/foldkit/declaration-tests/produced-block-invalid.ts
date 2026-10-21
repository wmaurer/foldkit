import type { Block } from 'foldkit'

import {
  assembleViewBlock,
  assembleViewlessBlock,
} from './produced-block-block.js'
import {
  CounterMessage,
  ForeignDefinition,
  Model,
  OtherModel,
  SameIdDefinition,
  ViewDefinition,
  ViewlessDefinition,
} from './produced-block-definition.js'

const ForeignComposition = ForeignDefinition.makeComposition()
const assembleForeignBlock = () =>
  ForeignComposition.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: ForeignComposition.makeUpdate(model => ({ model })),
    view: ForeignComposition.makeView((_model, h) => h.div([])),
  })

const SameIdComposition = SameIdDefinition.makeComposition()
const assembleSameIdBlock = () =>
  SameIdComposition.assembleBlock({
    init: () => ({ model: OtherModel.make({ name: '' }) }),
    update: SameIdComposition.makeUpdate(model => ({ model })),
    view: SameIdComposition.makeView((_model, h) => h.div([])),
  })

const ViewComposition = ViewDefinition.makeComposition()
declare const erasedImplementation: Block.Implementation<
  typeof Model.Type,
  typeof CounterMessage.Type
>
const assembleErasedBlock = () =>
  ViewComposition.assembleBlock(erasedImplementation)

declare const neverProducer: never
// oxlint-disable-next-line typescript/no-explicit-any -- This fixture verifies that an erased producer cannot type a produced Block.
declare const anyProducer: any
// oxlint-disable-next-line typescript/no-explicit-any -- This fixture verifies that an erased producer result cannot type a produced Block.
const assembleAnyBlock = (): any => assembleViewBlock()
const assembleEnrichedBlock = () =>
  Object.assign(assembleViewBlock(), { extra: 1 })

export const ForeignBlock = ViewDefinition.produceBlock(assembleForeignBlock)
export const SameIdBlock = ViewDefinition.produceBlock(assembleSameIdBlock)
export const NeverBlock = ViewDefinition.produceBlock(neverProducer)
export const ErasedBlock = ViewDefinition.produceBlock(assembleErasedBlock)
export const NotFunctionBlock = ViewDefinition.produceBlock(assembleViewBlock())
export const ParameterBlock = ViewDefinition.produceBlock((_count: number) =>
  assembleViewBlock(),
)
export const AnyProducerBlock = ViewDefinition.produceBlock(anyProducer)
export const AnyResultBlock = ViewDefinition.produceBlock(assembleAnyBlock)
export const EnrichedBlock = ViewDefinition.produceBlock(assembleEnrichedBlock)
export const MissingViewBlock = ViewlessDefinition.produceBlock(
  assembleViewlessBlock,
)
export const UnexpectedViewBlock =
  ViewDefinition.produceViewlessBlock(assembleViewBlock)
