import { Effect, Layer, Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Command from 'foldkit/command'
import * as Message from 'foldkit/message'
import * as Program from 'foldkit/program'

type Equal<Left, Right> =
  (<V>() => V extends Left ? 1 : 2) extends <V>() => V extends Right ? 1 : 2
    ? true
    : false
type Assert<Value extends true> = Value
type MembersEqual<Produced, Assembled> = {
  [Key in keyof Assembled]-?: Key extends keyof Produced
    ? Equal<Produced[Key], Assembled[Key]>
    : false
}[keyof Assembled]
type Fidelity<Produced, Assembled> = [
  Equal<keyof Produced, keyof Assembled>,
  Equal<MembersEqual<Produced, Assembled>, true>,
  Equal<Pick<Produced, keyof Produced>, Pick<Assembled, keyof Assembled>>,
  Produced extends Block.AnyBlock ? true : false,
]

const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {}, Recorded: {} })
const ChildOut = Message.defineMessageUnion({ Done: {} })

// A: view, no OutMessage, no EffectsLayer (the UiBlock overload)
const ADefinition = Block.makeDefinition('A', { Model, Message: ChildMessage })
const AComposition = ADefinition.makeComposition()
const aImplementation = {
  init: AComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
  update: AComposition.makeUpdate((model, _message) => ({ model })),
  view: AComposition.makeView((model, h) => h.div([], [String(model.count)])),
}
const AAssembled = AComposition.assembleBlock(aImplementation)
export const ABlock = ADefinition.produceBlock(() =>
  AComposition.assembleBlock(aImplementation),
)

// B: viewless, no OutMessage
const BDefinition = Block.makeDefinition('B', { Model, Message: ChildMessage })
const BComposition = BDefinition.makeComposition()
const bImplementation = {
  init: BComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
  update: BComposition.makeUpdate((model, _message) => ({ model })),
}
const BAssembled = BComposition.assembleBlock(bImplementation)
export const BBlock = BDefinition.produceBlock(() =>
  BComposition.assembleBlock(bImplementation),
)

// C: view and OutMessage
const CDefinition = Block.makeDefinition('C', {
  Model,
  Message: ChildMessage,
  OutMessage: ChildOut,
})
const CComposition = CDefinition.makeComposition()
const cImplementation = {
  init: CComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
  update: CComposition.makeUpdate((model, _message) => ({ model })),
  view: CComposition.makeView((model, h) => h.div([], [String(model.count)])),
}
const CAssembled = CComposition.assembleBlock(cImplementation)
export const CBlock = CDefinition.produceBlock(() =>
  CComposition.assembleBlock(cImplementation),
)

// D: viewless with OutMessage
const DDefinition = Block.makeDefinition('D', {
  Model,
  Message: ChildMessage,
  OutMessage: ChildOut,
})
const DComposition = DDefinition.makeComposition()
const dImplementation = {
  init: DComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
  update: DComposition.makeUpdate((model, _message) => ({ model })),
}
const DAssembled = DComposition.assembleBlock(dImplementation)
export const DBlock = DDefinition.produceBlock(() =>
  DComposition.assembleBlock(dImplementation),
)

// E: chained replaceEffectsLayer (Block<> intersection)
const EAssembled = AAssembled.replaceEffectsLayer(Layer.empty)
export const EBlock = ADefinition.produceBlock(() =>
  AAssembled.replaceEffectsLayer(Layer.empty),
)

// F: host handlers, then provideHandlers
const FDefinition = Block.makeDefinition('F', { Model, Message: ChildMessage })
const Record = FDefinition.makeCommand('Record', {
  args: {},
  messages: [ChildMessage.Recorded],
})
const FComposition = FDefinition.makeComposition()
const fImplementation = {
  init: FComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
  update: FComposition.makeUpdate(
    (model, _message): { model: typeof Model.Type; commands: ReadonlyArray<Command.Command<typeof ChildMessage.Type, never, Command.HandlerOf<typeof Record>>> } => ({
      model,
      commands: [Record({})],
    }),
  ),
  view: FComposition.makeView((model, h) => h.div([], [String(model.count)])),
  EffectsLayer: Layer.empty,
  hostHandlers: [Record],
}
const FAssembled = FComposition.assembleBlock(fImplementation)
export const FHostBlock = FDefinition.produceBlock(() =>
  FComposition.assembleBlock(fImplementation),
)
const recordLayer = Record.toLayer(
  Effect.succeed(() => Effect.succeed(ChildMessage.Recorded())),
)
const FProvided = FAssembled.provideHandlers(recordLayer)
export const FProvidedBlock = FDefinition.produceBlock(() =>
  FAssembled.provideHandlers(recordLayer),
)

export type FidelityA = Assert<Equal<Fidelity<typeof ABlock, typeof AAssembled>, [true, true, true, true]>>
export type FidelityB = Assert<Equal<Fidelity<typeof BBlock, typeof BAssembled>, [true, true, true, true]>>
export type FidelityC = Assert<Equal<Fidelity<typeof CBlock, typeof CAssembled>, [true, true, true, true]>>
export type FidelityD = Assert<Equal<Fidelity<typeof DBlock, typeof DAssembled>, [true, true, true, true]>>
export type FidelityE = Assert<Equal<Fidelity<typeof EBlock, typeof EAssembled>, [true, true, true, true]>>
export type FidelityFHost = Assert<Equal<Fidelity<typeof FHostBlock, typeof FAssembled>, [true, true, true, true]>>
export type FidelityFProvided = Assert<Equal<Fidelity<typeof FProvidedBlock, typeof FProvided>, [true, true, true, true]>>
export type ModelFromDefinition = Assert<Equal<typeof ABlock.Model, typeof Model>>
export type ProvideHandlersNever = Assert<Equal<typeof ABlock.provideHandlers, never>>

// Bindings and embedView
const ParentModel = Schema.Struct({ a: Model, b: Model, c: Model, d: Model })
const ParentMessage = Message.defineMessageUnion({ Noted: {} })
const ParentDefinition = Block.makeDefinition('Parent', {
  Model: ParentModel,
  Message: ParentMessage,
})
const ABinding = ParentDefinition.makeBinding(ABlock, { field: 'a' })
const BBinding = ParentDefinition.makeBinding(BBlock, { field: 'b' })
const BAssembledBinding = ParentDefinition.makeBinding(BAssembled, {
  field: 'b',
  placement: 'BAssembled',
})
const AAssembledBinding = ParentDefinition.makeBinding(AAssembled, {
  field: 'a',
  placement: 'AAssembled',
})
export type EmbedViewProducedA = Assert<
  Equal<
    Parameters<typeof ABinding.embedView>,
    Parameters<typeof AAssembledBinding.embedView>
  >
>
export type EmbedViewProducedB = Assert<
  Equal<
    Parameters<typeof BBinding.embedView>,
    Parameters<typeof BAssembledBinding.embedView>
  >
>
export const canonicalA = ABinding.embedView({
  slotId: 'a',
  model: Model.make({ count: 0 }),
})
export const canonicalAAssembled = AAssembledBinding.embedView({
  slotId: 'a',
  model: Model.make({ count: 0 }),
})

// Program roots
const RootDefinition = Block.makeDefinition('Root', { Model, Message: ChildMessage })
const RootComposition = RootDefinition.makeComposition()
export const RootBlock = RootDefinition.produceBlock(() =>
  RootComposition.assembleBlock({
    init: RootComposition.makeInit(() => ({ model: Model.make({ count: 0 }) })),
    update: RootComposition.makeUpdate((model, _message) => ({ model })),
    view: RootComposition.makeView((model, h) => h.div([], [String(model.count)])),
  }),
)
export const rootProgram = Program.makeElement({ block: RootBlock, container: null })
