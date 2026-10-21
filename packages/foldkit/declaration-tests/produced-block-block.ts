import { Effect, Layer } from 'effect'

import {
  CounterMessage,
  HostDefinition,
  Model,
  SaveCount,
  ViewDefinition,
  ViewOutDefinition,
  ViewlessDefinition,
  ViewlessOutDefinition,
} from './produced-block-definition.js'

const ViewComposition = ViewDefinition.makeComposition()
const viewImplementation = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: ViewComposition.makeUpdate(model => ({ model })),
  view: ViewComposition.makeView((model, h) =>
    h.div([], [globalThis.String(model.count)]),
  ),
}
export const assembleViewBlock = () =>
  ViewComposition.assembleBlock(viewImplementation)
export const AssembledViewBlock = assembleViewBlock()
export const ViewBlock = ViewDefinition.produceBlock(assembleViewBlock)

const ViewlessComposition = ViewlessDefinition.makeComposition()
const viewlessImplementation = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: ViewlessComposition.makeUpdate(model => ({ model })),
}
export const assembleViewlessBlock = () =>
  ViewlessComposition.assembleBlock(viewlessImplementation)
export const AssembledViewlessBlock = assembleViewlessBlock()
export const ViewlessBlock = ViewlessDefinition.produceViewlessBlock(
  assembleViewlessBlock,
)

const ViewOutComposition = ViewOutDefinition.makeComposition()
const viewOutImplementation = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: ViewOutComposition.makeUpdate(model => ({ model })),
  view: ViewOutComposition.makeView((model, h) =>
    h.div([], [globalThis.String(model.count)]),
  ),
}
export const assembleViewOutBlock = () =>
  ViewOutComposition.assembleBlock(viewOutImplementation)
export const AssembledViewOutBlock = assembleViewOutBlock()
export const ViewOutBlock = ViewOutDefinition.produceBlock(assembleViewOutBlock)

const ViewlessOutComposition = ViewlessOutDefinition.makeComposition()
const viewlessOutImplementation = {
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: ViewlessOutComposition.makeUpdate(model => ({ model })),
}
export const assembleViewlessOutBlock = () =>
  ViewlessOutComposition.assembleBlock(viewlessOutImplementation)
export const AssembledViewlessOutBlock = assembleViewlessOutBlock()
export const ViewlessOutBlock = ViewlessOutDefinition.produceViewlessBlock(
  assembleViewlessOutBlock,
)

export const assembleReplacedBlock = () =>
  AssembledViewBlock.replaceEffectsLayer(Layer.empty)
export const AssembledReplacedBlock = assembleReplacedBlock()
export const ReplacedBlock = ViewDefinition.produceBlock(assembleReplacedBlock)

const HostComposition = HostDefinition.makeComposition()
const AssembledHostBlock = HostComposition.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: HostComposition.makeUpdate((model, message) =>
    CounterMessage.match(message, {
      ClickedIncrement: () => ({
        model,
        commands: [SaveCount({ count: model.count })],
      }),
      CompletedSaveCount: () => ({ model }),
    }),
  ),
  view: HostComposition.makeView((model, h) =>
    h.div([], [globalThis.String(model.count)]),
  ),
  EffectsLayer: Layer.empty,
  hostHandlers: [SaveCount],
})
export const assembleProvidedBlock = () =>
  AssembledHostBlock.provideHandlers(
    SaveCount.toLayer(
      Effect.succeed(() => Effect.succeed(CounterMessage.CompletedSaveCount())),
    ),
  )
export const AssembledProvidedBlock = assembleProvidedBlock()
export const ProvidedBlock = HostDefinition.produceBlock(assembleProvidedBlock)
