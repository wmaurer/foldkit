# produceBlock PR shape on the integration tip

Branch `wm/1737-produce-block-pr` in SP/wt-pr. Base 9a5f9307c (tip of `codex/preview-followups`). Head 20f29c483. Nothing pushed, no PR opened. Every commit is authored by Wayne Maurer <wmaurer@users.noreply.github.com> with no AI attribution lines.

## Commits (oldest first)

### 90452b21a feat(foldkit): type produced Blocks from one producer verdict

Author: Wayne Maurer <wmaurer@users.noreply.github.com>


packages/foldkit/src/block/define.ts
packages/foldkit/src/block/definition.ts
packages/foldkit/src/block/produced.ts
packages/foldkit/src/block/public.ts
### 5f8a67db3 feat(foldkit): verify the producing Definition at runtime

Author: Wayne Maurer <wmaurer@users.noreply.github.com>


packages/foldkit/src/block/define.ts
packages/foldkit/src/block/definition.ts
packages/foldkit/src/block/produceBlock.test.ts
### 3b1814406 test(foldkit): check produced Block declarations

Author: Wayne Maurer <wmaurer@users.noreply.github.com>


packages/foldkit/declaration-tests/produced-block-block.ts
packages/foldkit/declaration-tests/produced-block-definition.ts
packages/foldkit/declaration-tests/produced-block-equality.ts
packages/foldkit/declaration-tests/produced-block-invalid.ts
packages/foldkit/declaration-tests/produced-block.accepted.ts
packages/foldkit/declaration-tests/produced-block.consume.ts
packages/foldkit/declaration-tests/produced-block.rejected.ts
packages/foldkit/scripts/check-emitted-declarations.ts
### f2d2d307c test(foldkit): budget produced Block composition

Author: Wayne Maurer <wmaurer@users.noreply.github.com>


packages/foldkit/type-performance/README.md
packages/foldkit/type-performance/budgets.json
packages/foldkit/type-performance/fixtures.json
packages/foldkit/type-performance/produced-composition-8.ts
### 5b3e0104f refactor(website): produce the Ui Block from a named producer

Author: Wayne Maurer <wmaurer@users.noreply.github.com>


packages/website/src/page/ui/block.ts
### ccb169c8c docs(foldkit): clarify the produceBlock producer guidance

Author: Wayne Maurer <wmaurer@users.noreply.github.com>


packages/foldkit/src/block/define.ts
### b1b44fa08 chore(foldkit): add the produceBlock changeset

Author: Wayne Maurer <wmaurer@users.noreply.github.com>


.changeset/definition-produce-block.md
### 33fc89bc2 refactor(website): read the Ui Model from the produced UiBlock

Author: Wayne Maurer <wmaurer@users.noreply.github.com>


packages/foldkit/type-performance/README.md
packages/website/src/model.ts
packages/website/src/page/ui/index.ts
### 20f29c483 docs(website): name produceBlock in the Model Schema guidance

Author: Wayne Maurer <wmaurer@users.noreply.github.com>


packages/website/src/page/projectOrganization.md

## How the series was built and conflicts resolved

- 90452b21a folds d8626087d (wip prototype) and 687654246 into one commit with 687654246's message. The prototype's change to `packages/website/src/page/ui/block.ts` (inline producer) was left out of this commit, so the `feat(foldkit)` commit touches only `packages/foldkit/src/block/`. The Website's whole Ui conversion lands in 5b3e0104f instead. No other content changed: `git diff e44e4e2ba HEAD -- <series files>` shows only the tip's own additions (the `schema-boundary` checks entry and the README's Source Model Schema section).
- `packages/foldkit/scripts/check-emitted-declarations.ts` (455235ca0): merged without conflict. The `checks` array holds both `schema-boundary` (line 666) and `produced-block` (line 690); the gate loop at line 732 runs every entry.
- `packages/foldkit/type-performance/README.md` (388cd9755): conflict at the end of the file. Both sides appended a section. Kept both, tip's "Source Model Schema boundaries" first, then "Produced Block boundaries".
- 5b3e0104f (from 6023a674f): block.ts on the tip equals the 65d1 base, so the commit applies the final named-producer file directly. Its message dropped the sentence "model.ts reads UiBlock.Model", which is false on the tip until 33fc89bc2. The replacement sentence says UiBlock's owner, Model, and OutMessage come from UiDefinition.
- 33fc89bc2 (new, step 2): `refactor(website):` without `!`. Only the private Website changes, so no consumer code has to change. `model.ts` imports `{ UiBlock } from './page/ui'` and declares `uiPages: UiBlock.Model`. `page/ui/index.ts` drops `export { Model } from './model'`; a grep found no other importer of the Ui barrel's Model (`page/index.ts` re-exports only `UiBlock`). The other nine feature barrels keep their re-exports. The commit also fixes the tip's README sentence that named `Ui.Model`/`UiBlock` as the Schema-export example (now `Home.Model`/`HomeBlock`, which still has the re-export) and adds one sentence to the Produced Block section noting `uiPages` reads `UiBlock.Model`.
- 20f29c483 (new, step 3): `docs(website):` adds two sentences to `packages/website/src/page/projectOrganization.md` under "Keep Model Schema dependencies small": a Block published with `ProductsDefinition.produceBlock(assembleProductsBlock)` takes `ProductsBlock.Model` from the Definition and needs no separate `Model` export, and the producer should be named. AGENTS.md and the skills were left unchanged; their tip guidance describes the optional `Model` re-export and stays true. The added lines contain no em dashes.

## Setup

- `pnpm install --frozen-lockfile`: 0
- `pnpm build:packages`: 0
- Shared `.git/hooks`: unchanged before and after (md5 match). Non-sample hooks are commit-msg and pre-push, both dated 2026-09-01.

## Gates at head 20f29c483 (logs in SP/pr/gates/)

| gate | exit |
|---|---|
| `pnpm -F foldkit build` | 0 |
| `pnpm -F foldkit typecheck` | 0 |
| `pnpm -F foldkit test` (181 files, 3,582 passed, 1 skipped) | 0 |
| `pnpm check:emitted-declarations` (foldkit and ui; both `schema-boundary` and `produced-block` in the checks array) | 0 |
| `pnpm check:block-type-performance` | 0 |
| Website typecheck | 0 |
| `pnpm -r typecheck`, first run | 1 |
| `pnpm -r typecheck`, rerun | 0 |
| `pnpm format:check` | 0 |
| `pnpm lint` | 1 |

Block type performance: deep-composition-8 882,807 / 1,152,618; wide-composition-100 1,961,932 / 3,132,298; command-requirements-200 910,863 / 2,659,415; produced-composition-8 622,271 / 625,053 instantiations. All ok.

The first `pnpm -r typecheck` failed only in `packages/typing-game/server`, with `TS2307: Cannot find module '@typing-game/shared'` and the `unknown` errors that follow from it. `@typing-game/shared` resolves to `./dist/index.js`, and `build:packages` does not build it. `pnpm lint` builds it (`pnpm --filter @typing-game/shared build`); its dist is timestamped 15:36:19, after the typecheck ran. The rerun after that build exits 0 with no TS errors. This is workspace setup ordering, not the branch, which does not touch typing-game.

## Lint

`pnpm lint` reports exactly the three errors seen on the 65d1 base, all in files this branch does not change:

- `packages/foldkit/declaration-tests/commands-steps.rejected.ts:48:7` no-unused-vars (`outMessageStep`)
- `packages/ui/declaration-tests/generic-composition.accepted.ts:283:14` foldkit(block-name-matches-variable)
- `packages/ui/declaration-tests/generic-composition.rejected.ts:10:3` sort-imports

No lint error lands in a file changed between 9a5f9307c and the head.

## Per-commit replay (logs in SP/pr/replay/)

| commit | foldkit build | foldkit typecheck | Website typecheck |
|---|---|---|---|
| 90452b21a | 0 | 0 | not a website commit |
| 5f8a67db3 | 0 | 0 | not a website commit |
| 3b1814406 | 0 | 0 | not a website commit |
| f2d2d307c | 0 | 0 | not a website commit |
| 5b3e0104f | 0 | 0 | 0 |
| ccb169c8c | 0 | 0 | not a website commit |
| b1b44fa08 | 0 | 0 | not a website commit |
| 33fc89bc2 | 0 | 0 | 0 |
| 20f29c483 | 0 | 0 | 0 |

The worktree is back on `wm/1737-produce-block-pr` at 20f29c483 with a clean tree.

## Blockers for a draft PR

None in the code or gates. Two process items remain before merge-ready, both open on purpose here:

- AGENTS.md requires a separate agent to review the exact committed diff before push. No review of this series has run.
- The three pre-existing lint errors make `pnpm lint` exit 1 on the base too. They are not this branch's, but CI will be red on lint until the base fixes them.

The deviations in SP/impl/deviations.md still apply (named producer instead of inline plus NoInfer, the `named-block-producer` lint rule as a follow-up, the 625,053 ceiling chosen from nondeterministic TS 7.0.2 counts).
