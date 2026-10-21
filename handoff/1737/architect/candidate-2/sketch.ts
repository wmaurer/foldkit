/**
 * Candidate 2: two entry points chosen by view kind, a Definition-sourced type
 * boundary, a per-Definition runtime mark, and a named producer.
 *
 * MODULE MAP (paths under packages/foldkit/src/block unless stated)
 *
 *   produced.ts          TYPES. Compiled and probed: ./sketch/produced.ts is the exact text.
 *                        Public: ProducedBlock, ProducedBlockKind and the four ProducedBlock* interfaces.
 *                        Internal: CheckedProducer (one verdict per producer), ContractKey (derived from AnyBlock).
 *   blockMark.ts         RUNTIME, new, @internal. One mark per Definition, one WeakMap Block -> mark.
 *   define.ts            AuthoringDefinition gains produceBlock and produceHeadlessBlock.
 *                        makeNamespace(...).makeDefinition creates the mark and builds both producers.
 *   named.ts             authoring.define(contracts, mark) passes the mark through.
 *   definition.ts        makeBaseDefinition(owner, config, mark) and makeDefinition(owner, config, authoring, mark);
 *                        assembleBlock registers the mark next to the four existing WeakMap registrations.
 *   public.ts            export type { ProducedBlock, ProducedBlockKind, ProducedBlockWith* } replaces the prototype's five.
 *
 *   packages/oxlint-plugin-foldkit/src/message.ts, guards.ts, rules/no-child-message-construction-in-root.ts
 *                        recognise produceBlock and produceHeadlessBlock as completions.
 *   packages/oxlint-plugin-foldkit/src/rules/no-inline-block-producer.ts   NEW rule.
 *   packages/foldkit/scripts/codemod-produce-block.ts                      NEW, one-shot migration tool.
 *   packages/foldkit/declaration-tests/produce-block*.ts                   NEW fixtures (see ./sketch/fixtures).
 *   packages/foldkit/src/block/produceBlock.test.ts                        NEW runtime and type tests.
 *   packages/foldkit/type-performance/produce-block-20.ts                  NEW budget fixture.
 *
 * DATA FLOW (one produced Block)
 *
 *   Block.makeDefinition(id, cfg)                        mark := makeDefinitionMark(id)           (runtime, once)
 *     Definition.makeComposition(graph)                  inner makeDefinition receives the mark
 *       Composition.assembleBlock(impl)                  registerBlockMark(block, mark)           (also for replaceEffectsLayer / provideHandlers)
 *     Definition.produceBlock(assemble)                  assemble() once; blockMarkOf(block) === mark; default view present; return the same object
 *   type level: owner, Model, OutMessage from the Definition's own type parameters;
 *               every other member = CheckedProducer<...> verdict, computed on first read, cached.
 */
import type { Schema } from 'effect'
import type { Block } from 'foldkit'

type AnySchema = Schema.Codec<any, any, any, any>

// ---------------------------------------------------------------------------
// define.ts: the only public surface added to a Definition
// ---------------------------------------------------------------------------

export interface ProducingMethods<
  Id extends string,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema | undefined,
  Concrete extends boolean,
> {
  /** Completes this Definition's Block when it has a default view.
   *
   * `produce` is a named function that returns `Composition.assembleBlock(...)`.
   * Pass its name instead of writing the function inside the call. A function
   * written inside the call makes TypeScript check the whole Block several
   * times more often.
   *
   * The result is the same Block object that `produce` returns. Its `owner`,
   * `Model` and `OutMessage` come from this Definition, so reading them does
   * not check `produce`. Every other member is read from the producer's Block
   * when a consumer asks for it, and is an error when the Block belongs to
   * another Definition or has no default view.
   *
   * Throws when `produce` is not a function, returns a Block that no
   * Composition of this exact Definition assembled, or returns a Block
   * without a default view. */
  readonly produceBlock: <Producer>(
    produce: Producer,
  ) => Block.ProducedBlock<
    'View',
    Block.Owner<Id, Concrete>,
    ModelSchema,
    OutMessageSchema,
    Producer
  >

  /** Completes this Definition's Block when it has no default view.
   *
   * Follows the same rules as `produceBlock`. Throws when the producer returns
   * a Block that has a default view. */
  readonly produceHeadlessBlock: <Producer>(
    produce: Producer,
  ) => Block.ProducedBlock<
    'Headless',
    Block.Owner<Id, Concrete>,
    ModelSchema,
    OutMessageSchema,
    Producer
  >
}

// ---------------------------------------------------------------------------
// blockMark.ts: runtime identity of a Definition
// ---------------------------------------------------------------------------

/** @internal One per `Namespace.makeDefinition` call. A fresh object, so two
 * Definitions in one namespace, or two `Block.makeDefinition` calls with the
 * same id, never share a mark. */
export type DefinitionMark = Readonly<{ id: string }>

/** @internal */
export const makeDefinitionMark = (_id: string): DefinitionMark => {
  throw new Error('not implemented')
  // return Object.freeze({ id })
}

/** @internal Called by `assembleBlock` for every Block it builds, including the
 * Blocks `replaceEffectsLayer` and `provideHandlers` build through the same
 * closure. */
export const registerBlockMark = (
  _block: object,
  _mark: DefinitionMark,
): void => {
  throw new Error('not implemented')
  // blockMarks.set(block, mark)
}

/** @internal */
export const blockMarkOf = (_block: object): DefinitionMark | undefined => {
  throw new Error('not implemented')
  // return blockMarks.get(block)
}

// ---------------------------------------------------------------------------
// define.ts: runtime of both methods
// ---------------------------------------------------------------------------

/** @internal Builds `produceBlock` (kind 'View') or `produceHeadlessBlock`
 * (kind 'Headless') for one Definition. Messages follow
 * `assertBindingParentContracts`: `[foldkit] Definition "Ui" produceBlock ...`. */
export const makeProducer =
  (
    _options: Readonly<{
      definitionId: string
      mark: DefinitionMark
      kind: Block.ProducedBlockKind
    }>,
  ) =>
  (_produce: unknown): unknown => {
    throw new Error('not implemented')
    // 1. typeof produce !== 'function'            -> throw "... expects a function that returns a completed Block."
    //    (a function with optional parameters is allowed: the type level only rejects required parameters)
    // 2. const block = produce()                  called exactly once
    // 3. const blockMark = blockMarkOf(block)
    //    undefined                                -> throw "... expects the producer to return a Block completed by assembleBlock."
    //    blockMark !== mark                       -> throw "... received a Block assembled for Definition "<other>"."
    //                                                or "... for a separate Definition that is also named "<same>"." when ids match
    // 4. const hasView = defaultViewOf(block) !== undefined
    //    kind 'View' && !hasView                  -> throw "... received a Block without a default view. Use produceHeadlessBlock."
    //    kind 'Headless' && hasView               -> throw "... received a Block with a default view. Use produceBlock."
    // 5. return block                             the identical object: the four WeakMap registrations stay valid
  }

// makeNamespace(id).makeDefinition(contracts) after the change:
//
//   const mark = makeDefinitionMark(authoring.id)
//   const base = authoring.define(contracts, mark)
//   return {
//     ...base, ...primitives, makeComposition,
//     produceBlock: makeProducer({ definitionId: authoring.id, mark, kind: 'View' }),
//     produceHeadlessBlock: makeProducer({ definitionId: authoring.id, mark, kind: 'Headless' }),
//   }

// ---------------------------------------------------------------------------
// definition.ts and named.ts: threading the mark (signatures only)
// ---------------------------------------------------------------------------

export declare const makeBaseDefinition: (
  owner: Block.Owner<any>,
  config: Readonly<{
    Model: AnySchema
    Message: AnySchema
    OutMessage?: AnySchema
    ChildInitContext?: AnySchema
  }>,
  mark?: DefinitionMark,
) => unknown
// inside makeBaseDefinition.makeComposition:
//   makeDefinition(owner, { ...config, ...graph }, base, mark)
// inside makeDefinition(owner, config, authoring, mark).assembleBlock, after registerBlockHostIdentities:
//   if (mark !== undefined) { registerBlockMark(block, mark) }

// ---------------------------------------------------------------------------
// the rest of the surface a consumer sees: usage compiles against ./sketch/fixtures
// ---------------------------------------------------------------------------

/** Generic factory that owns a Definition (Listbox, Combobox, Tabs, Menu,
 * RadioGroup, VirtualList, Toast). Its public type names the producer as a
 * function type so a `.Model` read does not instantiate the factory. Probed in
 * ./probes/factory: 281 instantiations against 83,013 for the interface that
 * extends the Completed block directly. */
export type FactoryCompleted<
  OwnerValue,
  ModelSchema extends AnySchema,
  OutMessageSchema extends AnySchema,
  FactoryBlock,
> = Block.ProducedBlockWithViewAndOutMessage<
  OwnerValue,
  ModelSchema,
  OutMessageSchema,
  () => FactoryBlock
>

// ---------------------------------------------------------------------------
// oxlint
// ---------------------------------------------------------------------------

/** packages/oxlint-plugin-foldkit/src/rules/no-inline-block-producer.ts
 *
 * Reports a function expression or arrow function passed as the first
 * argument of `<Definition>.produceBlock(...)` or
 * `<Definition>.produceHeadlessBlock(...)`, using `isOwnedDefinitionCall`
 * (guards.ts) to recognise the callee. Message: "Declare the producer as a
 * named function and pass its name. A function written inside the call makes
 * TypeScript check the Block several times more often." No autofix; the
 * codemod rewrites existing sites. Registered in recommended.json and all.json. */
export type NoInlineBlockProducerReport = Readonly<{
  method: 'produceBlock' | 'produceHeadlessBlock'
  producerKind: 'ArrowFunctionExpression' | 'FunctionExpression'
}>

/** message.ts isCompletedBlockVariable gains two alternatives next to the
 * 'assembleBlock' one:
 *   isOwnedDefinitionCall(init, 'produceBlock', references) ||
 *   isOwnedDefinitionCall(init, 'produceHeadlessBlock', references)
 * rules/no-child-message-construction-in-root.ts line 906:
 *   const isCompletion = operation === 'assembleBlock' || operation === 'produceBlock' || operation === 'produceHeadlessBlock' */

// ---------------------------------------------------------------------------
// codemod: packages/foldkit/scripts/codemod-produce-block.ts (run with node)
// ---------------------------------------------------------------------------

export type MigrationSite = Readonly<{
  file: string
  exportName: string
  compositionName: string
  definitionName: string
  kind: Block.ProducedBlockKind
}>

export type SkippedSite = Readonly<{
  file: string
  reason:
    | 'NoDefinitionInScope'
    | 'ImplementationNotAnObjectLiteral'
    | 'AlreadyProduced'
    | 'NotAModuleLevelExport'
}>

/** Finds `export const X = <Composition>.assembleBlock(<implementation>)`,
 * resolves `<Composition>` to `<Definition>.makeComposition(...)` with the
 * TypeScript checker, chooses the kind from a `view` property of the
 * implementation, and rewrites to:
 *
 *   const assemble<X without a Block suffix> = () => <Composition>.assembleBlock(<implementation>)
 *   export const X = <Definition>.<produceBlock | produceHeadlessBlock>(assemble<...>)
 *
 * It adds the Definition import when the Definition is exported from a sibling
 * module and prints every skipped site with its reason. Dry run by default. */
export const planProduceBlockMigration = (
  _rootDirectory: string,
): Readonly<{
  sites: ReadonlyArray<MigrationSite>
  skipped: ReadonlyArray<SkippedSite>
}> => {
  throw new Error('not implemented')
}
