// Type core of candidate 1, written against the public foldkit/block types of the
// prototype build so it can be compiled without editing the checkout. In the real
// implementation this lives in packages/foldkit/src/block/produced.ts and derives
// the key set from the internal BlockContract instead of the public headless shape.
import type { Layer, Schema } from 'effect'
import type * as Block from 'foldkit/block'

import type { DefaultViewTypeId } from '../../../wt-base/packages/foldkit/dist/block/defaultView.js'

type AnySchema = Schema.Codec<any, any, any, any>
type AnyFunction = (...args: ReadonlyArray<any>) => any

type ContractTemplate = Block.CompletedBlockWithoutViewOrOutMessage<
  Block.Owner<string>,
  AnySchema,
  AnySchema,
  [],
  [],
  Readonly<{
    init: AnyFunction
    update: AnyFunction
    EffectsLayer: Layer.Layer<any, any, any>
  }>
>

type DirectKey = 'owner' | 'Model' | 'OutMessage' | typeof DefaultViewTypeId

/** Every key a completed Block has. Derived, not listed. */
export type ProducedBlockKey = keyof ContractTemplate

type DeferredKey = Exclude<ProducedBlockKey, DirectKey>

export type ViewPresence = 'View' | 'Viewless'

/** What the Definition already knows about the Block it will produce. */
export interface ProducerExpectation<
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

declare const InvalidBlockProducerTypeId: unique symbol

/** The type every deferred member takes when the producer is rejected. It names the reason and
 * the evidence, such as the producer Block's owner, so the first consumer's error explains it. */
export interface InvalidBlockProducer<Reason extends string, Evidence = never> {
  readonly [InvalidBlockProducerTypeId]: Reason
  readonly evidence: Evidence
}

type IsAny<Value> = 0 extends 1 & Value ? true : false

type IsMutual<Left, Right> = [Left, Right] extends [Right, Left] ? true : false

type ProducedOutMessageMatches<Completed, OutMessageSchema> =
  OutMessageSchema extends AnySchema
    ? Completed extends Readonly<{ OutMessage: infer ProducedOutMessage }>
      ? IsMutual<ProducedOutMessage, OutMessageSchema>
      : false
    : Completed extends Readonly<{ OutMessage: unknown }>
      ? false
      : true

type ProducedViewMatches<Completed, View extends ViewPresence> =
  Completed extends Readonly<{ [DefaultViewTypeId]: unknown }>
    ? View extends 'View'
      ? true
      : InvalidBlockProducer<'produceViewlessBlock requires a Block without a default view. Use produceBlock.'>
    : View extends 'View'
      ? InvalidBlockProducer<'produceBlock requires a Block with a default view. Use produceViewlessBlock.'>
      : true

type ProducedKeysMatch<Completed> =
  [Exclude<keyof Completed, ProducedBlockKey>] extends [never]
    ? [Exclude<DeferredKey, keyof Completed>] extends [never]
      ? true
      : InvalidBlockProducer<'Block producer must return a completed Block'>
    : InvalidBlockProducer<
        'Block producer must return the completed Block. Add members to the produced Block instead.',
        Exclude<keyof Completed, ProducedBlockKey>
      >

type ProducedCompletionOf<
  Expectation extends ProducerExpectation<any, any, any, ViewPresence>,
  Completed,
> =
  IsAny<Completed> extends true
    ? InvalidBlockProducer<'Block producer must not return any'>
    : [Completed] extends [never]
      ? InvalidBlockProducer<'Block producer must return a completed Block'>
      : Completed extends Readonly<{ owner: infer ProducedOwner; Model: infer ProducedModel }>
        ? IsMutual<ProducedOwner, Expectation['owner']> extends true
          ? IsMutual<ProducedModel, Expectation['Model']> extends true
            ? ProducedOutMessageMatches<Completed, Expectation['OutMessage']> extends true
              ? ProducedViewMatches<Completed, Expectation['view']> extends infer ViewVerdict
                ? ViewVerdict extends true
                  ? ProducedKeysMatch<Completed> extends infer KeysVerdict
                    ? KeysVerdict extends true
                      ? readonly [Completed]
                      : KeysVerdict
                    : never
                  : ViewVerdict
                : never
              : InvalidBlockProducer<'Block producer must return a Block of this Definition', ProducedOwner>
            : InvalidBlockProducer<'Block producer must return a Block of this Definition', ProducedOwner>
          : InvalidBlockProducer<'Block producer must return a Block of this Definition', ProducedOwner>
        : InvalidBlockProducer<'Block producer must return a completed Block'>

/** @internal Resolves the producer once. Every deferred member reads this alias with the same
 * arguments, so TypeScript computes it once per produced Block. */
export type ProducedCompletion<
  Expectation extends ProducerExpectation<any, any, any, ViewPresence>,
  Producer,
> =
  IsAny<Producer> extends true
    ? InvalidBlockProducer<'Block producer must be a function with no parameters'>
    : [Producer] extends [never]
      ? InvalidBlockProducer<'Block producer must be a function with no parameters'>
      : Producer extends () => infer Completed
        ? ProducedCompletionOf<Expectation, Completed>
        : InvalidBlockProducer<'Block producer must be a function with no parameters'>

export type ProducedMember<
  Expectation extends ProducerExpectation<any, any, any, ViewPresence>,
  Producer,
  Key extends PropertyKey,
> =
  ProducedCompletion<Expectation, Producer> extends infer Completion
    ? Completion extends readonly [infer Completed]
      ? Key extends keyof Completed
        ? Completed[Key]
        : InvalidBlockProducer<'Block producer must return a completed Block'>
      : Completion
    : never

type ProducedDeferredMembers<
  Expectation extends ProducerExpectation<any, any, any, ViewPresence>,
  Producer,
> = {
  readonly [Key in keyof ContractTemplate as Key extends DirectKey
    ? never
    : Key]: ProducedMember<Expectation, Producer, Key>
}

interface NoOutMessage {
  readonly OutMessage?: never
}

interface NoDefaultView {
  readonly [DefaultViewTypeId]?: never
}

export interface ProducedBlockWithViewAndOutMessage<
  OwnerValue extends Block.Owner<string>,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema,
  Producer,
> extends ProducedDeferredMembers<
    ProducerExpectation<OwnerValue, ModelSchema, OutMessageSchema, 'View'>,
    Producer
  > {
  readonly owner: OwnerValue
  readonly Model: ModelSchema
  readonly OutMessage: OutMessageSchema
  readonly [DefaultViewTypeId]: ProducedMember<
    ProducerExpectation<OwnerValue, ModelSchema, OutMessageSchema, 'View'>,
    Producer,
    typeof DefaultViewTypeId
  >
}

export interface ProducedBlockWithView<
  OwnerValue extends Block.Owner<string>,
  ModelSchema extends AnySchema,
  Producer,
>
  extends
    ProducedDeferredMembers<
      ProducerExpectation<OwnerValue, ModelSchema, undefined, 'View'>,
      Producer
    >,
    NoOutMessage {
  readonly owner: OwnerValue
  readonly Model: ModelSchema
  readonly [DefaultViewTypeId]: ProducedMember<
    ProducerExpectation<OwnerValue, ModelSchema, undefined, 'View'>,
    Producer,
    typeof DefaultViewTypeId
  >
}

export interface ProducedBlockWithOutMessage<
  OwnerValue extends Block.Owner<string>,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema,
  Producer,
>
  extends
    ProducedDeferredMembers<
      ProducerExpectation<OwnerValue, ModelSchema, OutMessageSchema, 'Viewless'>,
      Producer
    >,
    NoDefaultView {
  readonly owner: OwnerValue
  readonly Model: ModelSchema
  readonly OutMessage: OutMessageSchema
}

export interface ProducedBlockWithoutViewOrOutMessage<
  OwnerValue extends Block.Owner<string>,
  ModelSchema extends AnySchema,
  Producer,
>
  extends
    ProducedDeferredMembers<
      ProducerExpectation<OwnerValue, ModelSchema, undefined, 'Viewless'>,
      Producer
    >,
    NoOutMessage,
    NoDefaultView {
  readonly owner: OwnerValue
  readonly Model: ModelSchema
}

/** The two methods a Definition gains. Selection depends only on the Definition. */
export type ProduceMethods<
  OwnerValue extends Block.Owner<string>,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema | undefined,
> = Readonly<{
  produceBlock: <Producer>(
    produce: Producer,
  ) => OutMessageSchema extends AnySchema
    ? ProducedBlockWithViewAndOutMessage<OwnerValue, ModelSchema, OutMessageSchema, Producer>
    : ProducedBlockWithView<OwnerValue, ModelSchema, Producer>
  produceViewlessBlock: <Producer>(
    produce: Producer,
  ) => OutMessageSchema extends AnySchema
    ? ProducedBlockWithOutMessage<OwnerValue, ModelSchema, OutMessageSchema, Producer>
    : ProducedBlockWithoutViewOrOutMessage<OwnerValue, ModelSchema, Producer>
}>

/** Probe stand-in for the method on a Definition: the real method reads the same
 * type parameters from AuthoringDefinition. */
export declare const producerOf: <
  Definition extends Readonly<{
    owner: Block.Owner<string>
    Model: AnySchema
  }>,
>(
  definition: Definition,
) => ProduceMethods<
  Definition['owner'],
  Definition['Model'],
  Definition extends Readonly<{ OutMessage: infer OutMessageSchema extends AnySchema }>
    ? OutMessageSchema
    : undefined
>
