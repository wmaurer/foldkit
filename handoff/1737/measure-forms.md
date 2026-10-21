# UiBlock producer forms: Website full-program cost

Worktree `wt-measure`, branch `wm/1737-measure-forms`, commit d8626087d (baseline 65d1cd9c plus prototype `produceBlock`). After `pnpm install --frozen-lockfile` and `pnpm build:packages`, the built `packages/foldkit/dist/block/define.d.ts` and `produced.d.ts` contain `produceBlock`. The shared `.git/hooks` listing (names, sizes, mtimes) was identical before and after install.

Compiler: `Version 7.0.2` (`pnpm exec tsc --version` in `packages/website`).

Machine: 22 cores, load average 3.45 at start. Variants ran one after another, interleaved per round (eager, inline, named, then repeat), never in parallel.

## Variants of `packages/website/src/page/ui/block.ts`

1. Eager. `git show 65d1cd9c:packages/website/src/page/ui/block.ts`.
2. Inline thunk. The committed prototype, `UiDefinition.produceBlock(() => UiComposition.assembleBlock({ init, update, view }))`.
3. Named producer. `const assembleUiBlock = () => UiComposition.assembleBlock({ init, update, view })` and `export const UiBlock = UiDefinition.produceBlock(assembleUiBlock)`.

Every run of every variant exited 0 with 0 `error TS` lines.

## Results, medians of 3 runs

Default mode (as requested, `pnpm exec tsc --noEmit --extendedDiagnostics`). This mode runs several checkers, and each checker counts its own types and instantiations, so these counts include cross-checker duplication.

| Variant | Instantiations | Types | Check time |
| --- | ---: | ---: | ---: |
| Eager | 82,641,983 | 2,215,391 | 8.792 s |
| Inline thunk | 92,617,657 | 2,604,262 | 10.016 s |
| Named producer | 82,458,419 | 2,215,639 | 8.686 s |

Single-threaded (`pnpm exec tsc --noEmit --extendedDiagnostics --singleThreaded`). One checker, so these are the program's own counts.

| Variant | Instantiations | Types | Check time |
| --- | ---: | ---: | ---: |
| Eager | 25,864,258 | 680,820 | 8.818 s |
| Inline thunk | 28,065,776 | 769,970 | 9.815 s |
| Named producer | 25,766,136 | 680,882 | 8.906 s |

Inline against eager, single-threaded: +2.20M instantiations (1.085x), +89,150 types (1.131x), about +1.0 s check time. Default mode: 1.121x instantiations, about +1.2 s. Named against eager: within run-to-run noise on every metric.

Counts were not identical across runs. Instantiations varied by up to about 58k per variant (0.2%), in both modes, including single-threaded. Types were identical within a variant except one default-mode inline run (2,604,252 against 2,604,262) and one default-mode named run (2,215,633 against 2,215,639). The inline gap (2.2M single-threaded) is about 38 times that spread.

Raw outputs are in `scratchpad/mf/out/` (`<variant>-<round>.txt` and `st-<variant>-<round>.txt`). The runner is `scratchpad/mf/run.sh`, the variant sources are `scratchpad/mf/{eager,inline,named}.ts`.

## Verdict on the claim

The 8.4x figure does not carry over to the Website as a program-level ratio. The direction does. The committed inline form costs the Website about 2.2M extra instantiations (+8.5%), 89k extra types (+13%) and about 1 s of check time (+11%) on every full typecheck. The named producer costs the same as the eager export. So the prototype as committed slows full typechecks, and the slowdown comes from the inline thunk form, not from `produceBlock` itself.

## Cause analysis

Traces: `pnpm exec tsc --noEmit --singleThreaded --generateTrace <dir>`, summarized by `scratchpad/mf/tools/summarize.mjs` and `scratchpad/mf/tools/file-events.mjs`. Trace directories are `scratchpad/mf/trace-{inline,named,inlineblock,explicit}`.

1. Measured. The extra time sits in `page/ui/block.ts` itself. In the inline trace, `checkDeferredNode` on the arrow takes 2,010.6 ms. In the named trace, the deferred check of the producer arrow takes 650.4 ms. No other hot event differs by more than about 100 ms between the two traces (single trace each, so those smaller differences are unconfirmed). Because the cost lands on the deferred check of the arrow at its definition, a full typecheck pays it whether or not anything reads a non-`Model` member.
2. Measured. Inside that 2,010 ms inline check, the `assembleBlock(...)` call expression is checked twice. The outer check (2,010.5 ms) contains a nested check of the same call (595.3 ms) starting 28 ms in, and the argument object literal is checked two more times late in the outer check (at 1,491 ms and 1,984 ms). The named producer's call is checked once (650.4 ms).
3. Measured. A block-bodied inline thunk, `produceBlock(() => { const block = UiComposition.assembleBlock({...}); return block })`, matches the named producer exactly: 680,882 types, 25,766,136 median instantiations, deferred check 591.6 ms (3 single-threaded runs, 3 default runs, 0 errors). Putting the call in an unannotated `const` initializer removes its contextual type. So the extra cost needs the call to sit in a contextually typed return position.
4. Measured. Passing the type argument explicitly, `produceBlock<typeof assembleUiBlock>(() => UiComposition.assembleBlock({...}))`, costs the same as the inline thunk: 769,972 types, 28,123,971 median instantiations, outer call check 1,988.6 ms with a nested 616.2 ms check of the named producer's body. No `Producer` inference happens there, so `Producer` inference is not the cause. The contextual return type is.
5. Inferred from 2 to 4. In the inline form `Producer` is inferred as the arrow's own type. When the arrow body is checked, its contextual return type is therefore the return type of that same arrow, which is the completed Block. Getting that type checks the call once without context (the nested ~600 ms check). The compiler then resolves `assembleBlock` again with the completed Block as a contextual return type, and that second resolution costs about 1.4 s and 2.2M instantiations.
6. Guessed. The 1.4 s is return-type inference from that contextual type into `assembleBlock`'s type parameters, plus re-checking the arguments against the instantiated signature (the two late object-literal checks). The hottest `structuredTypeRelatedTo` entries were not broken down, so which relation dominates is unconfirmed.
