# Cross-judge verdict: hardened `produceBlock` (#1737)

Paths: `SP` is `/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad`. A is `SP/architect/candidate-1`, B is `candidate-2`, C is `candidate-3`.

What I re-ran (TS 7.0.2, no builds):
- A: `probes/tsconfig.json`, `tsconfig.loose.json`, `tsconfig.rejected.json`, `tsconfig.rejected.loose.json` all exit 0 with no output.
- B: `probes/tsconfig.json` gives 21 TS2769 and 2 TS2589 (the expected rejections in `rejected.ts` and `roots.ts`, nothing else); `tsconfig.noexact.json` gives 13 TS2769 and 1 TS2589.
- C: `probes/cand/{tsconfig,tsconfig.loose,tsconfig.rejections,tsconfig.rejections.loose}.json` report errors only inside the copied `fk/src` (`import.meta.hot`), none in the probe files. `deferral/full.eager.ts` gives 6,654,558 instantiations and `full.inline.ts` gives 6,659,493, exactly C's numbers (inline with `NoInfer` is within 0.1% of eager).

## Score table

| # | Criterion | A | B | C |
|---|---|---|---|---|
| 1 | Deferral kept | 5 | 5 | 5 |
| 2 | Shape fidelity | 5 | 4 | 4 |
| 3 | Foreign and invalid producers | 4 | 5 | 5 |
| 4 | One way, no hand-synced lists | 5 | 4 | 5 |
| 5 | Authoring cost and reach | 4 | 4 | 4 |
| 6 | Gate plan | 5 | 5 | 4 |
| | Total | 28 | 27 | 27 |

One-line reasons.

1. Deferral
   - A: `Producer` naked, `.Model` read is 418 to 635 instantiations against 91,108 eager (design.md:215-229, P3); constrained, `Function`, `object` and `NoInfer`-parameter variants were all probed.
   - B: `.Model` read 2,074 against 155,169 (design.md:161-169); a `P & Check<P>` parameter guard was measured eager (155,634, design.md:236).
   - C: `.Model` read 2,741 against 111,394 eager (design.md:216-222); the selector reads only `OutMessageSchema`.
2. Shape fidelity
   - A: six cases A to F (four shapes, `replaceEffectsLayer`, `provideHandlers`) have `Equal<keyof>` and per-member `Equal`, plus `embedView` and Program checks, strict and loose (`probes/accepted.ts`, P1). `KeysAgree` rejects enriched Blocks (sketch.ts, `KeysAgree`). Docs carry through the mapped members (P7).
   - B: shapes, chained and overload probes pass, strict and no-exact (`probes/shapes.ts`, `chained.ts`, `overloads.ts`), and the enrich-after path is probed (`probes/enriched.ts`). Extra producer keys are silently dropped (`ContractKey` is derived from `keyof AnyBlock`, `sketch/produced.ts`), which is the "extras" gap. The non-homomorphic `[Key in ContractKey]` mapped type probably loses member TSDoc; B does not claim to preserve it.
   - C: fidelity tuples are `[true, true, true, true]` for A to F (design.md:208-210). It gets there by changing the assembled Block too (`NoDefaultView` goes from `?: never` to required `undefined`, `definition.ts:1173` in `probes/fk`), so "same as `assembleBlock`" holds against a redefined `assembleBlock`. No `packages/ui` or Website typecheck was run on that edit.
3. Foreign and invalid
   - A: type guard plus a rejected-case probe with 16 `@ts-expect-error` lines used (P2), error locations in the Usage table (design.md:60-71), and a limits row for same-type and shared-namespace Definitions. The runtime token is "inferred, not executed" (design.md:244).
   - B: type guard and a runtime mark, both exercised. `runtime.mjs` has 15 cases, and `probes/mutation-results.txt` shows the mark and view-check mutations failing 4 and 1 cases. Limits stated (design.md:237).
   - C: type guard plus `runtime.mjs` with 12 cases, including same id twice and a shared-namespace sibling (design.md:240-244). The TS2589 on a foreign Program root is accepted and stated.
4. One way
   - A: members derived from the contract template (design.md:86), so no hand list; `produce-exported-block` lint closes the second way for `assembleBlock`; the Website reverts to `UiBlock.Model` and the barrel `Model` re-export is deleted (design.md:125-126).
   - B: members derived from `keyof AnyBlock`, with a four-name exclusion list; the lint closes `assembleBlock`. But `Ui.Model` is kept as "valid organization guidance" (design.md:180), which leaves two ways to get a child Model.
   - C: derived from `keyof CompletedBlockWithViewAndOutMessage` (design.md:92); one entry point; the barrel re-export is dropped (design.md:137).
5. Authoring cost and reach
   - A: one extra `const` per site plus a mandatory lint rule and a view-method choice; codemod described, not written; Composition-only factories left alone with a restructure path whose fidelity is unproven (P10).
   - B: same ceremony; a codemod file is named (`codemod-produce-block.ts`); the factory pattern with a function-type producer is probed (281 against 83,013 instantiations, design.md:92); wave plan is concrete.
   - C: smallest ceremony (the `() =>` wrapper, one method, no classification, no perf lint); Composition-only factories explicitly unchanged, with only a follow-up sentence (design.md:138).
6. Gate plan
   - A: `produced-block` entry with an emitted-text assertion and a stated mutation check, a perf fixture that fails on an inline producer, oxlint tests, and a three-arm benchmark with Website `tsc --extendedDiagnostics` and `UiBlock.Model` kept in the workload (design.md:181-194).
   - B: fixtures actually written and run through the gate's three compiles (`sketch/fixtures/relocate.sh`), nine-row executed mutation table (design.md:200-212), perf fixture, two profiler pairs.
   - C: good fixture list and a perf fixture that is the `NoInfer` mutation check (643k against 1.40M), but relocation, `skipLibCheck: false`, the real budgets and the UI text gate are all "not run" (design.md:248-256).

## The new evidence: inline-thunk cost

`SP/measure-forms.md` says the cost is the arrow's contextual return type, a named producer matches eager (25.77M against 25.86M), and a block-bodied thunk also matches.

- A and B both answer with a named producer, enforced by lint, and both measured the toy cost independently. That answer is backed by the real Website measurement (named is 25.77M, eager is 25.86M). A's hypothesis for the cause ("the arrow's own pending return type", design.md:166) matches measure-forms item 5. B's stated cause is wrong (see below).
- C answers structurally: `NoInfer` on every `assembleBlock` return type (14 signatures, `probes/fk/src/block/definition.ts` diff) plus the two chained returns. I reproduced inline at 6,659,493 against eager 6,654,558. It is consistent with the measured mechanism, because `NoInfer` removes return-type inference from the contextual type. It also needs no lint, and `NoInfer` return types have precedent (`block/fieldStep.ts:34`, `update/update.ts:905`). It has not been measured on the Website, and it widens the blast radius to every `assembleBlock` call and every emitted `.d.ts`.
- Neither A nor B tried `NoInfer` on `assembleBlock`'s return (A tried a trailing `NoInfer` parameter, which does not help, P3).

## Strongest ideas and weakest points

### Candidate A

Strongest:
1. `ProducedCompletion<Expectation, Producer>` is a single cached alias that returns `readonly [Completed]` or one `InvalidBlockProducer<Reason, Evidence>` interface (sketch.ts, `ProducedCompletion` and `CompletionOf`). The reason and the evidence type print in the diagnostic (P2), and `KeysAgree` turns the prototype's silent member drop into a named error.
2. Runtime token reuses the existing `authoring` object: `assembleBlock` registers `producingDefinitions.set(block, authoring)`, `makeBaseDefinition` owns the method, and the `makeNamespace` closure is deleted (design.md:103). One writer, one reader, no signature threading. C's executed `runtime.mjs` uses the same mechanism, which supports it.

Weakest:
1. The token is never executed (design.md:244, 270), yet the constraint list marks 21 to 23 as Handled. The gate is also described, not built: the probes are not in `declaration-tests` form and were not relocated.
2. The ceremony burden sits on a lint rule (`named-block-producer`). A block-bodied thunk that returns the call is also slow, so the rule has to separate "const then return" from "return the call". An agent that collapses the arrow gets no type error. The "8.4x" figure used to justify the rule is a toy ratio (see below).

### Candidate B

Strongest:
1. The most executed evidence of the three. `sketch/produced.ts` compiles, `sketch/fixtures/` pass the gate's three compiles, and a nine-row mutation table plus a runtime harness with two mutation rows were run (design.md:200-212, `probes/mutation-results.txt`).
2. A factory story with numbers: a public `Completed<Item>` written over a producer function type costs 281 instantiations against 83,013 for the interface that extends the completed Block (design.md:78-92, `probes/factory/`). It is the only candidate that moves the 8 `makeBlockParts` factories forward.

Weakest:
1. The explanation of the inline cost is wrong. design.md:171 says "the cost sits in inferring a naked `Producer` from an arrow expression"; measure-forms item 4 shows an explicit type argument (no inference) costs the same. The remedy still works, but the stated cause would mislead anyone looking for a type-level fix.
2. Two ways to get a child Model remain (`Ui.Model` kept as guidance, design.md:180), and extra keys are dropped silently, not rejected. The `SameType` identity trick is not protected by any gate: B's own mutation row "mutual assignability for SameType" yields `[]` in `sketch/fixtures/mutation-results.txt:9`, so no fixture fails when it is reverted (the design admits it could not build one, design.md:263).

### Candidate C

Strongest:
1. The only design that fixes the inline cost in the types and keeps a single entry point. Reproduced: inline with `NoInfer` is 6,659,493 against eager 6,654,558; `produced-composition-8` is 643,309 with `NoInfer` and 1,399,481 without, so the fixture doubles as the mutation check.
2. Viewless fidelity falls out of the member type instead of a method name or flag, so no site is classified and no mismatch class exists (design.md:97). The prototype version of that file fails FidelityB and FidelityD (design.md:210).

Weakest:
1. It edits the shared completed Block contract and 14 `assembleBlock`/chain signatures without running a `packages/ui` or Website typecheck, the real perf budgets, relocation, or `skipLibCheck: false` (design.md:187-188, 248-256). A failure there would block the whole feature, not only produced Blocks.
2. Composition-only factories get a sentence (design.md:138), and `ProducedBlockWith*` public types are hand-writable. The type-level owner and Model comparison is mutual assignability, which B reports can answer "maybe" for Schema types (unreproduced, see below).

## Recommended base: Candidate A

Reason: highest rubric total (28), the cleanest ownership story (one writer and one reader of the token, derived members, extras rejected, one way to get a child Model), and the only plan that measures the Website directly in three arms. It keeps the completed Block contract untouched, which is why a two-method surface is the safer base than C's contract edit. The named-producer remedy is the one backed by a real Website measurement.

A's gaps are all fillable from the other two: an executed gate and mutation harness (B), an executed runtime probe of the same token (C), and the `NoInfer` experiment (C). B is a close second and would be a reasonable base if executed evidence is weighted above design completeness. C would become the base only if the Website measurement of `NoInfer` comes back flat and the UI and Website typechecks pass with the `undefined` view member.

## Grafts into A

From B:
- `sketch/fixtures/` (accepted, byte-identical consumer, rejected, definitions) plus `relocate.sh` and `mutation.sh`, so A's `produced-block` entry ships with an executed gate and a mutation table.
- `probes/runtime.mjs` and its mutation rows, as the template for A's `produceBlock.test.ts`.
- The factory pattern (`Completed<Item>` over a function-type producer, `probes/factory/`) as the answer for Composition-only reach, replacing A's unproven restructure.
- The wave plan and named codemod (`codemod-produce-block.ts`, `no-exported-assembled-block`).
- Pinned-message assertions in the accepted fixture.

From C:
- `NoInfer` on `assembleBlock`'s return types as a measured pre-implementation experiment on the real Website (`UiBlock`, three arms from A's benchmark). If it holds, make the inline arrow legal and demote `named-block-producer` to optional, since the type system then enforces what the lint only advises.
- `probes/runtime/runtime.mjs` (12 cases against patched dist), which exercises A's `authoring`-object token.
- The `produced-composition-8` fixture design, where removing `NoInfer` moves the count from 643k to 1.40M, as a pattern for A's mutation check.

Not worth grafting: C's `undefined` view member (it forces a contract edit that A avoids) and B's mark threaded through `define`, `makeBaseDefinition` and `makeDefinition` (A's `authoring` token is smaller).

## Claims checked and found false or unsupported

- B design.md:171, "the cost sits in inferring a naked `Producer`": false for the Website per measure-forms item 4 (explicit `produceBlock<typeof assembleUiBlock>` costs as much as inline, so the contextual return type is the cause, not `Producer` inference). B admits it did not establish the mechanism; the sentence still states one.
- B design.md:143 and 252, mutual assignability produced a false accept in one layout: not reproduced, and B's own mutation of `SameType` to mutual assignability fails no gate (`sketch/fixtures/mutation-results.txt:9`). Treat as an unverified risk to A and C, not a finding, and do not rely on identity comparison being gate-protected.
- A design.md:9 and 148, "about 8.4 times", B "about 7 times", C "about 6x": these are toy-Block ratios of the producer's typing cost. On the real Website measure-forms gives 1.085x instantiations (25.86M to 28.07M) and about +1 s. The direction is confirmed; the magnitude should not be quoted for the Website.
- A constraint coverage 21 to 22 "Handled": the token registration is inferred and never executed in A's probes (design.md:244); only C's and B's runtime probes execute the same mechanism.
- C design.md:105, "Removing it changes cost, not results": probed on toy Blocks and the six shape cases only. Not checked against `packages/ui` factories (`makeBlockParts`, where `NoInfer<generic>` stays an unresolved substitution type) or the Website, so it is unsupported for generic Composition-only code.
- C design.md:97, "`DefaultViewTypeId` is `@internal` and nothing outside `packages/foldkit/src/block` names it": consistent with a grep of foldkit `src`, but I did not confirm it for `packages/ui/src`.
- B design.md:175 and A open question 2, Website numbers for a named producer: measure-forms has now supplied the full-program number (named equals eager); the editor-latency number for a named producer is still unmeasured by any candidate.
