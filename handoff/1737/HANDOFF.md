# Handoff: produceBlock for foldkit/foldkit#1737

This is a temporary handoff branch on the `wmaurer` remote. It is not for review or merge.

## Branch layout

- `wm/1737-produce-block-handoff` is the PR-ready series (9 commits on `9a5f9307c`, the tip of `codex/preview-followups`) plus `chore` commits on top that only touch this `handoff/1737/` folder.
- The PR-ready series ends at `20f29c483`, which was also pushed as `wm/1737-produce-block-pr`. Use that branch directly, or recreate it with `git branch wm/1737-produce-block-pr 20f29c483`.
- The measurement series on the slow baseline `65d1cd9c` is in `measurement-branch/` as patches. To recreate it, first copy the patches out of the tree, because switching away from this branch removes `handoff/`: `cp -r handoff/1737/measurement-branch /tmp/1737-patches`. Then fetch the base with `git fetch origin 65d1cd9c3031fa69ca23e5c2de7c31fd7371d5c7` and run `git switch -c wm/1737-produce-block 65d1cd9c3031fa69ca23e5c2de7c31fd7371d5c7 && git am /tmp/1737-patches/*.patch`. Use it to benchmark the original slow path, because on the integration tip the Schema re-export workaround hides that path.

## Starting a new session

Point the agent at this file first. The artifacts were written in a scratchpad on another machine. Any absolute path that ends in `.../scratchpad/<path>` corresponds to `handoff/1737/<path>` here. The worktrees named in older notes map to branches:
- `wt-pr` is `wm/1737-produce-block-pr`;
- `wt-impl` is the measurement series;
- `wt-base` is its first patch, the prototype;
- `wt-tip` is `9a5f9307c`.

Setup on a fresh checkout: `pnpm install --frozen-lockfile`, then `pnpm build:packages`. Never overlap a build with a benchmark or with a gate that reads `dist`, and rebuild before each. The gates do not check `dist` freshness.

## What the change is

`Definition.produceBlock(assembleXBlock)` and `Definition.produceViewlessBlock(assembleXBlock)`.
- The producer is a named, zero-argument function returning the `assembleBlock` result.
- `owner`, `Model`, and `OutMessage` come straight from the Definition, so a parent reading `XBlock.Model` does not type the assembly.
- Every other member is read from the producer through one cached verdict. The verdict rejects a foreign owner or Model, an OutMessage or view mismatch, `never`, `any`, non-functions, producers with parameters, and enriched Blocks. Those errors land at the first consumer, not at the call.
- At runtime, `assembleBlock` records its Definition in a WeakMap. The produce methods throw on a mismatch and return the identical Block.
- Only the Website's `UiBlock` is migrated.

Design record: [architect/synthesis.md](architect/synthesis.md), [architect/judge.md](architect/judge.md), and [how/grounding.md](how/grounding.md), which lists 39 constraints. The three candidate designs are in `architect/candidate-*/design.md`.

## Verified on the original machine

Native TS 7.0.2 language-server benchmark, median of 3 fresh sessions, run serially on an idle host. `changedUrl.hover.postWhitespace`:
- 2990ms on baseline 65d1cd9c ([baseline.json](baseline.json));
- 1381ms on the hardened measurement series ([impl/benchmark.json](impl/benchmark.json));
- 624ms on the PR head against 623ms for tip 9a5f9307 with its Schema re-export ([pr/bench-head.json](pr/bench-head.json), [pr/bench-tip.json](pr/bench-tip.json)).

Full Website typecheck: an inline producer adds 2.2M instantiations (+8.5%) and about 1s, and a named producer adds nothing ([measure-forms.md](measure-forms.md)). `NoInfer` on `assembleBlock` returns missed the pre-set 0.5% rule at 0.78% and was not adopted ([impl/noinfer.md](impl/noinfer.md)).

Gates at the PR head exit 0:
- foldkit build, typecheck, and test;
- check:emitted-declarations and check:block-type-performance;
- the Website typecheck, `pnpm -r typecheck`, and format:check.

`pnpm lint` exits 1 on three files the series never touches. The handoff push skipped the pre-push hook at the user's request. Reports: [impl/report.md](impl/report.md), [impl/deviations.md](impl/deviations.md), [pr/report.md](pr/report.md).

## Trail

[decisions.tsv](decisions.tsv) is the decision log, with one row per decision. [todo.md](todo.md) holds the Feature playbook steps. [trail-review.md](trail-review.md) is a cross-model review of the trail with 11 flags. Flag 1, no benchmark on the tip, was closed by the paired run above.

## Limits of this handoff

- Timings are tied to the original machine. Compare a new measurement only against a baseline measured on the same machine. On a new machine, rerun the benchmark at `65d1cd9c` (the measurement branch's base) or at `9a5f9307c` before you compare against anything here. The repository's own harness, `node packages/foldkit/scripts/profile-block-language-service.ts --runs 3 --timeout-ms 30000`, runs anywhere. Run it alone, after a fresh `pnpm build:packages`.
- Instantiation counts carry over, because they do not depend on the machine. TS 7.0.2 still varies them slightly between runs (see `impl/deviations.md`).
- Probe and helper scripts hard-code paths from the original machine. Examples are `impl/tools/measure-website.sh`, `impl/tools/mutate-gate.sh`, the candidate probes, and their `tsconfig` files. Before rerunning one, replace the `.../scratchpad` prefix with `handoff/1737`, and replace worktree paths with checkouts of the branches above. `repro/measure.mjs` and `repro/lsp.mjs` take the compiler path and directory as arguments, so they run as is.
- Compiler traces from the inline-producer cause analysis (1.2GB) are not included. `measure-forms.md` records the commands that regenerate them.
- The session and subagent transcripts are not included. `trail-review.md` is the record of the trail audit against them.
- The user's working preferences for this task:
  - work through pstack, delegating to subagents;
  - prototype before posting anything;
  - post on the issue or open a PR only after review and with the user's go-ahead.

## Next steps

1. Review the PR series `9a5f9307c..wm/1737-produce-block-pr`. AGENTS.md requires a separate agent's review of the exact committed diff before pushing to `origin` or opening a PR, and the Feature playbook calls for `interrogate`. Points to put to the reviewers:
   - The changeset says an inline producer costs "several times the checking work". The Website measured 1.085x overall, so reword it.
   - The `produced-composition-8` budget (625,053) is the highest of 22 runs and has no headroom against TS 7 count nondeterminism.
   - Runtime style: the WeakMap lookup uses an `undefined` sentinel, and view presence is a boolean flag.
   - Two methods plus a named producer are more ceremony than a single inline call. The named-producer lint is deferred, so only the perf fixture guards against inline producers.
   - Mutual assignability, not identity, compares owner and Model. One design candidate reported a false accept that the judge could not reproduce.
2. Run `pnpm lint` at `9a5f9307c` to confirm its three failures exist there. Otherwise they would turn the draft PR's CI red.
3. After review, and only with the user's go-ahead, post the findings on #1737 and open a draft PR against `codex/preview-followups`. Build the PR from `wm/1737-produce-block-pr`, never from this handoff branch.
