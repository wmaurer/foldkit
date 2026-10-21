# Implementation report (relayed from the implementation agent's hand-back; its own write was refused)

Branch wm/1737-produce-block, head e44e4e2ba, 7 commits on d8626087d:
- 687654246 feat(foldkit): type produced Blocks from one producer verdict
- fa51ac44a feat(foldkit): verify the producing Definition at runtime
- 455235ca0 test(foldkit): check produced Block declarations
- 388cd9755 test(foldkit): budget produced Block composition
- 6023a674f refactor(website): produce the Ui Block from a named producer
- 8d9271920 docs(foldkit): clarify the produceBlock producer guidance
- e44e4e2ba chore(foldkit): add the produceBlock changeset

NoInfer (unit 1): not adopted. Website full check, median of 3, --singleThreaded, 0 errors in every arm:

| arm | instantiations | check time |
|---|---|---|
| prototype inline | 28,123,937 | 9.64s |
| inline + NoInfer | 26,065,473 | 8.57s |
| eager + NoInfer | 25,864,364 | 8.62s |
| named + NoInfer | 25,766,305 | 8.59s |
| named, no NoInfer | 25,766,136 | 8.62s |
| eager, no NoInfer | 25,864,258 | 8.61s |

Inline + NoInfer is 0.78% above eager + NoInfer, outside the 0.5% rule. Patch kept at impl/noinfer.patch; harness impl/tools/measure-website.sh; raw runs impl/measure/.

Final Website check with the named producer: 25,851,189 instantiations, 0 errors.

Gates (logs in impl/gates/), exit 0: foldkit build, typecheck, test (181 files, 3,582 tests), lint:applications, lint:effect, check:emitted-declarations, check:block-type-performance, Website typecheck, pnpm -r typecheck, format:check, typecheck:scripts, test:scripts.
`pnpm lint` exits 1 on three files untouched since 65d1cd9c (checked with git diff): commands-steps.rejected.ts:48, ui generic-composition.accepted.ts:283, ui generic-composition.rejected.ts:10.

Perf: existing fixtures 877,971 -> 877,971; 1,961,798 -> 1,961,932; 910,997 -> 911,507 (budgets unchanged). New produced-composition-8 ceiling 625,053 (highest of 22 runs; TS 7.0.2 counts vary run to run). One inline producer in it gives 1,253,018 and fails the gate.

Mutation checks of the declaration gate: owner check removed fails accepted.ts:134; view check removed fails :188 and :194; parameter check relaxed fails :164; logs impl/mutation-results.txt, impl/mutation-emitted.log. Runtime: disabling the token comparison fails 3 tests.

Website probes: `view: init` errors at block.ts(11,5); assigning 5 to typeof UiBlock.Model.Type gives TS2322.

Deviations: impl/deviations.md (10 items). Left undone: named-block-producer lint, oxlint recognition, docs and snippet, codemod and migration, LSP benchmark, independent commit review, possibly unexport ViewPresence.
