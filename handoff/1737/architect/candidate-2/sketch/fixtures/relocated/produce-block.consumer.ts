import { Program } from 'foldkit'
import type { Block } from 'foldkit'

import {
  HeadlessAssembled,
  HeadlessBlock,
  HeadlessOutAssembled,
  HeadlessOutBlock,
  ReplacedViewBlock,
  ViewAssembled,
  ViewBlock,
  ViewOutAssembled,
  ViewOutBlock,
  assembleTwin,
} from './produce-block-block.js'
import {
  ParentDefinition,
  ViewDefinition,
  ViewOutDefinition,
} from './produce-block-definition.js'
import type { Assert, Equal, MembersEqual } from './produce-block-equality.js'
import {
  Any,
  Erased,
  Foreign,
  HeadlessButView,
  Never,
  NotFunction,
  OutTwin,
  SameId,
  SameModel,
  ViewButHeadless,
  WithParameter,
} from './produce-block-invalid.js'

export type ViewKeys = Assert<
  Equal<keyof typeof ViewBlock, keyof typeof ViewAssembled>
>
export type ViewOutKeys = Assert<
  Equal<keyof typeof ViewOutBlock, keyof typeof ViewOutAssembled>
>
export type HeadlessKeys = Assert<
  Equal<keyof typeof HeadlessBlock, keyof typeof HeadlessAssembled>
>
export type HeadlessOutKeys = Assert<
  Equal<keyof typeof HeadlessOutBlock, keyof typeof HeadlessOutAssembled>
>
export type ViewMembers = Assert<
  MembersEqual<typeof ViewAssembled, typeof ViewBlock>
>
export type ViewOutMembers = Assert<
  MembersEqual<typeof ViewOutAssembled, typeof ViewOutBlock>
>
export type HeadlessMembers = Assert<
  MembersEqual<typeof HeadlessAssembled, typeof HeadlessBlock>
>
export type HeadlessOutMembers = Assert<
  MembersEqual<typeof HeadlessOutAssembled, typeof HeadlessOutBlock>
>
export type ChainedKeys = Assert<
  Equal<keyof typeof ReplacedViewBlock, keyof typeof ViewAssembled>
>
export type ModelFromDefinition = Assert<
  Equal<typeof ViewBlock.Model, typeof ViewDefinition.Model>
>
export type OutMessageFromDefinition = Assert<
  Equal<typeof ViewOutBlock.OutMessage, typeof ViewOutDefinition.OutMessage>
>
export type NoOutMessage = Assert<
  Equal<typeof ViewBlock.OutMessage, undefined>
>
export const acceptedAsAnyBlock: ReadonlyArray<Block.AnyBlock> = [
  ViewBlock,
  ViewOutBlock,
  HeadlessBlock,
  HeadlessOutBlock,
  ReplacedViewBlock,
]

const ViewBinding = ParentDefinition.makeBinding(ViewBlock, { field: 'child' })
const HeadlessBinding = ParentDefinition.makeBinding(HeadlessBlock, {
  field: 'child',
})
const AssembledViewBinding = ParentDefinition.makeBinding(ViewAssembled, {
  field: 'child',
})
const AssembledHeadlessBinding = ParentDefinition.makeBinding(
  HeadlessAssembled,
  { field: 'child' },
)
export type EmbedViewOverloads = Assert<
  Equal<typeof ViewBinding.embedView, typeof AssembledViewBinding.embedView>
>
export type HeadlessEmbedViewOverloads = Assert<
  Equal<
    typeof HeadlessBinding.embedView,
    typeof AssembledHeadlessBinding.embedView
  >
>
export const viewRoot = Program.makeElement({
  block: ViewBlock,
  container: document.body,
})
const assembledRoot = Program.makeElement({
  block: ViewAssembled,
  container: document.body,
})
export type RootMatchesAssembled = Assert<
  Equal<typeof viewRoot, typeof assembledRoot>
>

// NOTE: Owner types carry only the id, so the type level cannot tell two
// Definitions with the same id and Model apart. produceBlock throws for them
// when the module loads. The fixture is only compiled, never run.
export const TwinBlock = ViewDefinition.produceBlock(assembleTwin)

type Reason<Produced> = keyof Produced[keyof Produced & 'update']
export type ForeignReason = Assert<
  Equal<Reason<typeof Foreign>, 'The producer returned a Block from a different Definition.'>
>
export type SameModelReason = Assert<
  Equal<Reason<typeof SameModel>, 'The producer returned a Block from a different Definition.'>
>
export type SameIdReason = Assert<
  Equal<
    Reason<typeof SameId>,
    'The producer returned a Block with a different Model than this Definition.'
  >
>
export type OutTwinReason = Assert<
  Equal<Reason<typeof OutTwin>, 'The producer returned a Block whose OutMessage differs from this Definition.'>
>
export type NeverReason = Assert<
  Equal<Reason<typeof Never>, 'The producer must be a function that takes no arguments.'>
>
export type NotFunctionReason = Assert<
  Equal<Reason<typeof NotFunction>, 'The producer must be a function that takes no arguments.'>
>
export type ParameterReason = Assert<
  Equal<Reason<typeof WithParameter>, 'The producer must be a function that takes no arguments.'>
>
export type AnyReason = Assert<
  Equal<Reason<typeof Any>, 'The producer returned any. Return the Block that assembleBlock completes.'>
>
export type ErasedReason = Assert<
  Equal<Reason<typeof Erased>, 'The producer returned never. Return the Block that assembleBlock completes.'>
>
export type ViewButHeadlessReason = Assert<
  Equal<Reason<typeof ViewButHeadless>, 'produceBlock needs a Block with a default view. Use produceHeadlessBlock for a Block without one.'>
>
export type HeadlessButViewReason = Assert<
  Equal<Reason<typeof HeadlessButView>, 'produceHeadlessBlock needs a Block without a default view. Use produceBlock for a Block with one.'>
>
