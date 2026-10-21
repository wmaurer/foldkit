import { Program } from 'foldkit'
import type { Block } from 'foldkit'

import {
  AssembledProvidedBlock,
  AssembledReplacedBlock,
  AssembledViewBlock,
  AssembledViewOutBlock,
  AssembledViewlessBlock,
  AssembledViewlessOutBlock,
  ProvidedBlock,
  ReplacedBlock,
  ViewBlock,
  ViewOutBlock,
  ViewlessBlock,
  ViewlessOutBlock,
} from './produced-block-block.js'
import {
  CounterOutMessage,
  Model,
  ParentDefinition,
} from './produced-block-definition.js'
import type {
  Assert,
  Equal,
  MembersEqual,
  ReasonOf,
} from './produced-block-equality.js'
import {
  AnyProducerBlock,
  AnyResultBlock,
  EnrichedBlock,
  ErasedBlock,
  ForeignBlock,
  MissingViewBlock,
  NeverBlock,
  NotFunctionBlock,
  ParameterBlock,
  SameIdBlock,
  UnexpectedViewBlock,
} from './produced-block-invalid.js'

export type ProducedKeys = [
  Assert<Equal<keyof typeof ViewBlock, keyof typeof AssembledViewBlock>>,
  Assert<
    Equal<keyof typeof ViewlessBlock, keyof typeof AssembledViewlessBlock>
  >,
  Assert<Equal<keyof typeof ViewOutBlock, keyof typeof AssembledViewOutBlock>>,
  Assert<
    Equal<keyof typeof ViewlessOutBlock, keyof typeof AssembledViewlessOutBlock>
  >,
  Assert<
    Equal<keyof typeof ReplacedBlock, keyof typeof AssembledReplacedBlock>
  >,
  Assert<
    Equal<keyof typeof ProvidedBlock, keyof typeof AssembledProvidedBlock>
  >,
]

export type ProducedMembers = [
  Assert<MembersEqual<typeof AssembledViewBlock, typeof ViewBlock>>,
  Assert<MembersEqual<typeof AssembledViewlessBlock, typeof ViewlessBlock>>,
  Assert<MembersEqual<typeof AssembledViewOutBlock, typeof ViewOutBlock>>,
  Assert<
    MembersEqual<typeof AssembledViewlessOutBlock, typeof ViewlessOutBlock>
  >,
  Assert<MembersEqual<typeof AssembledReplacedBlock, typeof ReplacedBlock>>,
  Assert<MembersEqual<typeof AssembledProvidedBlock, typeof ProvidedBlock>>,
]

export type DefinitionMembers = [
  Assert<Equal<typeof ViewBlock.Model, typeof Model>>,
  Assert<Equal<typeof ViewOutBlock.OutMessage, typeof CounterOutMessage>>,
  Assert<Equal<typeof ViewBlock.OutMessage, undefined>>,
  Assert<Equal<MembersEqual<{ a: 1 }, { a: 2 }>, false>>,
]

export const producedAsAnyBlock: ReadonlyArray<Block.AnyBlock> = [
  ViewBlock,
  ViewlessBlock,
  ViewOutBlock,
  ViewlessOutBlock,
  ReplacedBlock,
  ProvidedBlock,
]

const ViewBinding = ParentDefinition.makeBinding(ViewBlock, { field: 'child' })
const AssembledViewBinding = ParentDefinition.makeBinding(AssembledViewBlock, {
  field: 'child',
})
const ViewlessBinding = ParentDefinition.makeBinding(ViewlessBlock, {
  field: 'child',
})
const AssembledViewlessBinding = ParentDefinition.makeBinding(
  AssembledViewlessBlock,
  { field: 'child' },
)

export type ProducedBindings = [
  Assert<Equal<keyof typeof ViewBinding, keyof typeof AssembledViewBinding>>,
  Assert<
    Equal<typeof ViewBinding.embedView, typeof AssembledViewBinding.embedView>
  >,
  Assert<
    Equal<
      typeof ViewlessBinding.embedView,
      typeof AssembledViewlessBinding.embedView
    >
  >,
  Assert<
    Equal<
      typeof ViewBinding.embedView,
      typeof AssembledViewlessBinding.embedView
    > extends true
      ? false
      : true
  >,
]

export const producedRoot = Program.makeElement({
  block: ViewBlock,
  container: document.body,
})
const assembledRoot = Program.makeElement({
  block: AssembledViewBlock,
  container: document.body,
})

export type ProducedRoot = Assert<
  Equal<typeof producedRoot, typeof assembledRoot>
>

export type InvalidProducerReasons = [
  Assert<
    Equal<
      ReasonOf<typeof ForeignBlock.init>,
      'Block producer must return a Block of this Definition'
    >
  >,
  Assert<
    Equal<
      ReasonOf<typeof SameIdBlock.init>,
      'Block producer must return a Block of this Definition'
    >
  >,
  Assert<
    Equal<
      ReasonOf<typeof NeverBlock.init>,
      'Block producer must be a function with no parameters'
    >
  >,
  Assert<
    Equal<
      ReasonOf<typeof ErasedBlock.init>,
      'Block producer must return a completed Block'
    >
  >,
  Assert<
    Equal<
      ReasonOf<typeof NotFunctionBlock.init>,
      'Block producer must be a function with no parameters'
    >
  >,
  Assert<
    Equal<
      ReasonOf<typeof ParameterBlock.init>,
      'Block producer must be a function with no parameters'
    >
  >,
  Assert<
    Equal<
      ReasonOf<typeof AnyProducerBlock.init>,
      'Block producer must be a function with no parameters'
    >
  >,
  Assert<
    Equal<
      ReasonOf<typeof AnyResultBlock.init>,
      'Block producer must not return any'
    >
  >,
  Assert<
    Equal<
      ReasonOf<typeof EnrichedBlock.init>,
      'Block producer must return the completed Block. Add members to the produced Block instead.'
    >
  >,
  Assert<
    Equal<
      ReasonOf<typeof MissingViewBlock.init>,
      'produceBlock requires a Block with a default view. Use produceViewlessBlock.'
    >
  >,
  Assert<
    Equal<
      ReasonOf<typeof UnexpectedViewBlock.init>,
      'produceViewlessBlock requires a Block without a default view. Use produceBlock.'
    >
  >,
]
