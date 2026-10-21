// Candidate 1 type sketch: hardened deferred Block production for foldkit/foldkit#1737.
//
// Module map (paths under packages/foldkit/src/block unless noted):
//
//   produced.ts      NEW owner of every produced-Block type. Replaces the prototype file.
//                    Exports four interfaces; everything else is module-private.
//   definition.ts    Owns the runtime: assembleBlock registers each Block's producing
//                    Definition token; makeBaseDefinition gains produceBlock and
//                    produceViewlessBlock beside makeComposition. Exports the internal
//                    key template `BlockContractTemplate` to produced.ts (@internal).
//   define.ts        AuthoringDefinition gains the two method types. The prototype's
//                    makeNamespace-level `produceBlock` closure is deleted; the spread of
//                    `base` carries the methods.
//   public.ts        Exports the four Produced* interfaces. ProducedCompositionBlock is
//                    deleted.
//   packages/oxlint-plugin-foldkit/src/rules/named-block-producer.ts   NEW rule.
//   packages/oxlint-plugin-foldkit/src/message.ts   isCompletedBlockVariable recognizes
//                    produceBlock and produceViewlessBlock initializers.
//
// Bodies are `not implemented`. Probe-validated type core: probes/produced.ts.

import type { Schema } from 'effect'

// ---------------------------------------------------------------------------
// Existing internals this sketch reads (declared here only so the sketch is
// self-contained; they exist in definition.ts, defaultView.ts and owner.ts).
// ---------------------------------------------------------------------------

type AnySchema = Schema.Codec<any, any, any, any>
declare const DefaultViewTypeId: unique symbol
declare const LocalMountsTypeId: unique symbol
declare const LocalEffectsLayerTypeId: unique symbol
interface Owner<Id extends string, Concrete extends boolean = boolean> {
  readonly id: Id
  readonly namespace: Id
  readonly token: object
  readonly __concrete: Concrete
}
interface NoOutMessage {
  readonly OutMessage?: never
}
interface NoDefaultView {
  readonly [DefaultViewTypeId]?: never
}
/** Stand-in for `BlockContract<Owner<string>, AnySchema, AnySchema, AnySchema | undefined,
 * ReadonlyArray<Mount.LayeredMountDefinition>, ReadonlyArray<AnyBinding>, ...>` in
 * definition.ts. Only its key set and member TSDoc matter to produced.ts. */
interface BlockContractTemplate {
  /** @internal Runtime identity bridge used while lowering child bindings. */
  readonly owner: Owner<string>
  /** Schema for this Block's Model. */
  readonly Model: AnySchema
  readonly Message: AnySchema
  readonly mounts: unknown
  readonly [LocalMountsTypeId]: unknown
  readonly bindings: unknown
  readonly init: unknown
  readonly update: unknown
  readonly operations: unknown
  readonly subscriptions: unknown
  readonly managedResources: unknown
  readonly EffectsLayer: unknown
  readonly [LocalEffectsLayerTypeId]: unknown
  readonly __blockHandlerRequirements: unknown
  readonly hostHandlers: unknown
  readonly makeView: unknown
  readonly replaceEffectsLayer: unknown
  readonly provideHandlers: unknown
}

// ===========================================================================
// produced.ts
// ===========================================================================

/** Members a produced Block takes from its Definition instead of its producer. */
type DefinitionKey = 'owner' | 'Model' | 'OutMessage' | typeof DefaultViewTypeId

/** Every key a completed Block has. Derived from the contract, never listed. */
type CompletedBlockKey =
  | keyof BlockContractTemplate
  | 'OutMessage'
  | typeof DefaultViewTypeId

/** Keys whose types come from the producer, read on demand. */
type ProducerKey = Exclude<keyof BlockContractTemplate, DefinitionKey>

type ViewPresence = 'View' | 'Viewless'

/** What the Definition knows about the Block its producer must return. One value per
 * produced Block, so `ProducedCompletion` is computed once and shared by every member. */
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

declare const InvalidBlockProducerTypeId: unique symbol

/** The type every producer-read member takes when the producer is rejected. The first
 * consumer that reads such a member reports the reason, for example
 * `Property 'Type' is missing in type 'InvalidBlockProducer<"Block producer must return a
 * Block of this Definition", Owner<"Other", true>>'`. Module-private. */
interface InvalidBlockProducer<Reason extends string, Evidence = never> {
  readonly [InvalidBlockProducerTypeId]: Reason
  readonly evidence: Evidence
}

type IsAny<Value> = 0 extends 1 & Value ? true : false
type IsMutual<Left, Right> = [Left, Right] extends [Right, Left] ? true : false

/** OutMessage presence and Schema must agree with the Definition. */
type OutMessageAgrees<Completed, OutMessageSchema> =
  OutMessageSchema extends AnySchema
    ? Completed extends Readonly<{ OutMessage: infer ProducedOutMessage }>
      ? IsMutual<ProducedOutMessage, OutMessageSchema>
      : false
    : Completed extends Readonly<{ OutMessage: unknown }>
      ? false
      : true

/** The method name declares view presence; the producer must match it. */
type ViewAgrees<Completed, View extends ViewPresence> =
  Completed extends Readonly<{ [DefaultViewTypeId]: unknown }>
    ? View extends 'View'
      ? true
      : InvalidBlockProducer<'produceViewlessBlock requires a Block without a default view. Use produceBlock.'>
    : View extends 'View'
      ? InvalidBlockProducer<'produceBlock requires a Block with a default view. Use produceViewlessBlock.'>
      : true

/** The producer returns exactly the completed Block: no missing contract key and no
 * member added before production (Query and Toast enrichment). */
type KeysAgree<Completed> =
  [Exclude<keyof Completed, CompletedBlockKey>] extends [never]
    ? [Exclude<ProducerKey, keyof Completed>] extends [never]
      ? true
      : InvalidBlockProducer<'Block producer must return a completed Block'>
    : InvalidBlockProducer<
        'Block producer must return the completed Block. Add members to the produced Block instead.',
        Exclude<keyof Completed, CompletedBlockKey>
      >

type DefinitionMismatch<ProducedOwner> = InvalidBlockProducer<
  'Block producer must return a Block of this Definition',
  ProducedOwner
>

type CompletionOf<
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
            ? OutMessageAgrees<Completed, Expectation['OutMessage']> extends true
              ? ViewAgrees<Completed, Expectation['view']> extends infer ViewVerdict
                ? ViewVerdict extends true
                  ? KeysAgree<Completed> extends infer KeysVerdict
                    ? KeysVerdict extends true
                      ? readonly [Completed]
                      : KeysVerdict
                    : never
                  : ViewVerdict
                : never
              : DefinitionMismatch<ProducedOwner>
            : DefinitionMismatch<ProducedOwner>
          : DefinitionMismatch<ProducedOwner>
        : InvalidBlockProducer<'Block producer must return a completed Block'>

/** Types the producer. Either `readonly [Completed]` or one `InvalidBlockProducer`. Only
 * reached from a producer-read member, never from the call or from `Model`. */
type ProducedCompletion<
  Expectation extends ProducerExpectation<any, any, any, ViewPresence>,
  Producer,
> =
  IsAny<Producer> extends true
    ? InvalidBlockProducer<'Block producer must be a function with no parameters'>
    : [Producer] extends [never]
      ? InvalidBlockProducer<'Block producer must be a function with no parameters'>
      : Producer extends () => infer Completed
        ? CompletionOf<Expectation, Completed>
        : InvalidBlockProducer<'Block producer must be a function with no parameters'>

type ProducedMember<
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

/** Homomorphic over the contract template, so member TSDoc and modifiers carry over
 * (probed: `init`, `update`, `operations`, `Message` keep their contract docs). The key
 * union is static, so resolving the member list never types the producer. */
type ProducerMembers<
  Expectation extends ProducerExpectation<any, any, any, ViewPresence>,
  Producer,
> = {
  readonly [Key in keyof BlockContractTemplate as Key extends DefinitionKey
    ? never
    : Key]: ProducedMember<Expectation, Producer, Key>
}

/**
 * A completed Block with a default view and an OutMessage, published by
 * `Definition.produceBlock`. `owner`, `Model` and `OutMessage` come from the
 * Definition, so reading them never types the producer. Every other member is the
 * producer's completed Block member, typed when first read.
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

/** A completed Block with a default view and no OutMessage, published by
 * `Definition.produceBlock`. See {@link ProducedBlockWithViewAndOutMessage}. */
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
  readonly owner: OwnerValue
  readonly Model: ModelSchema
  readonly [DefaultViewTypeId]: ProducedMember<
    ProducerExpectation<OwnerValue, ModelSchema, undefined, 'View'>,
    Producer,
    typeof DefaultViewTypeId
  >
}

/** A viewless completed Block with an OutMessage, published by
 * `Definition.produceViewlessBlock`. See {@link ProducedBlockWithViewAndOutMessage}. */
export interface ProducedBlockWithOutMessage<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema,
  Producer,
>
  extends
    ProducerMembers<
      ProducerExpectation<OwnerValue, ModelSchema, OutMessageSchema, 'Viewless'>,
      Producer
    >,
    NoDefaultView {
  readonly owner: OwnerValue
  readonly Model: ModelSchema
  readonly OutMessage: OutMessageSchema
}

/** A viewless completed Block without an OutMessage, published by
 * `Definition.produceViewlessBlock`. See {@link ProducedBlockWithViewAndOutMessage}. */
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
  readonly owner: OwnerValue
  readonly Model: ModelSchema
}

/** @internal Selects the produced shape from the Definition alone. Never reads Producer. */
export type ProducedBlockFor<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema | undefined,
  View extends ViewPresence,
  Producer,
> = OutMessageSchema extends AnySchema
  ? View extends 'View'
    ? ProducedBlockWithViewAndOutMessage<OwnerValue, ModelSchema, OutMessageSchema, Producer>
    : ProducedBlockWithOutMessage<OwnerValue, ModelSchema, OutMessageSchema, Producer>
  : View extends 'View'
    ? ProducedBlockWithView<OwnerValue, ModelSchema, Producer>
    : ProducedBlockWithoutViewOrOutMessage<OwnerValue, ModelSchema, Producer>

// ===========================================================================
// define.ts: the members AuthoringDefinition gains (intersected into its
// existing `Readonly<{ makeComposition: ... }>` record, not a new mapped type).
// ===========================================================================

export type AuthoringDefinitionProduction<
  Id extends string,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema | undefined,
  Concrete extends boolean,
> = Readonly<{
  /**
   * Publishes the completed Block that `produce` assembles from this Definition's
   * Composition. The Block must have a default view. Pass a named producer, such as
   * `assembleUiBlock`; `foldkit/named-block-producer` reports an inline function.
   *
   * The Block's `owner`, `Model` and `OutMessage` types come from this Definition,
   * so a parent that reads `UiBlock.Model` does not type the Composition or the
   * implementation. Every other member is typed from the producer when read.
   *
   * Calls `produce` immediately and returns the identical Block. Throws when the
   * Block was not assembled from this Definition or has no default view.
   */
  produceBlock: <Producer>(
    produce: Producer,
  ) => ProducedBlockFor<Owner<Id, Concrete>, ModelSchema, OutMessageSchema, 'View', Producer>
  /**
   * Publishes a completed Block without a default view, such as a Query or a
   * headless child that only a parent's view renders through. Otherwise the same
   * as `produceBlock`. Throws when the Block has a default view.
   */
  produceViewlessBlock: <Producer>(
    produce: Producer,
  ) => ProducedBlockFor<Owner<Id, Concrete>, ModelSchema, OutMessageSchema, 'Viewless', Producer>
}>

// ===========================================================================
// definition.ts: runtime.
// ===========================================================================

/** @internal Completed Block to the runtime Definition whose Composition assembled it.
 * Written only by `assembleBlock` (single writer), read only by the produce methods.
 * Keyed by the identical Block object, like the default-view and binding registries. */
declare const producingDefinitions: WeakMap<object, object>

/** @internal Inside runtime `makeDefinition(owner, config, authoring?)`, after the
 * existing four registrations at the end of `assembleBlock`:
 *
 *   if (authoring !== undefined) { producingDefinitions.set(block, authoring) }
 *
 * `replaceEffectsLayer` and `provideHandlers` re-enter this `assembleBlock`, so their
 * Blocks are registered with the same token. A Definition with no Composition never
 * assembles, so `authoring` is defined on every Block a produce method can accept. */
export declare function registerProducingDefinition(block: object, authoring: object): void

/** @internal Built inside `makeBaseDefinition(owner, config)`, which owns `base` (the
 * inner runtime definition passed to every Composition as `authoring`). Returned beside
 * `makeComposition`; makeNamespace's spread of `base` carries both methods to the
 * user-held Definition. */
export const makeProduceMethods = (
  _ownerId: string,
  _base: object,
): Readonly<{
  produceBlock: (produce: unknown) => unknown
  produceViewlessBlock: (produce: unknown) => unknown
}> => {
  // TODO produce(viewPresence, produce):
  //   if !Predicate.isFunction(produce): throw
  //     `[foldkit] Block "${ownerId}" produceBlock requires a function that returns
  //      the Block assembled from this Definition's Composition.`
  //   const block = produce()
  //   if !Predicate.isObject(block) || producingDefinitions.get(block) !== base: throw
  //     `[foldkit] Block "${ownerId}" produceBlock received a Block assembled from a
  //      different Definition. Return the Block from this Definition's Composition.
  //      assembleBlock.`
  //   const hasView = defaultViewOf(block) !== undefined
  //   View and !hasView: throw `... has no default view. Use produceViewlessBlock.`
  //   Viewless and hasView: throw `... has a default view. Use produceBlock.`
  //   return block   // identical object: WeakMap registrations stay valid
  throw new Error('not implemented')
}

// ===========================================================================
// packages/oxlint-plugin-foldkit/src/rules/named-block-producer.ts
// ===========================================================================

/**
 * Reports `X.produceBlock(<function expression>)` and
 * `X.produceViewlessBlock(<function expression>)` when X is an owned Definition
 * (`isOwnedDefinitionCallee(callee, method, references)`). Message:
 *
 *   "Pass a named producer to produceBlock, such as
 *    `const assembleUiBlock = () => UiComposition.assembleBlock(...)`. An inline
 *    producer makes TypeScript infer the assembly against a contextual type, which
 *    costs about eight times the instantiations of the named form."
 *
 * Suggestion fix: hoist the function to `const assemble<Name>Block` above the
 * declaration, where `<Name>` is the declared variable name minus `Block`.
 */
export declare const namedBlockProducer: unknown
