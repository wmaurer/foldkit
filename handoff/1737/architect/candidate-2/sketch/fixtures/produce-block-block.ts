import { Layer } from 'effect'
import {
  ForeignDefinition,
  HeadlessDefinition,
  HeadlessOutDefinition,
  Message,
  Model,
  OtherModel,
  OutTwinDefinition,
  SameIdDefinition,
  SameModelDefinition,
  TwinDefinition,
  ViewDefinition,
  ViewOutDefinition,
} from './produce-block-definition.js'

export const ViewComposition = ViewDefinition.makeComposition()
const viewImplementation = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: ViewComposition.makeUpdate((model, _message) => ({ model })),
  view: ViewComposition.makeView((model, h) =>
    h.div([], [globalThis.String(model.count)]),
  ),
}
export const ViewAssembled = ViewComposition.assembleBlock(viewImplementation)
export const assembleView = () =>
  ViewComposition.assembleBlock(viewImplementation)
export const ViewBlock = ViewDefinition.produceBlock(assembleView)
export const assembleReplacedView = () =>
  ViewBlock.replaceEffectsLayer(Layer.empty)
export const ReplacedViewBlock = ViewDefinition.produceBlock(
  assembleReplacedView,
)

export const ViewOutComposition = ViewOutDefinition.makeComposition()
const viewOutImplementation = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: ViewOutComposition.makeUpdate((model, _message) => ({ model })),
  view: ViewOutComposition.makeView((model, h) =>
    h.div([], [globalThis.String(model.count)]),
  ),
}
export const ViewOutAssembled =
  ViewOutComposition.assembleBlock(viewOutImplementation)
export const assembleViewOut = () =>
  ViewOutComposition.assembleBlock(viewOutImplementation)
export const ViewOutBlock = ViewOutDefinition.produceBlock(assembleViewOut)

export const HeadlessComposition = HeadlessDefinition.makeComposition()
const headlessImplementation = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: HeadlessComposition.makeUpdate((model, _message) => ({ model })),
}
export const HeadlessAssembled = HeadlessComposition.assembleBlock(
  headlessImplementation,
)
export const assembleHeadless = () =>
  HeadlessComposition.assembleBlock(headlessImplementation)
export const HeadlessBlock =
  HeadlessDefinition.produceHeadlessBlock(assembleHeadless)

export const HeadlessOutComposition = HeadlessOutDefinition.makeComposition()
const headlessOutImplementation = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: HeadlessOutComposition.makeUpdate((model, _message) => ({ model })),
}
export const HeadlessOutAssembled = HeadlessOutComposition.assembleBlock(
  headlessOutImplementation,
)
export const assembleHeadlessOut = () =>
  HeadlessOutComposition.assembleBlock(headlessOutImplementation)
export const HeadlessOutBlock =
  HeadlessOutDefinition.produceHeadlessBlock(assembleHeadlessOut)

const ViewDefinitionHeadlessComposition = ViewDefinition.makeComposition()
export const assembleHeadlessForViewDefinition = () =>
  ViewDefinitionHeadlessComposition.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: ViewDefinitionHeadlessComposition.makeUpdate((model, _message) => ({
      model,
    })),
  })
const HeadlessDefinitionViewComposition = HeadlessDefinition.makeComposition()
export const assembleViewForHeadlessDefinition = () =>
  HeadlessDefinitionViewComposition.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: HeadlessDefinitionViewComposition.makeUpdate((model, _message) => ({
      model,
    })),
    view: HeadlessDefinitionViewComposition.makeView((_model, h) => h.div([])),
  })

const ForeignComposition = ForeignDefinition.makeComposition()
export const assembleForeign = () =>
  ForeignComposition.assembleBlock({
    init: () => ({ model: OtherModel.make({ name: '' }) }),
    update: ForeignComposition.makeUpdate((model, _message) => ({ model })),
    view: ForeignComposition.makeView((_model, h) => h.div([])),
  })
const SameModelComposition = SameModelDefinition.makeComposition()
export const assembleSameModel = () =>
  SameModelComposition.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: SameModelComposition.makeUpdate((model, _message) => ({ model })),
    view: SameModelComposition.makeView((_model, h) => h.div([])),
  })
const SameIdComposition = SameIdDefinition.makeComposition()
export const assembleSameId = () =>
  SameIdComposition.assembleBlock({
    init: () => ({ model: OtherModel.make({ name: '' }) }),
    update: SameIdComposition.makeUpdate((model, _message) => ({ model })),
    view: SameIdComposition.makeView((_model, h) => h.div([])),
  })
const TwinComposition = TwinDefinition.makeComposition()
export const assembleTwin = () =>
  TwinComposition.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: TwinComposition.makeUpdate((model, _message) => ({ model })),
    view: TwinComposition.makeView((_model, h) => h.div([])),
  })
const OutTwinComposition = OutTwinDefinition.makeComposition()
export const assembleOutTwin = () =>
  OutTwinComposition.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: OutTwinComposition.makeUpdate((model, _message) => ({ model })),
    view: OutTwinComposition.makeView((_model, h) => h.div([])),
  })
