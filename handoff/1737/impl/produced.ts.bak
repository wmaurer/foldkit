import type { Schema } from 'effect'

import type { DefaultViewTypeId } from './defaultView.js'
import type { BlockContractTemplate } from './definition.js'
import type { Owner } from './owner.js'

type AnySchema = Schema.Codec<any, any, any, any>

type DefinitionKey = 'owner' | 'Model' | 'OutMessage' | typeof DefaultViewTypeId

type CompletedBlockKey =
  | keyof BlockContractTemplate
  | 'OutMessage'
  | typeof DefaultViewTypeId

type ProducerKey = Exclude<keyof BlockContractTemplate, DefinitionKey>

/** @internal Whether a produced Block declares a default view. The produce
 * method's name decides it, never the producer. */
export type ViewPresence = 'View' | 'Viewless'

interface ProducerExpectation<
  OwnerValue,
  ModelSchema,
  OutMessageSchema,
  View extends ViewPresence,
> {
  readonly owner: OwnerValue
  readonly Model: ModelSchema
  readonly OutMessage: OutMessageSchema
  readonly view: View
}

type AnyProducerExpectation = ProducerExpectation<any, any, any, ViewPresence>

declare const InvalidBlockProducerTypeId: unique symbol

interface InvalidBlockProducer<Reason extends string, Evidence = never> {
  readonly [InvalidBlockProducerTypeId]: Reason
  readonly evidence: Evidence
}

type IsAny<Value> = 0 extends 1 & Value ? true : false

type IsMutual<Left, Right> = [Left, Right] extends [Right, Left] ? true : false

type NotNullaryProducer =
  InvalidBlockProducer<'Block producer must be a function with no parameters'>

type NotCompletedBlock =
  InvalidBlockProducer<'Block producer must return a completed Block'>

type ForeignBlock<ProducedOwner> = InvalidBlockProducer<
  'Block producer must return a Block of this Definition',
  ProducedOwner
>

type OutMessageAgrees<Completed, OutMessageSchema> =
  OutMessageSchema extends AnySchema
    ? Completed extends Readonly<{ OutMessage: infer ProducedOutMessage }>
      ? IsMutual<ProducedOutMessage, OutMessageSchema>
      : false
    : Completed extends Readonly<{ OutMessage: unknown }>
      ? false
      : true

type ViewAgrees<Completed, View extends ViewPresence> =
  Completed extends Readonly<{ [DefaultViewTypeId]: unknown }>
    ? View extends 'View'
      ? true
      : InvalidBlockProducer<'produceViewlessBlock requires a Block without a default view. Use produceBlock.'>
    : View extends 'View'
      ? InvalidBlockProducer<'produceBlock requires a Block with a default view. Use produceViewlessBlock.'>
      : true

type KeysAgree<Completed> = [
  Exclude<keyof Completed, CompletedBlockKey>,
] extends [never]
  ? [Exclude<ProducerKey, keyof Completed>] extends [never]
    ? true
    : NotCompletedBlock
  : InvalidBlockProducer<
      'Block producer must return the completed Block. Add members to the produced Block instead.',
      Exclude<keyof Completed, CompletedBlockKey>
    >

type CompletionOf<Expectation extends AnyProducerExpectation, Completed> =
  IsAny<Completed> extends true
    ? InvalidBlockProducer<'Block producer must not return any'>
    : [Completed] extends [never]
      ? NotCompletedBlock
      : Completed extends Readonly<{
            owner: infer ProducedOwner
            Model: infer ProducedModel
          }>
        ? IsMutual<ProducedOwner, Expectation['owner']> extends true
          ? IsMutual<ProducedModel, Expectation['Model']> extends true
            ? OutMessageAgrees<
                Completed,
                Expectation['OutMessage']
              > extends true
              ? ViewAgrees<
                  Completed,
                  Expectation['view']
                > extends infer ViewVerdict
                ? ViewVerdict extends true
                  ? KeysAgree<Completed> extends infer KeysVerdict
                    ? KeysVerdict extends true
                      ? readonly [Completed]
                      : KeysVerdict
                    : never
                  : ViewVerdict
                : never
              : ForeignBlock<ProducedOwner>
            : ForeignBlock<ProducedOwner>
          : ForeignBlock<ProducedOwner>
        : NotCompletedBlock

type ProducedCompletion<Expectation extends AnyProducerExpectation, Producer> =
  IsAny<Producer> extends true
    ? NotNullaryProducer
    : [Producer] extends [never]
      ? NotNullaryProducer
      : Producer extends () => infer Completed
        ? CompletionOf<Expectation, Completed>
        : NotNullaryProducer

type ProducedMember<
  Expectation extends AnyProducerExpectation,
  Producer,
  Key extends PropertyKey,
> =
  ProducedCompletion<Expectation, Producer> extends infer Completion
    ? Completion extends readonly [infer Completed]
      ? Key extends keyof Completed
        ? Completed[Key]
        : NotCompletedBlock
      : Completion
    : never

type ProducerMembers<Expectation extends AnyProducerExpectation, Producer> = {
  readonly [
    Key in keyof BlockContractTemplate as Key extends DefinitionKey
      ? never
      : Key
  ]: ProducedMember<Expectation, Producer, Key>
}

interface NoOutMessage {
  readonly OutMessage?: never
}

interface NoDefaultView {
  readonly [DefaultViewTypeId]?: never
}

/**
 * A completed Block with an OutMessage Schema and a default view, published by
 * a Definition's `produceBlock`. `owner`, `Model`, and `OutMessage` come from
 * the Definition, so reading them does not type the producer. Every other
 * member is the producer's completed Block member, typed when first read.
 */
export interface ProducedBlockWithViewAndOutMessage<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema,
  Producer,
> extends ProducerMembers<
  ProducerExpectation<OwnerValue, ModelSchema, OutMessageSchema, 'View'>,
  Producer
> {
  /** @internal Runtime identity bridge used while lowering child bindings. */
  readonly owner: OwnerValue
  /** Schema for this Block's Model. */
  readonly Model: ModelSchema
  /** Schema for facts this Block reports to its parent. */
  readonly OutMessage: OutMessageSchema
  readonly [DefaultViewTypeId]: ProducedMember<
    ProducerExpectation<OwnerValue, ModelSchema, OutMessageSchema, 'View'>,
    Producer,
    typeof DefaultViewTypeId
  >
}

/**
 * A completed Block with a default view and no OutMessage Schema, published by
 * a Definition's `produceBlock`. `owner` and `Model` come from the Definition,
 * so reading them does not type the producer. Every other member is the
 * producer's completed Block member, typed when first read.
 */
export interface ProducedBlockWithView<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  Producer,
>
  extends
    ProducerMembers<
      ProducerExpectation<OwnerValue, ModelSchema, undefined, 'View'>,
      Producer
    >,
    NoOutMessage {
  /** @internal Runtime identity bridge used while lowering child bindings. */
  readonly owner: OwnerValue
  /** Schema for this Block's Model. */
  readonly Model: ModelSchema
  readonly [DefaultViewTypeId]: ProducedMember<
    ProducerExpectation<OwnerValue, ModelSchema, undefined, 'View'>,
    Producer,
    typeof DefaultViewTypeId
  >
}

/**
 * A completed Block with an OutMessage Schema and no default view, published
 * by a Definition's `produceViewlessBlock`. `owner`, `Model`, and `OutMessage`
 * come from the Definition, so reading them does not type the producer. Every
 * other member is the producer's completed Block member, typed when first read.
 */
export interface ProducedBlockWithOutMessage<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema,
  Producer,
>
  extends
    ProducerMembers<
      ProducerExpectation<
        OwnerValue,
        ModelSchema,
        OutMessageSchema,
        'Viewless'
      >,
      Producer
    >,
    NoDefaultView {
  /** @internal Runtime identity bridge used while lowering child bindings. */
  readonly owner: OwnerValue
  /** Schema for this Block's Model. */
  readonly Model: ModelSchema
  /** Schema for facts this Block reports to its parent. */
  readonly OutMessage: OutMessageSchema
}

/**
 * A completed Block with neither an OutMessage Schema nor a default view,
 * published by a Definition's `produceViewlessBlock`. `owner` and `Model` come
 * from the Definition, so reading them does not type the producer. Every other
 * member is the producer's completed Block member, typed when first read.
 */
export interface ProducedBlockWithoutViewOrOutMessage<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  Producer,
>
  extends
    ProducerMembers<
      ProducerExpectation<OwnerValue, ModelSchema, undefined, 'Viewless'>,
      Producer
    >,
    NoOutMessage,
    NoDefaultView {
  /** @internal Runtime identity bridge used while lowering child bindings. */
  readonly owner: OwnerValue
  /** Schema for this Block's Model. */
  readonly Model: ModelSchema
}

/** @internal Selects the produced Block shape from the Definition's OutMessage
 * Schema and the produce method's view presence. It never reads the producer. */
export type ProducedBlockFor<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema | undefined,
  View extends ViewPresence,
  Producer,
> = OutMessageSchema extends AnySchema
  ? View extends 'View'
    ? ProducedBlockWithViewAndOutMessage<
        OwnerValue,
        ModelSchema,
        OutMessageSchema,
        Producer
      >
    : ProducedBlockWithOutMessage<
        OwnerValue,
        ModelSchema,
        OutMessageSchema,
        Producer
      >
  : View extends 'View'
    ? ProducedBlockWithView<OwnerValue, ModelSchema, Producer>
    : ProducedBlockWithoutViewOrOutMessage<OwnerValue, ModelSchema, Producer>
