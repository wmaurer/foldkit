# Explorer: verification gates for a new public Block API (produceBlock, #1737)

Checkouts: `BASE` = wt-base (65d1cd9c + prototype d8626087d), `TIP` = wt-tip (65d1cd9c + 9a5f9307). Both share 65d1cd9c, so gate scripts differ only by what those two commits add. Nothing was built or run; everything below is read from source.

## Components Found

- Root gate aliases, `TIP/package.json:100-102`: `check:emitted-declarations` = `pnpm --filter foldkit --filter @foldkit/ui check:emitted-declarations`, so ONE root command runs TWO gates (core + UI). `check:block-type-performance` and `update:block-type-performance` delegate to foldkit only.
- Root `check`, `TIP/package.json:12`: builds foldkit, @foldkit/node, @foldkit/vite-plugin and @typing-game/shared, then runs emitted-declarations, block-type-performance, typecheck:scripts, `pnpm -r typecheck`, lint, dead-code, effect-prebundle and ui-subpath-exports.
- Root `pre-push`, `TIP/package.json:39`: the full ordered gate list, ending with `pnpm build && check:emitted-declarations && check:block-type-performance && pnpm -r typecheck && pnpm test && bash scripts/run-website-e2e.sh`.
- foldkit package scripts, `TIP/packages/foldkit/package.json:168-176`: `build` = `rimraf dist && tsc -b tsconfig.build.json`, `typecheck` = `tsc -p tsconfig.json --noEmit` (src including `*.test.ts`), `test` = `vitest run --coverage`.
- Core emitted-declaration gate, `TIP/packages/foldkit/scripts/check-emitted-declarations.ts:1-776`: emits, relocates and consumes declaration fixtures through the built `dist`, then runs two TS-API language-service checks.
- `checks` table, `check-emitted-declarations.ts:441-671`: 37 entries of `{ name, accepted[], rejected[], consumers[] }`. 9a5f9307 added `schema-boundary` at :647-652.
- Gate compiler options, `check-emitted-declarations.ts:379-390`: `strict`, `skipLibCheck: false`, NodeNext, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `types: []`.
- `prepareConsumer`, `:392-410`: creates a temp package whose `node_modules/foldkit` is a symlink to `packages/foldkit`, so fixtures resolve the package `exports`, which point at `./dist/*.d.ts` (`packages/foldkit/package.json:9-12`).
- `assertPortableDeclarations`, `:412-439`: fails when an emitted `.d.ts` imports an absolute path or a `../` path.
- `assertBindingCompletions`, `:65-111`: opens `declaration-tests/tsconfig.accepted.json` through `typescript/dist/api/async/api.js`, requires zero semantic diagnostics in `accepted.ts`, and requires completions after `ChildBinding.` to be exactly `['embedView','fold','init','placement','refresh']`.
- `assertBindingConfigurationDocs`, `:113-377`: through `tsconfig.binding-intellisense.json`, requires non-empty TSDoc on the contextual properties of named `makeBinding` / `Binding.init` configuration objects.
- `declaration-tests/` (TIP): 122 `.ts` files plus `tsconfig.*.json`. Only `tsconfig.accepted.json` and `tsconfig.binding-intellisense.json` are referenced by any script. The other tsconfigs (focused, keyed-field, program, render, ...) have no reference in the repo.
- schema-boundary fixtures (9a5f9307), `TIP/packages/foldkit/declaration-tests/schema-boundary*.ts`: the only split-file fixture. It has 9 helper modules (`-model`, `-message`, `-definition`, `-block`, `-public` barrel, `-parent-model`, `-model-only`, `-parent-composition`, `-equality`) plus `.accepted.ts`, `.consumer.ts` and `.rejected.ts`.
- `schema-boundary-equality.ts`: the exact-equality helpers `Equal<L,R>` (the double-generic-function trick), `Assert<V extends true>`, and `Channels<Codec>` = `[Type, Encoded, DecodingServices, EncodingServices]`.
- UI emitted-declaration gate, `BASE/packages/ui/scripts/check-emitted-declarations.ts:1-331`: builds isolated foldkit and UI declarations with `tsc -b` into a temp dir. It emits `generic-composition.accepted.ts`, checks the emitted text for `Combobox.Completed<"Apple" | "Pear", "Apple" | "Pear">` and `Combobox.Completed<string, number>`, compiles the rejected file, then relocates and compiles the consumer.
- Block type-performance gate, `TIP/packages/foldkit/scripts/check-block-type-performance.ts:1-449`: runs `tsc --extendedDiagnostics --noEmit` per fixture, subtracts the `baseline.ts` counts, and compares Instantiations and Types against `budgets.json`.
- `type-performance/fixtures.json`: the manifest `{ fixtures: [{ name, file }] }` with three entries: `deep-composition-8`, `wide-composition-100`, `command-requirements-200`.
- `type-performance/budgets.json`: `typescriptVersion: "7.0.2"` plus per-fixture `maxInstantiationsDelta` / `maxTypesDelta` (deep 1,152,618 / 55,843; wide 3,132,298 / 216,662; command 2,659,415 / 389,460).
- `type-performance/tsconfig.json`: the base config the harness extends (`files: ["baseline.ts"]`, `skipLibCheck: true`, NodeNext).
- `type-performance/README.md`: harness documentation, the LSP benchmark guide, and a per-change history of measurement sections. 9a5f9307 appended "Source Model Schema boundaries".
- Harness self-test, `BASE/scripts/block-type-performance.test.mjs`: a `node --test` suite run by `pnpm test:scripts` (`scripts/run-script-tests.sh`). It calls `exceededBudgetMetrics`, and it spawns the real harness on `deep-composition-8` with a mutated budget and expects `failed: Instantiations`.
- LSP latency profiler, `BASE/packages/foldkit/scripts/profile-block-language-service.ts:1-1344`: an opt-in native `tsc --lsp --stdio` benchmark over hard-coded Website files. It has no CI threshold.
- Block source type tests, `BASE/packages/foldkit/src/block/*.test.ts`: vitest files that combine runtime `expect` with compile-time `expectTypeOf(...).toEqualTypeOf<...>()` and `// @ts-expect-error <reason>`. For example, `authoring.test.ts` has 60 `expectTypeOf` and 62 `@ts-expect-error`, and `requirements.test.ts` has 47 `expectTypeOf`.
- `compositionSafety.test.ts` (BASE, 110 lines): runtime-only. It deliberately calls `Reflect.apply(Composition.assembleBlock, undefined, [...])` to bypass static types and assert runtime guards (`toThrow('A contextual child update requires delivery.toUpdateContext')`). This is the template for runtime rejection of a mismatched producer.
- Prototype runtime, `BASE/packages/foldkit/src/block/define.ts:280-282`: `const produceBlock = (produce: () => unknown): unknown => produce()`, attached only inside `makeNamespace(...).makeDefinition`. `Block.makeDefinition` (`define.ts:404-416`) routes through that same path, so both entry points get it.
- Prototype types, `BASE/packages/foldkit/src/block/produced.ts:1-95`: `ProducedMember<Producer, Key>` (guards for a `never` producer, a non-function, a `never` return and a missing key, each yielding `InvalidBlockProducer`), `ProducedBlockFields` (a hand-written inventory of 17 members), four `ProducedBlockWith*` interfaces, and `ProducedCompositionBlock`, which selects only on `OutMessageSchema`.
- Prototype public surface, `BASE/packages/foldkit/src/block/public.ts:87-93` and `define.ts:171-176`: the five `Produced*` types are exported, and `produceBlock: <Producer>(produce: Producer) => ProducedCompositionBlock<ModelSchema, OutMessageSchema, Producer>` is added to `AuthoringDefinition`. The built `BASE/packages/foldkit/dist/block/define.d.ts:44` already contains it, so BASE's dist was rebuilt after the prototype.
- Prototype consumer, `BASE/packages/website/src/page/ui/block.ts`: the only consumer, `UiBlock = UiDefinition.produceBlock(() => UiComposition.assembleBlock({ init, update, view }))`. `UiDefinition` has no OutMessage (`page/ui/definition.ts`), so this is the `ProducedBlockWithView` shape.
- Completed Block shapes, `BASE/packages/foldkit/src/block/definition.ts:2038-2160, 2302-2352`: four interfaces, `CompletedBlockWithViewAndOutMessage`, `CompletedBlockWithView`, `CompletedBlockWithOutMessage` and `CompletedBlockWithoutViewOrOutMessage`, selected by `CompletedBlock` on OutMessageSchema and on `ImplementationValue extends { view }`. `AnyBlock` (`:2428-2449`) is the structural bound and has `[DefaultViewTypeId]?: AnyAuthoredView` and `OutMessage?: AnySchema`.
- Lint config, `TIP/.oxlintrc.json:23-27, 49-66`: `no-explicit-any` is an error except in `packages/foldkit/src/**` and `declaration-tests/**/*.rejected.ts`. `consistent-type-assertions: never` applies everywhere, and `foldkit/block-name-matches-variable` is off in declaration-tests.
- Knip, `BASE/knip.json:37-38`: `declaration-tests/**/*.ts` and `type-performance/*.ts` are entry files. `check:dead-code` (`package.json:17`) checks files and dependencies, not unused exports.
- Scripts typecheck, `TIP/scripts/tsconfig.json`: `typecheck:scripts` includes all three foldkit gate scripts and the UI gate script, so edits to them must typecheck.
- CI, `BASE/.github/workflows/ci.yml:103-113`: build reusable packages, then emitted declarations, then block-type-performance, then `lint:ci`, unconditionally. Later steps run typecheck, test:scripts and `pnpm test`, change-scoped.

## Flow

### `check:emitted-declarations` (core), `check-emitted-declarations.ts:673-767`
1. Assert that `dist/index.d.ts`, `dist/block/public.d.ts`, `dist/command/public.d.ts` and `dist/update/public.d.ts` exist (`:57-63`). The gate does not build, so a stale `dist` silently tests old types.
2. Require the package `node_modules/.bin/tsc --version` to match `^Version 7\.`.
3. Create a temp `emitter/` and `consumer/` package, each symlinking `foldkit` to `packages/foldkit` and `effect` to the package's own effect. Copy the whole `declaration-tests/` into `emitter/fixtures`.
4. For each of the 37 checks:
   - (a) Emit: write `<name>.accepted.json` with `declaration`, `emitDeclarationOnly`, `noEmitOnError` and `files: accepted[]`. tsc emits `.d.ts` for the accepted files AND every local module they import transitively, which is how the 9 schema-boundary helpers get declarations without being listed.
   - (b) Run `assertPortableDeclarations` on the output.
   - (c) Rejected-from-source: compile `rejected[]` with `noEmit` against the copied `.ts` sources. It must exit 0, so every rejection is a `// @ts-expect-error <reason>` line. An unused directive (TS2578) or any other error fails the gate.
   - (d) Relocate: copy the emitted `.d.ts` tree into `consumer/<name>/`, copy in `consumers[]` AND `rejected[]`, and compile both with `noEmit`. Local imports such as `./schema-boundary-block.js` now resolve to emitted `.d.ts`, so each rejected case is checked a second time against declarations.
5. Run `assertBindingCompletions` and `assertBindingConfigurationDocs`, both through the TS7 async API.
6. Print `[emitted-declarations] ... checks passed.` The temp workspace is removed in `finally`.

### Accepted and rejected encoding (schema-boundary template, 9a5f9307)
- Accepted: `export type X = Assert<Equal<A, B>>` for exact identity (`typeof Child.Model` vs `typeof Child.ChildBlock.Model`), Codec channels, Encoded, Decoding/EncodingServices, Layer services (`Layer.Services<typeof ChildBlock.EffectsLayer>` = `Store`), Command requirements (`Update.RequirementsOf<typeof update>` vs the Command's inferred `R`), the parent Block Model, Message identity, and operation `Parameters`. It also has bidirectional assignability functions (`verifyExact`, `verifyReverse`, `acceptCodec`), because `Equal` alone does not prove use-site assignability.
- Consumer: `schema-boundary.consumer.ts` is byte-identical to `.accepted.ts` (same blob `a236af52a`), so the same assertions run against the relocated declarations. Other checks use the suffix `.consume.ts`; schema-boundary uses `.consumer.ts`. The script lists the file names explicitly, so either works.
- Rejected: `// @ts-expect-error <reason>` directly above the failing statement. For example, a branded field given a plain number, an operation argument outside its literal union, an unregistered child Step (the directive is placed inside the `makeUpdate` callback, on the line before the call, so the error lands on that line), `assembleBlock` without the Command handler Layer, and a Binding to an incompatible parent field.
- Registration is one entry in the `checks` array (`check-emitted-declarations.ts:647-652`). Nothing else needs to change.

### `check:block-type-performance`, `check-block-type-performance.ts:270-432`
1. Parse `--update`, `--budgets <path>` and at most one fixture name. Decode `budgets.json` and `fixtures.json` with Schema.
2. Assert that `dist/runtime/programPublic.d.ts`, `block/public.d.ts`, `command/public.d.ts` and `update/public.d.ts` exist.
3. The TS version must equal `budgets.typescriptVersion` unless the run is a full `--update`.
4. For `baseline.ts` and then each selected fixture, write a temp tsconfig extending `type-performance/tsconfig.json` with `files: [fixture]`, run `tsc -p ... --extendedDiagnostics --noEmit --pretty false`, and regex the `Instantiations:`, `Types:` and `Symbols:` lines. The compile must succeed, so a fixture with a type error fails.
5. The delta is fixture minus baseline. The gate fails when the instantiations or types delta exceeds its maximum, or when the fixture has no budget (`missing budget`). Symbols are reported only. `--update` writes the exact observed deltas with no tolerance.
- Fixtures import `foldkit/block`, `foldkit/message`, `foldkit/program` and `foldkit/update`, which resolve through package self-reference to `dist`.

### `profile-block-language-service.ts` (opt-in)
- CLI options are only `--runs` (default 3) and `--timeout-ms` (default 60000), `:175-194`. Every workload path and marker is a constant: `definitionPath` = `packages/website/src/definition.ts`, `compositionPath` = `packages/website/src/composition/composition.ts`, `changedUrlPath` = `packages/website/src/update/handleChangedUrl.ts`, `bindingCall` = `SearchBinding.informRouteChanged()`, `routeWriter` = `route: () => nextRoute`, error code 2322 (`:90-96`).
- Each scenario spawns a fresh native server (`@typescript/typescript-<platform>-<arch>/lib/tsc --lsp --stdio`, cwd workspace root) and requires incremental sync (change kind 2), UTF-16 positions and pull diagnostics (`:481-538`).
- Five scenarios per run, 28 rows per run (84 for `--runs 3`):
  - `hoverScenario`: `hover.first` / `hover.warm` on `ApplicationDefinition` in definition.ts, then `hover.postWhitespace(Warm)` and `hover.postSemantic(Warm)` on `SearchBinding` in composition.ts after full-text `didChange` edits.
  - `definitionScenario`: `definition.first/warm/postWhitespace/postWhitespaceWarm` on the `makeBinding`/`bindChild` marker.
  - `completionScenario`: `completion.*` on `previousRoute.` inside the `Transition.stayed(transition, 'ExampleDetail')` context, expecting `_tag` and `exampleSlug`.
  - `bindingCompletionScenario`: `bindingCompletion.first/warm/postWhitespace/postWhitespaceWarm` after `SearchBinding.`, expecting `informRouteChanged` and `embedView`. Uses a ranged newline edit.
  - `changedUrlWorkflowScenario`: `changedUrl.hover.{first,warm,postWhitespace,postWhitespaceWarm}` (hover must match `SearchBinding:\s*InitializedBinding<` and contain `Owner<"Search"`, and must not be `any|unknown|never`), `changedUrl.diagnostics.clean`, `.badRoute` (`nextRoute` becomes `1709`, requiring TS2322 exactly at the `route` property), `.restored` (clean), `changedUrl.hover.postRestore(Warm)`, and `changedUrl.completion.postRestoreWarm`. Fails unless the text equals the original plus a newline.
- Metadata (`:1220-1314`):
  - `sourceCommit` comes from `git rev-parse HEAD`.
  - `sourceWorkloadDirty` is `git status --porcelain --untracked-files=all -- <workloadGitPaths>` being non-empty. The globs cover `packages/website/**/*.ts*`, `packages/**/src/**`, `internal/**/src/**`, all `packages/**/*.d.ts(.map)`, every `package.json`, the website tsconfig, the lockfile, `pnpm-workspace.yaml` and `tsconfig.base.json` (`:104-136`).
  - `workloadSha256` hashes the relative path and bytes of the same set, including `dist` `.d.ts` files and maps (`:1122-1168`). It fails if `packages/foldkit/dist` is missing, and it is recomputed after the runs: "changed during the run" fails.
  - Also recorded: `lockfileSha256`, `benchmarkScriptSha256` (rechecked at the end), `compilerPackageVersion`, `nativeCompilerPackage`, server info (checked against the TS version in every scenario), Node, platform, arch, runs, timeout and `formatVersion: 2`. The output has `summary` (per-label samples, median, min, max) and raw `runs`.

## Files Read

- `TIP/package.json` (scripts), `TIP/packages/foldkit/package.json` (scripts), `BASE/packages/foldkit/package.json` (exports)
- `TIP/packages/foldkit/scripts/check-emitted-declarations.ts` (full), `TIP/packages/foldkit/scripts/check-block-type-performance.ts` (full), `BASE/packages/foldkit/scripts/profile-block-language-service.ts` (full)
- `git show 9a5f9307` for all of `declaration-tests/schema-boundary*`, `check-emitted-declarations.ts`, `type-performance/README.md` and the `AGENTS.md` hunks. Also `git show d8626087d` (full).
- `TIP/packages/foldkit/type-performance/{budgets.json,fixtures.json,baseline.ts,tsconfig.json,README.md}`, and `BASE/.../deep-composition-8.ts` lines 1-80 plus its `assembleBlock`/`makeBinding` sites
- `TIP/packages/foldkit/{tsconfig.json,tsconfig.base.json,tsconfig.build.json,tsconfig.docs.json,vitest.config.ts}`, `declaration-tests/tsconfig.{base,accepted,rejected,consumer,binding-intellisense}.json`, `TIP/tsconfig.base.json`, `TIP/scripts/tsconfig.json`, `TIP/scripts/build-public-packages.mjs`, `TIP/scripts/check-circular-deps.sh` (head)
- `BASE/packages/ui/scripts/check-emitted-declarations.ts` (lines 55-300), `BASE/packages/ui/package.json` scripts
- `BASE/scripts/block-type-performance.test.mjs`, `BASE/scripts/run-script-tests.sh`, `BASE/knip.json` (excerpt), `TIP/.oxlintrc.json` (rules and overrides), `BASE/.github/workflows/ci.yml` lines 60-270
- `BASE/packages/foldkit/src/block/{define.ts:140-416, produced.ts, public.ts:84-93, definition.ts:1839-2160, 2200-2600, compositionSafety.test.ts, authoring.test.ts:880-935}`
- `BASE/packages/website/src/{model.ts, definition.ts, page/ui/block.ts, page/ui/definition.ts, update/handleChangedUrl.ts markers}`, `TIP/packages/website/src/{model.ts diff, page/ui/index.ts}`
- `BASE/packages/oxlint-plugin-foldkit/src/rules/{block-name-matches-variable.ts, no-child-message-construction-in-root.ts:880-940}` (grep-level)
- GitHub issue foldkit/foldkit#1737 (`gh issue view`). Gist `producer-safety-fixtures.patch` and `producer-guarded.patch` were read through WebFetch summaries only (a summarizing model, not verbatim). Direct curl download was refused by the sandbox.

## Boundaries

- The declaration gate's `foldkit` resolves to `dist` through package exports, and so do type-performance and the Website (workspace link, `types: ./dist/...`). Only `src/**/*.test.ts` imports source directly (`./define.js`). Any change to `src/block/*.ts` must be followed by `pnpm --filter foldkit build` (or `pnpm build:packages`) before the declaration gate, the perf gate, `test:scripts`, the Website typecheck or the profiler. The gates assert only that dist files exist, not that they are fresh.
- Type-level assertions in `src/block/*.test.ts` are enforced only by `pnpm --filter foldkit typecheck` (`tsc -p tsconfig.json`, which includes src and tests). `vitest.config.ts` has no `typecheck` block, so `vitest run` does not check `expectTypeOf` or `@ts-expect-error`. `tsconfig.build.json` excludes `*.test.ts`.
- The declaration gate (`skipLibCheck: false`, `exactOptionalPropertyTypes`) is stricter than `type-performance/tsconfig.json` (`skipLibCheck: true`, no exactOptional). A produced type that type-checks in the perf harness can still fail in the declaration gate when the emitted `produced.d.ts` is checked.
- The UI gate builds its own isolated foldkit and UI declarations (`tsc -b` into a temp dir), so it does not depend on a fresh `dist`. It is also the only gate that asserts emitted declaration TEXT, a naming-retention check.
- The profiler measures only the Website workload. It cannot be pointed at a fixture without code changes. `packages/foldkit/declaration-tests/**` and `type-performance/**` are outside `workloadGitPaths` and the `workloadHash` set: they are not under `src/` and contain no `.d.ts`. A control fixture placed there would be neither hashed nor dirty-checked.
- The oxlint plugin recognizes completion by the literal member name `assembleBlock` (`no-child-message-construction-in-root.ts:906`, `src/message.ts:216`). A `produceBlock(() => X.assembleBlock(...))` wrapper keeps the inner call. Lint behavior on the wrapper itself was not traced.
- `check:circular-deps` covers only `packages/website/src` and `packages/typing-game/client/src`. The new `ui/block.ts` import of `./definition` is inside its scope.

## Non-Obvious Things

1. **No existing gate exercises `produceBlock`.** In BASE, the only use is `packages/website/src/page/ui/block.ts`. There are no declaration-test fixtures, no `src/block` tests and no type-performance fixture for it. Only `pnpm --filter website typecheck` (and `-r typecheck`) touches it. The issue's published "guarded" patch and its safety fixtures also added nothing to `checks` or `budgets.json`: they lived under `packages/foldkit/experiments/issue-1737-producer/` with private tsconfigs (per the WebFetch summary).
2. **Coverage gaps in the prototype types:**
   - Viewless and OutMessage-only shapes: `ProducedCompositionBlock` (`produced.ts:89-95`) picks `WithViewAndOutMessage` or `WithView` from `OutMessageSchema` only. A viewless `assembleBlock` (`CompletedBlockWithOutMessage` / `CompletedBlockWithoutViewOrOutMessage`) gets `[DefaultViewTypeId]: ProducedMember<..., typeof DefaultViewTypeId>`, which is `InvalidBlockProducer` because the key is absent. That is not assignable to `AnyBlock`'s `[DefaultViewTypeId]?: AnyAuthoredView`. `ProducedBlockWithOutMessage` and `ProducedBlockWithoutViewOrOutMessage` are exported but never selected.
   - A Block from a different Definition: `Model` comes from the Definition's `ModelSchema`, and `owner` / `Model` are never compared with the producer's Block. A producer returning another Definition's Block is accepted, both statically and at runtime (`produce()` is returned unchanged).
   - Accepted fixtures must therefore cover all four shapes. Rejected fixtures need cases for a different-Definition producer (owner and Model mismatch), a `never` producer, a `never` return (for example, `assembleBlock` with missing handlers, which `authoring.test.ts:916-929` shows yields an unusable `erasedBlock`), a non-function producer, and use sites (`makeBinding`, `Program.makeElement`, assignment to `Block.AnyBlock`).
3. **The member inventory is duplicated by hand.** `ProducedBlockFields` (17 keys) must match `BlockContractFields` + `BlockOperations` + `OutMessage` / `[DefaultViewTypeId]` (`definition.ts:1930-2000, 1839-1928, 2038-2160`). Today they match: owner, Model, Message, mounts, [LocalMountsTypeId], bindings, init, update, operations, subscriptions, managedResources, EffectsLayer, [LocalEffectsLayerTypeId], __blockHandlerRequirements, hostHandlers, makeView, replaceEffectsLayer, provideHandlers. Nothing gates drift. A per-shape `Assert<Equal<keyof Produced, keyof Completed>>` and per-member `Assert<Equal<Produced[K], Completed[K]>>` in an accepted fixture would. So would a completion-list check modeled on `assertBindingCompletions` (`check-emitted-declarations.ts:65-111`).
4. **`@ts-expect-error` placement is load-bearing.** The directive suppresses only the next line, and the rejected file must compile with exit 0 twice: against sources and against relocated `.d.ts`. If a mismatch is reported inside the thunk body, or on a property several lines below `produceBlock(`, the directive goes unused (TS2578) and the real error leaks. Precedent: `schema-boundary.rejected.ts` puts the directive inside the `makeUpdate` callback. Also, a rejected fixture can import only modules that the accepted file reaches transitively, because only those get relocated `.d.ts`.
5. **Emitted declarations print the completed type, which hides the benefit.** In a relocated consumer, `typeof ChildBlock.Model` reads an already-printed `.d.ts` type, so the declaration gate proves correctness and portability, not editor cost. For `produceBlock`, the `.d.ts` must print something like `ProducedBlockWithView<typeof Model, () => CompletedBlockWithView<...>>`. That needs the Model Schema and the completed-Block types to be nameable from the fixture module: failure is TS2742/TS4023 under `noEmitOnError`, or a `../` import caught by `assertPortableDeclarations`. Emission output was not run, so its exact shape is unverified.
6. **Full-program budgets cannot show the win.** The README (`type-performance/README.md`, "Source Model Schema boundaries", final paragraph) states that a full-program count does not prove a cheap editor demand boundary, because the producer is still validated. A `produceBlock` perf fixture would measure only the added cost.
   - A NEW fixture requires a `fixtures.json` entry plus a budget from `pnpm update:block-type-performance <name>`; targeted update is allowed only when the TS version matches.
   - The three existing ceilings must not rise, per the issue.
   - The prototype adds a `produceBlock` member to every `AuthoringDefinition`, including those in `baseline.ts` and every fixture. Whether that changes the existing deltas is unmeasured.
7. **README precedent.** Every reviewed type-level change appended a README section with before/after tables for the three fixtures and statements such as "no fixture was narrowed and no rejection test was removed". 9a5f9307 followed that pattern.
8. **`test:scripts` runs a real compiler.** `scripts/block-type-performance.test.mjs` spawns the harness on `deep-composition-8` (baseline plus fixture `tsc`), so it needs a built `dist` and it fails if the perf harness CLI contract changes.
9. **What the profiler sees on BASE.** `hover.first` targets `ApplicationDefinition` in `website/src/definition.ts`. Its `Model` (BASE `model.ts:47`, `uiPages: UiBlock.Model`) is the original completed-Block-Model access path that the prototype changes. On TIP, `model.ts` uses `Ui.Model` (9a5f9307), which masks that path, as the issue warns. No profiler check validates `UiBlock`'s hover or member types; the only hover-text validation is for `SearchBinding`. An erased or `InvalidBlockProducer`-typed `UiBlock` would not fail the profiler, only the typecheck.
10. **Pointing the profiler at a dedicated completed-Block-Model regression/control fixture needs script edits.** The edits would be:
    - a new scenario and labels;
    - new path constants and markers;
    - adding the fixture paths to `workloadGitPaths` and `workloadHash` when they live outside `packages/website` or `**/src/**`;
    - bumping `formatVersion`, since the README says to compare only matching workload settings.

    The fixture must also be in a directory where the native server finds a `tsconfig.json` that includes it. The `declaration-tests/tsconfig.*.json` files are not named `tsconfig.json`, `packages/foldkit/tsconfig.json` includes only `src`, and `type-performance/tsconfig.json` lists only `baseline.ts`. Placing the fixture under `packages/foldkit/src` would ship it in `dist`, because `tsconfig.build.json` excludes only `*.test.ts`. The simplest control is in the Website itself, for example a parent Model field reading `UiBlock.Model` on TIP, which is the "Exact Ui Model dependency ablation" pattern from the issue ledger. That control is inside the existing workload hash.
11. **The runtime guard pattern exists.** `compositionSafety.test.ts` uses `Reflect.apply` to call typed APIs with ill-typed inputs and asserts `toThrow(...)`. A runtime "different Definition" rejection in `produceBlock` (for example, comparing the returned Block's `owner` and `Model` identity to the Definition's) would be tested this way.
12. **Lint and documentation rules for `produced.ts`.**
    - `any` is allowed in `packages/foldkit/src/**`, but `consistent-type-assertions: never` applies there, which explains the existing `/* eslint-disable-next-line ... */` comments in `define.ts`.
    - Public exports need TSDoc (AGENTS.md).
    - `knip` does not check unused exported types.
    - A changeset is required (`pnpm changeset status --since=origin/main` in pre-push).

## End-to-end command list (dependency order)

Costs are rough and were not measured on this host. `[alone]` means do not overlap with builds, watchers (`pnpm dev:libs` rewrites `dist`) or profiling.

1. `pnpm install --frozen-lockfile`: once per checkout.
2. `pnpm build:packages` (`scripts/build-public-packages.mjs`, `pnpm --filter <every public pkg> build`) and `pnpm --filter @typing-game/shared build`. Moderate cost: `tsc -b` per package. Must precede 3-9 and 12. For a foldkit-only edit, `pnpm --filter foldkit build` suffices for 3a, 4 and 5, but the Website and UI need their deps built too.
3. `pnpm check:emitted-declarations`, which is
   - (a) foldkit: 37 checks × 3 `tsc` processes (emit, rejected, relocated consumer), about 111 compiles with `skipLibCheck: false`, plus two TS-API sessions. Minutes-scale.
   - (b) `@foldkit/ui`: two isolated full `tsc -b` builds plus 3 compiles.
   - Uses `os.tmpdir()` mkdtemp, so it is safe to run concurrently with other gates, but not with a build that rewrites `dist`.
4. `pnpm check:block-type-performance`: 4 `tsc --extendedDiagnostics` runs. The README cites about 0.4-1.3 s each, process-cold. Counts are deterministic, so host load does not affect pass/fail.
5. `pnpm typecheck:scripts` (fast) and then `pnpm test:scripts` (`node --test scripts/**/*.test.mjs`, which includes a real perf-harness run).
6. `pnpm --filter foldkit typecheck` (enforces `src/block/*.test.ts` type assertions), then `pnpm --filter website typecheck` (the heavy graph that contains `UiBlock`). Or run `pnpm -r typecheck` for everything.
7. `pnpm lint:ci` (`oxlint` + `lint:applications` + `lint:effect`, which runs `effect-tsgo patch` and then oxlint with `--deny-warnings`). Root `pnpm lint` rebuilds packages first.
8. `pnpm check:dead-code`, `pnpm check:circular-deps`, `pnpm check:effect-prebundle`, `pnpm check:ui-subpath-exports`, `pnpm format:check`.
9. `pnpm --filter foldkit test` (`vitest run --coverage`, with thresholds of 72 statements, 72 branches, 57 functions and 72 lines) and `pnpm --filter website test`. Or `pnpm test` for all; CI notes that two concurrent coverage runs collide, so run them serially.
10. `pnpm changeset status --since=origin/main`. A changeset is needed for a foldkit change.
11. `bash scripts/run-website-e2e.sh`: the last pre-push step. It starts a server, so it must own its port.
12. `node packages/foldkit/scripts/profile-block-language-service.ts --runs N --timeout-ms 30000 > out.json` `[alone]`. Run it after step 2 on an idle host, serially for baseline and candidate, with matching metadata: `formatVersion`, `workloadSha256` inputs, compiler and server. About 5 fresh servers per run, each doing multi-second post-edit requests on BASE.

Shortcut: `pnpm check` (root) runs steps 2 (subset), 3, 4, 5a, 6, 7 and parts of 8 in order. `pnpm pre-push` runs everything except 12.

## Open Questions

- Whether adding `produceBlock` to `AuthoringDefinition` changes the three existing Instantiations or Types deltas, or the baseline. Not measured; it needs `pnpm check:block-type-performance` on BASE vs 65d1cd9c.
- The exact emitted `.d.ts` text for a `produceBlock` export: whether it inlines the completed type, can name it, and passes `assertPortableDeclarations`. Not run.
- Whether the error for a different-Definition or mismatched producer would be reported on the `produceBlock(` line (needed for one `@ts-expect-error`), or inside the thunk. That depends on how a hardened signature constrains `Producer`, which is the design explorers' area.
- The gist safety fixtures were read only through a summarizing fetch, not verbatim. Their exact statements should be re-read before reuse.
- Whether `foldkit/no-child-message-construction-in-root`, or other plugin rules that key on `assembleBlock`, behave identically when the call sits inside a `produceBlock` thunk. Not traced.
- Whether the generic factory path (`makeNamespace` with Concrete=false Definitions, such as Query and Toast) and the UI gate's `Combobox.Completed<...>` text checks need a `produceBlock` variant. Nothing in the gates covers produced generic Blocks today.
