// packages/foldkit/src/block/produced.ts
// Compiled and probed: this file is the exact type implementation the probes ran against.
import type { Schema } from 'effect'

import type { DefaultViewTypeId } from './internals.js'
import type { AnyBlock } from './internals.js'

type AnySchema = Schema.Codec<any, any, any, any>

/** Whether a produced Block declares a default view. `produceBlock` produces
 * `'View'` Blocks and `produceHeadlessBlock` produces `'Headless'` Blocks. */
export type ProducedBlockKind = 'View' | 'Headless'

type ProducerFailure<Reason extends string> = Readonly<{ [Key in Reason]: never }>

type IsAny<Value> = 0 extends 1 & Value ? true : false

type SameType<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? (<Value>() => Value extends Right ? 1 : 2) extends <
        Value,
      >() => Value extends Left ? 1 : 2
      ? true
      : false
    : false

type HasDefaultView<Completed> = [Completed] extends [
  Readonly<{ [DefaultViewTypeId]: unknown }>,
]
  ? true
  : false

type OutMessageAgrees<OutMessageSchema, Completed> = [OutMessageSchema] extends [
  AnySchema,
]
  ? [Completed] extends [Readonly<{ OutMessage: infer CompletedOutMessage }>]
    ? SameType<CompletedOutMessage, OutMessageSchema>
    : false
  : [Completed] extends [Readonly<{ OutMessage: unknown }>]
    ? false
    : true

type ViewAgrees<Kind extends ProducedBlockKind, Completed> = Kind extends 'View'
  ? HasDefaultView<Completed>
  : HasDefaultView<Completed> extends true
    ? false
    : true

type ViewDisagreement<Kind extends ProducedBlockKind> = Kind extends 'View'
  ? ProducerFailure<'produceBlock needs a Block with a default view. Use produceHeadlessBlock for a Block without one.'>
  : ProducerFailure<'produceHeadlessBlock needs a Block without a default view. Use produceBlock for a Block with one.'>

type CheckCompleted<
  Kind extends ProducedBlockKind,
  OwnerValue,
  ModelSchema,
  OutMessageSchema,
  Completed,
> =
  IsAny<Completed> extends true
    ? ProducerFailure<'The producer returned any. Return the Block that assembleBlock completes.'>
    : [Completed] extends [never]
      ? ProducerFailure<'The producer returned never. Return the Block that assembleBlock completes.'>
      : [Completed] extends [
            Readonly<{ owner: infer CompletedOwner; Model: infer CompletedModel }>,
          ]
        ? SameType<CompletedOwner, OwnerValue> extends true
          ? SameType<CompletedModel, ModelSchema> extends true
            ? OutMessageAgrees<OutMessageSchema, Completed> extends true
              ? ViewAgrees<Kind, Completed> extends true
                ? Readonly<{ completed: Completed }>
                : ViewDisagreement<Kind>
              : ProducerFailure<'The producer returned a Block whose OutMessage differs from this Definition.'>
            : ProducerFailure<'The producer returned a Block with a different Model than this Definition.'>
          : ProducerFailure<'The producer returned a Block from a different Definition.'>
        : ProducerFailure<'The producer must return a completed Block.'>

/** @internal The verdict on one producer. TypeScript caches it per instantiation, so every member reads the same answer. */
export type CheckedProducer<
  Kind extends ProducedBlockKind,
  OwnerValue,
  ModelSchema,
  OutMessageSchema,
  Producer,
> = [Producer] extends [never]
  ? ProducerFailure<'The producer must be a function that takes no arguments.'>
  : [Producer] extends [() => infer Completed]
    ? CheckCompleted<Kind, OwnerValue, ModelSchema, OutMessageSchema, Completed>
    : ProducerFailure<'The producer must be a function that takes no arguments.'>

type ProducedMember<Checked, Key extends PropertyKey> =
  Checked extends Readonly<{ completed: infer Completed }>
    ? Key extends keyof Completed
      ? Completed[Key]
      : ProducerFailure<'The producer returned an incomplete Block.'>
    : Checked

type ContractKey = Exclude<
  keyof AnyBlock,
  'owner' | 'Model' | 'OutMessage' | typeof DefaultViewTypeId
>

type ProducedContract<
  Kind extends ProducedBlockKind,
  OwnerValue,
  ModelSchema,
  OutMessageSchema,
  Producer,
> = {
  readonly [Key in ContractKey]: ProducedMember<
    CheckedProducer<Kind, OwnerValue, ModelSchema, OutMessageSchema, Producer>,
    Key
  >
}

interface ProducedFields<
  Kind extends ProducedBlockKind,
  OwnerValue,
  ModelSchema extends AnySchema,
  OutMessageSchema,
  Producer,
> extends ProducedContract<Kind, OwnerValue, ModelSchema, OutMessageSchema, Producer> {
  readonly owner: OwnerValue
  readonly Model: ModelSchema
}

/** A produced Block with a default view and an OutMessage. `owner`, `Model`
 * and `OutMessage` come from the Definition. Every other member is read from
 * the producer's completed Block when a consumer asks for it. */
export interface ProducedBlockWithViewAndOutMessage<
  OwnerValue,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema,
  Producer,
> extends ProducedFields<'View', OwnerValue, ModelSchema, OutMessageSchema, Producer> {
  readonly OutMessage: OutMessageSchema
  readonly [DefaultViewTypeId]: ProducedMember<
    CheckedProducer<'View', OwnerValue, ModelSchema, OutMessageSchema, Producer>,
    typeof DefaultViewTypeId
  >
}

/** A produced Block with a default view and no OutMessage. */
export interface ProducedBlockWithView<
  OwnerValue,
  ModelSchema extends AnySchema,
  Producer,
> extends ProducedFields<'View', OwnerValue, ModelSchema, undefined, Producer> {
  readonly OutMessage?: never
  readonly [DefaultViewTypeId]: ProducedMember<
    CheckedProducer<'View', OwnerValue, ModelSchema, undefined, Producer>,
    typeof DefaultViewTypeId
  >
}

/** A produced Block with an OutMessage and no default view. */
export interface ProducedBlockWithOutMessage<
  OwnerValue,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema,
  Producer,
> extends ProducedFields<'Headless', OwnerValue, ModelSchema, OutMessageSchema, Producer> {
  readonly OutMessage: OutMessageSchema
  readonly [DefaultViewTypeId]?: never
}

/** A produced Block with neither a default view nor an OutMessage. */
export interface ProducedBlockWithoutViewOrOutMessage<
  OwnerValue,
  ModelSchema extends AnySchema,
  Producer,
> extends ProducedFields<'Headless', OwnerValue, ModelSchema, undefined, Producer> {
  readonly OutMessage?: never
  readonly [DefaultViewTypeId]?: never
}

/** Selects the produced Block interface for a Definition's OutMessage and the
 * declared view kind. The Definition methods `produceBlock` and
 * `produceHeadlessBlock` return it. Name one of the four interfaces directly
 * when the shape is known, as a generic factory's public `Completed` type does. */
export type ProducedBlock<
  Kind extends ProducedBlockKind,
  OwnerValue,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema | undefined,
  Producer,
> = Kind extends 'View'
  ? [OutMessageSchema] extends [AnySchema]
    ? ProducedBlockWithViewAndOutMessage<OwnerValue, ModelSchema, OutMessageSchema, Producer>
    : ProducedBlockWithView<OwnerValue, ModelSchema, Producer>
  : [OutMessageSchema] extends [AnySchema]
    ? ProducedBlockWithOutMessage<OwnerValue, ModelSchema, OutMessageSchema, Producer>
    : ProducedBlockWithoutViewOrOutMessage<OwnerValue, ModelSchema, Producer>
