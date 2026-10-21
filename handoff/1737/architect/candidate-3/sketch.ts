// Candidate 3 type sketch for the hardened Definition.produceBlock (#1737).
//
// Module map (all paths under packages/foldkit/src/block/ unless noted):
//
//   produced.ts      REWRITE. Public ProducedBlock, ProducedBlockWithOutMessage,
//                    ProducedBlockWithoutOutMessage; private verdict and member
//                    types. Types only, no runtime code.
//   definition.ts    EDIT. NoDefaultView member becomes required `undefined`;
//                    AnyBlock's default view member accepts `undefined`;
//                    AssembleBlock overload returns and the replaceEffectsLayer /
//                    provideHandlers returns are wrapped in NoInfer;
//                    makeBaseDefinition gains the runtime produceBlock and
//                    assembleBlock registers each Block's origin.
//   defaultView.ts   EDIT. DefaultViewOf infers only an authored view.
//   identity.ts      EDIT. registerBlockOrigin / blockOriginOf beside the other
//                    per-Block registries.
//   define.ts        EDIT. AuthoringDefinition.produceBlock threads
//                    Owner<Id, Concrete>; makeNamespace drops its own
//                    produceBlock and inherits the base one through the spread.
//   public.ts        EDIT. Export the three produced types, drop the five
//                    prototype exports.
//   packages/oxlint-plugin-foldkit/src/message.ts
//                    EDIT. isCompletedBlockVariable also accepts an owned
//                    `produceBlock` call.
//
// Nothing else changes in the first implementation. Bindings, Programs and
// the server keep their existing constraints; they read produced Blocks
// through the ordinary member types.

import type { Schema } from 'effect'

import type { AnyAuthoredView } from '../html/block.js'
import type { DefaultViewTypeId } from './defaultView.js'
import type { CompletedBlockWithViewAndOutMessage } from './definition.js'
import type { Owner } from './owner.js'

type AnySchema = Schema.Codec<any, any, any, any>

// ---------------------------------------------------------------------------
// produced.ts
// ---------------------------------------------------------------------------

/* The single member inventory. Every completed Block interface extends
 * BlockContract plus OutMessage and the default view member, so the keys of
 * this instantiation are the keys of every completed Block. Instantiating an
 * interface with `any` resolves its keys without typing any member. */
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

/* Error records. Each one is assignable to nothing a consumer requires
 * (Owner, AnyFunction, AnySchema), so the first consumer that reads a member
 * reports the record's text in its "Types of property ... are incompatible"
 * elaboration. */
type NotABlockProducer = Readonly<{
  'Block producer must be a function with no parameters that returns a completed Block': never
}>

type ForeignBlock<ProducedOwner> = Readonly<{
  'Block producer must return a Block completed from this Definition': ProducedOwner extends Readonly<{
    id: infer ProducedId
  }>
    ? ProducedId
    : ProducedOwner
}>

type EnrichedBlock<ExtraKey> = Readonly<{
  'Block producer must return the completed Block itself. Add members after produceBlock': ExtraKey
}>

type AcceptedProducer<Completed> = Readonly<{ completed: Completed }>

/* Computed once per (Owner, Model, Producer) triple and cached by the checker.
 * Only member types reference it, so reading `Model` never evaluates it.
 *
 * Rejects, in order:
 * - a `never` producer;
 * - anything not assignable to `() => unknown` (non-functions and functions
 *   with required parameters);
 * - an `any` or `never` return (erased implementations return `never`);
 * - a return without `owner` and `Model`;
 * - an owner or Model that is not mutually assignable with this Definition's
 *   (the ValidateViewOwner pattern);
 * - extra keys beyond the completed Block contract (Query, Toast enrichment).
 */
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

/* Homomorphic over the template, filtered with `as`, so each member keeps the
 * template's TSDoc (probed: `init`, `update`, `bindings` hover docs survive).
 * Adding a member to BlockContract adds it here with no edit. The default
 * view member needs no special case because every completed Block declares
 * it as a required member: the authored view, or `undefined`. */
type ProducedMembers<OwnerValue, ModelSchema, Producer> = {
  readonly [Key in keyof CompletedBlockTemplate as Key extends
    | 'Model'
    | 'OutMessage'
    ? never
    : Key]-?: ProducedMember<OwnerValue, ModelSchema, Producer, Key>
}

/**
 * A Block returned by `Definition.produceBlock` for a Definition that declares
 * an OutMessage Schema. `Model` and `OutMessage` presence come from the
 * Definition. Every other member is the producer's completed Block member,
 * typed only when a consumer reads it.
 */
export interface ProducedBlockWithOutMessage<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  Producer,
> extends ProducedMembers<OwnerValue, ModelSchema, Producer> {
  /** Schema for this Block's Model, taken from its Definition. */
  readonly Model: ModelSchema
  /** Schema for facts this Block reports to a parent. */
  readonly OutMessage: ProducedMember<
    OwnerValue,
    ModelSchema,
    Producer,
    'OutMessage'
  >
}

/**
 * A Block returned by `Definition.produceBlock` for a Definition without an
 * OutMessage Schema. `Model` comes from the Definition. Every other member is
 * the producer's completed Block member, typed only when a consumer reads it.
 */
export interface ProducedBlockWithoutOutMessage<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  Producer,
> extends ProducedMembers<OwnerValue, ModelSchema, Producer> {
  /** Schema for this Block's Model, taken from its Definition. */
  readonly Model: ModelSchema
  readonly OutMessage?: never
}

/**
 * The Block `Definition.produceBlock` returns. The Definition's OutMessage
 * Schema selects the interface, so the choice never types the producer.
 */
export type ProducedBlock<
  OwnerValue extends Owner<string>,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema | undefined,
  Producer,
> = OutMessageSchema extends AnySchema
  ? ProducedBlockWithOutMessage<OwnerValue, ModelSchema, Producer>
  : ProducedBlockWithoutOutMessage<OwnerValue, ModelSchema, Producer>

// ---------------------------------------------------------------------------
// define.ts: the one new member on AuthoringDefinition
// ---------------------------------------------------------------------------

export type AuthoringDefinitionProduceBlock<
  Id extends string,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema | undefined,
  Concrete extends boolean,
> = Readonly<{
  /**
   * Publishes the completed Block that `produce` assembles from this
   * Definition's Composition. `produce` runs once, immediately, and the Block
   * it returns is returned unchanged.
   *
   * The returned Block's `Model` is this Definition's Model Schema, so a
   * parent that reads only `Model` does not type the Composition or the
   * implementation. Every other member is typed from the producer when a
   * consumer reads it.
   *
   * Write the producer as an arrow with no parameters whose body is the
   * `assembleBlock` call (or a chained `replaceEffectsLayer` /
   * `provideHandlers` call on a Block of this Definition). Do not annotate the
   * arrow's return type: an annotation is typed when `Model` is read.
   *
   * A Block assembled from another Definition is a type error at the first
   * consumer that reads a member other than `Model`, and a runtime error here.
   */
  produceBlock: <Producer>(
    produce: Producer,
  ) => ProducedBlock<Owner<Id, Concrete>, ModelSchema, OutMessageSchema, Producer>
}>
// NOTE for implementation: Producer stays a naked, unconstrained type
// parameter and `produce` has no contextual signature (grounding 1). Do not
// add a constraint, a default, an `& Validate<Producer>` intersection or an
// overload here.

// ---------------------------------------------------------------------------
// definition.ts and defaultView.ts deltas (types)
// ---------------------------------------------------------------------------

/* NoDefaultView: the default view member is required on every completed
 * Block. Its type is the authored view or `undefined`. View presence is read
 * from the member type, never from its modifier, which is what lets a
 * produced Block carry it as a deferred member. */
export interface NoDefaultView {
  readonly [DefaultViewTypeId]: undefined
}

/* AnyBlock: `[DefaultViewTypeId]?: AnyAuthoredView | undefined` (was
 * `?: AnyAuthoredView`). Required `undefined` is accepted with and without
 * exactOptionalPropertyTypes. */

/* DefaultViewOf: unchanged shape, plus the view constraint, so `undefined`
 * reads as no view and Program roots report "must have a default view". */
export type DefaultViewOf<BlockValue> =
  BlockValue extends Readonly<{
    [DefaultViewTypeId]: infer View extends AnyAuthoredView
  }>
    ? View
    : never

/* binding.ts:1059 and keyedBinding.ts:316 are unchanged. Their patterns
 * `infer CanonicalView extends AnyBlockView` already fail for `undefined`, so
 * a viewless Block keeps exactly one embedView signature (probed). */

/* AssembleBlock: each of the 11 overloads that returns CompletedBlock<...> or
 * CompletedWithView<...> returns NoInfer<...> instead; the erased overload
 * keeps `never`. BlockOperations.replaceEffectsLayer and provideHandlers
 * return NoInfer<Block<...>>. Precedent: DefineStep, fieldStep,
 * Update.combine already return NoInfer<...>.
 *
 * Why: inside `produceBlock(() => C.assembleBlock(...))` the call's contextual
 * type is the arrow's own return type. Without NoInfer, every overload
 * attempt runs return-type inference against that completed Block. Probed
 * cost: +667k instantiations per produced Block (full TS 7 check), and
 * 776,580 vs 116,496 instantiations for a consumer reading `.init`. */

// ---------------------------------------------------------------------------
// Runtime (definition.ts, identity.ts)
// ---------------------------------------------------------------------------

/** @internal Records the Definition whose Composition assembled a Block.
 * Called by assembleBlock, including the calls replaceEffectsLayer and
 * provideHandlers make in the same closure. */
export const registerBlockOrigin = (_block: object, _origin: object): void => {
  throw new Error('not implemented')
  // TODO blockOrigins.set(block, origin), a module-level WeakMap in identity.ts
}

/** @internal Returns the origin recorded for a completed Block. */
export const blockOriginOf = (_value: unknown): object | undefined => {
  throw new Error('not implemented')
  // TODO Predicate.isObject(value) ? blockOrigins.get(value) : undefined
}

/** @internal Runs a producer for the Definition whose inner runtime
 * definition is `origin`, and returns its Block unchanged. Lives beside
 * makeBaseDefinition, which closes over `origin` (its inner `base`) and puts
 * `produceBlock: produce => produceOwnedBlock(base, owner.id, produce)` on
 * the object it returns. makeNamespace's spread carries it onto the
 * user-held Definition. */
export const produceOwnedBlock = (
  _origin: object,
  _id: string,
  _produce: unknown,
): unknown => {
  throw new Error('not implemented')
  // TODO, each failure throws before the next step:
  // 1. !Predicate.isFunction(produce)
  //    -> `[foldkit] Definition "${id}" produceBlock requires a function that
  //        returns the Block its Composition assembles.`
  // 2. produce.length > 0
  //    -> `[foldkit] Definition "${id}" produceBlock calls its producer with no
  //        arguments. Remove the producer's parameters.`
  // 3. const block = produce(); const blockOrigin = blockOriginOf(block)
  // 4. blockOrigin === undefined
  //    -> `[foldkit] Definition "${id}" produceBlock received a value that is
  //        not a completed Block. Return the result of this Definition's
  //        Composition.assembleBlock.`
  // 5. blockOrigin !== origin
  //    -> `[foldkit] Block "${block.owner.id}" belongs to a different
  //        Definition. Definition "${id}" produceBlock accepts only a Block
  //        assembled from its own Composition.` When the ids are equal, add
  //        `Another Definition with the id "${id}" assembled it.`
  // 6. return block (identity preserved: default view, runtime Bindings,
  //    local channels and host identities stay registered).
}

// In assembleBlock, after registerBlockHostIdentities(block, hostIdentities):
//   if (authoring !== undefined) { registerBlockOrigin(block, authoring) }
// `authoring` is the inner base runtime definition that makeBaseDefinition
// passes to every Composition-level makeDefinition, so it is unique per
// Definition and shared by all of that Definition's Compositions.

// ---------------------------------------------------------------------------
// packages/oxlint-plugin-foldkit/src/message.ts
// ---------------------------------------------------------------------------
// isCompletedBlockVariable: add
//   isOwnedDefinitionCall(definition.node.init, 'produceBlock', references)
// beside the existing 'assembleBlock' check. No rule changes otherwise.
