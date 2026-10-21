import { Effect, Layer, Schema } from 'effect'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import { defineMessageUnion } from '../message/index.js'
import { defaultViewOf } from './defaultView.js'
import { makeDefinition, makeNamespace } from './define.js'

const CounterModel = Schema.Struct({ count: Schema.Number })
const LabelModel = Schema.Struct({ label: Schema.String })
const CounterMessage = defineMessageUnion({
  ClickedIncrement: {},
  CompletedSaveCount: {},
})
const CounterOutMessage = defineMessageUnion({ ReachedLimit: {} })

const CounterNamespace = makeNamespace('ProduceCounter')
const SaveCount = CounterNamespace.makeCommand('SaveCount', {
  args: { count: Schema.Number },
  messages: [CounterMessage.CompletedSaveCount],
})
const CounterDefinition = CounterNamespace.makeDefinition({
  Model: CounterModel,
  Message: CounterMessage,
})
const CounterComposition = CounterDefinition.makeComposition()
const counterView = CounterComposition.makeView((model, h) =>
  h.div([], [globalThis.String(model.count)]),
)
const counterImplementation = {
  init: () => ({ model: CounterModel.make({ count: 0 }) }),
  update: CounterComposition.makeUpdate(model => ({ model })),
  view: counterView,
}
const assembleCounterBlock = () =>
  CounterComposition.assembleBlock(counterImplementation)
const AssembledCounterBlock = assembleCounterBlock()
const CounterBlock = CounterDefinition.produceBlock(assembleCounterBlock)

const assembleCounterWithHostBlock = () =>
  CounterComposition.assembleBlock({
    init: counterImplementation.init,
    update: CounterComposition.makeUpdate((model, message) =>
      CounterMessage.match(message, {
        ClickedIncrement: () => ({
          model,
          commands: [SaveCount({ count: model.count })],
        }),
        CompletedSaveCount: () => ({ model }),
      }),
    ),
    view: counterView,
    EffectsLayer: Layer.empty,
    hostHandlers: [SaveCount],
  })

const ReportingDefinition = makeDefinition('ProduceReporting', {
  Model: CounterModel,
  Message: CounterMessage,
  OutMessage: CounterOutMessage,
})
const ReportingComposition = ReportingDefinition.makeComposition()
const assembleReportingBlock = () =>
  ReportingComposition.assembleBlock({
    init: () => ({ model: CounterModel.make({ count: 0 }) }),
    update: ReportingComposition.makeUpdate(model => ({ model })),
  })
const AssembledReportingBlock = assembleReportingBlock()
const ReportingBlock = ReportingDefinition.produceViewlessBlock(
  assembleReportingBlock,
)

const SameIdDefinition = makeDefinition('ProduceReporting', {
  Model: CounterModel,
  Message: CounterMessage,
  OutMessage: CounterOutMessage,
})
const SiblingDefinition = CounterNamespace.makeDefinition({
  Model: CounterModel,
  Message: CounterMessage,
})
const SiblingComposition = SiblingDefinition.makeComposition()
const assembleSiblingBlock = () =>
  SiblingComposition.assembleBlock({
    init: () => ({ model: CounterModel.make({ count: 0 }) }),
    update: SiblingComposition.makeUpdate(model => ({ model })),
    view: SiblingComposition.makeView((_model, h) => h.div([])),
  })

const ForeignDefinition = makeDefinition('ProduceForeign', {
  Model: LabelModel,
  Message: CounterMessage,
})
const ForeignComposition = ForeignDefinition.makeComposition()
const assembleForeignBlock = () =>
  ForeignComposition.assembleBlock({
    init: () => ({ model: LabelModel.make({ label: '' }) }),
    update: ForeignComposition.makeUpdate(model => ({ model })),
    view: ForeignComposition.makeView((_model, h) => h.div([])),
  })

const ParentModel = Schema.Struct({ child: CounterModel })
const ParentDefinition = makeDefinition('ProduceParent', {
  Model: ParentModel,
  Message: defineMessageUnion({ ClickedParent: {} }),
})

expectTypeOf(CounterBlock.Model).toEqualTypeOf(CounterModel)
expectTypeOf(CounterBlock.init).toEqualTypeOf(AssembledCounterBlock.init)
expectTypeOf(CounterBlock.update).toEqualTypeOf(AssembledCounterBlock.update)
expectTypeOf(ReportingBlock.OutMessage).toEqualTypeOf(CounterOutMessage)
expectTypeOf(ReportingBlock.operations).toEqualTypeOf(
  AssembledReportingBlock.operations,
)

ParentDefinition.makeBinding(CounterBlock, { field: 'child' })
ParentDefinition.makeBinding(ReportingBlock, { field: 'child' })

if (false) {
  const ForeignProducedBlock =
    CounterDefinition.produceBlock(assembleForeignBlock)
  // @ts-expect-error A Block assembled from another Definition does not bind.
  ParentDefinition.makeBinding(ForeignProducedBlock, { field: 'child' })

  const ViewlessProducedBlock =
    CounterDefinition.produceViewlessBlock(assembleCounterBlock)
  // @ts-expect-error produceViewlessBlock rejects a Block with a default view.
  ParentDefinition.makeBinding(ViewlessProducedBlock, { field: 'child' })

  const MissingViewBlock = ReportingDefinition.produceBlock(
    assembleReportingBlock,
  )
  // @ts-expect-error produceBlock rejects a Block without a default view.
  ParentDefinition.makeBinding(MissingViewBlock, { field: 'child' })
}

describe('Definition.produceBlock', () => {
  it('calls the producer once with no arguments and returns its Block', () => {
    const block = assembleCounterBlock()
    const produce = vi.fn(() => block)

    const produced = Reflect.apply(CounterDefinition.produceBlock, undefined, [
      produce,
    ])

    expect(produced).toBe(block)
    expect(produce.mock.calls).toEqual([[]])
    expect(defaultViewOf(produced)).toBe(counterView)
  })

  it('accepts a Block from another Composition of the same Definition', () => {
    const composition = CounterDefinition.makeComposition()
    const block = composition.assembleBlock({
      init: () => ({ model: CounterModel.make({ count: 0 }) }),
      update: composition.makeUpdate(model => ({ model })),
    })

    expect(
      Reflect.apply(CounterDefinition.produceViewlessBlock, undefined, [
        () => block,
      ]),
    ).toBe(block)
  })

  it('accepts replaceEffectsLayer and provideHandlers results', () => {
    const replaced = AssembledCounterBlock.replaceEffectsLayer(Layer.empty)
    const provided = assembleCounterWithHostBlock().provideHandlers(
      SaveCount.toLayer(
        Effect.succeed(() =>
          Effect.succeed(CounterMessage.CompletedSaveCount()),
        ),
      ),
    )

    expect(
      Reflect.apply(CounterDefinition.produceBlock, undefined, [
        () => replaced,
      ]),
    ).toBe(replaced)
    expect(
      Reflect.apply(CounterDefinition.produceBlock, undefined, [
        () => provided,
      ]),
    ).toBe(provided)
  })

  it('rejects a Block assembled from a Definition with another id', () => {
    expect(() =>
      Reflect.apply(CounterDefinition.produceBlock, undefined, [
        assembleForeignBlock,
      ]),
    ).toThrow(
      '[foldkit] Block "ProduceCounter" produceBlock received a Block assembled from a different Definition. Return the Block assembled from this Definition\'s Composition.',
    )
  })

  it('rejects a Block from a separate Definition with the same id and Schemas', () => {
    expect(() =>
      Reflect.apply(SameIdDefinition.produceViewlessBlock, undefined, [
        assembleReportingBlock,
      ]),
    ).toThrow(
      'Block "ProduceReporting" produceViewlessBlock received a Block assembled from a different Definition.',
    )
  })

  it('rejects a Block from a sibling Definition of the same namespace', () => {
    expect(() =>
      Reflect.apply(CounterDefinition.produceBlock, undefined, [
        assembleSiblingBlock,
      ]),
    ).toThrow(
      'Block "ProduceCounter" produceBlock received a Block assembled from a different Definition.',
    )
  })

  it('rejects a producer that is not a function', () => {
    expect(() =>
      Reflect.apply(CounterDefinition.produceBlock, undefined, [
        AssembledCounterBlock,
      ]),
    ).toThrow(
      '[foldkit] Block "ProduceCounter" produceBlock requires a function that returns the Block assembled from this Definition\'s Composition.',
    )
  })

  it('rejects a producer that returns a value other than a completed Block', () => {
    expect(() =>
      Reflect.apply(CounterDefinition.produceBlock, undefined, [
        () => ({
          owner: AssembledCounterBlock.owner,
          Model: AssembledCounterBlock.Model,
        }),
      ]),
    ).toThrow(
      '[foldkit] Block "ProduceCounter" produceBlock received a value that is not a completed Block. Return the Block assembled from this Definition\'s Composition.',
    )
  })

  it('rejects a Block without a default view', () => {
    expect(() =>
      Reflect.apply(ReportingDefinition.produceBlock, undefined, [
        assembleReportingBlock,
      ]),
    ).toThrow(
      '[foldkit] Block "ProduceReporting" produceBlock received a Block without a default view. Use produceViewlessBlock.',
    )
  })

  it('rejects a Block with a default view in produceViewlessBlock', () => {
    expect(() =>
      Reflect.apply(CounterDefinition.produceViewlessBlock, undefined, [
        assembleCounterBlock,
      ]),
    ).toThrow(
      '[foldkit] Block "ProduceCounter" produceViewlessBlock received a Block with a default view. Use produceBlock.',
    )
  })

  it('is a Definition method, not a Composition method', () => {
    expect(Reflect.has(CounterComposition, 'produceBlock')).toBe(false)
    expect(Reflect.has(CounterComposition, 'produceViewlessBlock')).toBe(false)
  })
})
