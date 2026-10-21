import { Block } from 'foldkit'

import {
  assembleForeign,
  assembleHeadlessForViewDefinition,
  assembleOutTwin,
  assembleSameId,
  assembleSameModel,
  assembleView,
  assembleViewForHeadlessDefinition,
  ViewComposition,
} from './produce-block-block.js'
import {
  HeadlessDefinition,
  Message,
  Model,
  ViewDefinition,
} from './produce-block-definition.js'

declare const neverProducer: never
declare const erasedImplementation: Block.Implementation<
  typeof Model.Type,
  typeof Message.Type
>
const assembleErased = () => ViewComposition.assembleBlock(erasedImplementation)
const assembleAny = (): any => assembleView()

export const Foreign = ViewDefinition.produceBlock(assembleForeign)
export const SameId = ViewDefinition.produceBlock(assembleSameId)
export const SameModel = ViewDefinition.produceBlock(assembleSameModel)
export const OutTwin = ViewDefinition.produceBlock(assembleOutTwin)
export const Never = ViewDefinition.produceBlock(neverProducer)
export const NotFunction = ViewDefinition.produceBlock(assembleView())
export const WithParameter = ViewDefinition.produceBlock(
  (_value: number) => assembleView(),
)
export const Any = ViewDefinition.produceBlock(assembleAny)
export const Erased = ViewDefinition.produceBlock(assembleErased)
export const ViewButHeadless = ViewDefinition.produceBlock(
  assembleHeadlessForViewDefinition,
)
export const HeadlessButView = HeadlessDefinition.produceHeadlessBlock(
  assembleViewForHeadlessDefinition,
)
