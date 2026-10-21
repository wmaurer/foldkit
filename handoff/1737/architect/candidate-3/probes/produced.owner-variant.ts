import type { Schema } from 'effect'

import type { CompletedBlockWithViewAndOutMessage } from './definition.js'
import type { Owner } from './owner.js'

type AnySchema = Schema.Codec<any, any, any, any>

type CompletedBlockTemplate = CompletedBlockWithViewAndOutMessage<
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

type CompletedBlockKey = keyof CompletedBlockTemplate

type NotABlockProducer = Readonly<{
  'Block producer must be a function with no parameters that returns a completed Block': never
}>

type ForeignBlock<ProducedOwner> = Readonly<{
  'Block producer must return a Block completed from this Definition': ProducedOwner
}>

type EnrichedBlock<ExtraKey> = Readonly<{
  'Block producer must return the completed Block itself. Add members after produceBlock': ExtraKey
}>

type AcceptedProducer<Completed> = Readonly<{ completed: Completed }>

type ProducerVerdict<OwnerValue, ModelSchema, Producer> = [Producer] extends [
  never,
]
  ? NotABlockProducer
  : Producer extends () => infer Completed
    ? 0 extends 1 & Completed
      ? NotABlockProducer
      : [Completed] extends [never]
        ? NotABlockProducer
        : Completed extends Readonly<{
              owner: infer ProducedOwner
              Model: infer ProducedModel
            }>
          ? [ProducedOwner, OwnerValue] extends [OwnerValue, ProducedOwner]
            ? [ProducedModel, ModelSchema] extends [ModelSchema, ProducedModel]
              ? [Exclude<keyof Completed, CompletedBlockKey>] extends [never]
                ? AcceptedProducer<Completed>
                : EnrichedBlock<Exclude<keyof Completed, CompletedBlockKey>>
              : ForeignBlock<ProducedOwner>
            : ForeignBlock<ProducedOwner>
          : NotABlockProducer
    : NotABlockProducer

type ProducedMember<OwnerValue, ModelSchema, Producer, Key> = [
  ProducerVerdict<OwnerValue, ModelSchema, Producer>,
] extends [AcceptedProducer<infer Completed>]
  ? Key extends keyof Completed
    ? Completed[Key]
    : NotABlockProducer
  : ProducerVerdict<OwnerValue, ModelSchema, Producer>

type ProducedMembers<OwnerValue, ModelSchema, Producer> = {
  readonly [Key in keyof CompletedBlockTemplate as Key extends
    | 'Model'
    | 'OutMessage'
    ? never
    : Key]-?: ProducedMember<OwnerValue, ModelSchema, Producer, Key>
}

/** A produced Block whose Definition declares an OutMessage. */
export interface ProducedBlockWithOutMessage<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  Producer,
> extends ProducedMembers<OwnerValue, ModelSchema, Producer> {
  readonly Model: ModelSchema
  readonly OutMessage: ProducedMember<
    OwnerValue,
    ModelSchema,
    Producer,
    'OutMessage'
  >
}

/** A produced Block whose Definition declares no OutMessage. */
export interface ProducedBlockWithoutOutMessage<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  Producer,
> extends ProducedMembers<OwnerValue, ModelSchema, Producer> {
  readonly Model: ModelSchema
  readonly OutMessage?: never
}

/** The Block `Definition.produceBlock` returns. */
export type ProducedBlock<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema | undefined,
  Producer,
> = OutMessageSchema extends AnySchema
  ? ProducedBlockWithOutMessage<OwnerValue, ModelSchema, Producer>
  : ProducedBlockWithoutOutMessage<OwnerValue, ModelSchema, Producer>
