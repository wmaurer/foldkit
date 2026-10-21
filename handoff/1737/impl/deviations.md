# Accepted deviations from the design

1. **Authoring form is the named producer, not inline plus `NoInfer`.** The pre-committed rule (inline + NoInfer within 0.5% of eager + NoInfer) failed at 0.78%, so NoInfer was reverted and never committed. See `impl/noinfer.md`. The `foldkit/named-block-producer` lint rule stays a follow-up, as the synthesis says for this outcome.

2. **`produced-composition-8` ceiling is 625,053, not the value `update` wrote (622,271).** TypeScript 7.0.2 reports different instantiation counts for the same input across runs, with or without `--singleThreaded` (measured: totals 624,112 / 624,262 / 626,894 for this fixture; baseline stable at 1,841). The exact `update` value failed the gate on 3 of 3 following runs. The ceiling is the highest of three discrete states seen in 22 runs. Types never varied. The README section records this. The harness README's claim that the counts are deterministic is false at this granularity; the three older ceilings pass only because they have 25% or more headroom.

3. **Two runtime messages instead of one for a wrong producer result.** A value that `assembleBlock` never registered gets "received a value that is not a completed Block"; a Block registered by another Definition gets "received a Block assembled from a different Definition". The design had one message for both.

4. **Runtime does not check producer arity.** This follows candidate 1's error table (parameters are a type error only). The runtime test asserts the producer is called once with no arguments instead of asserting that a one-parameter producer is accepted.

5. **runtime.mjs case "enriched own Block (runtime accepts)" is not a test.** It would pin, as tested behavior, a usage the types reject. The token is identity-based, so the runtime does accept it.

6. **Gate script gained an optional `emittedFragments` field.** Not in the unit list, but in candidate 1's gate plan. The `produced-block` entry requires `ViewBlock: import("foldkit/block").ProducedBlockWithView<` and `, typeof assembleViewBlock>` in the emitted `produced-block-block.d.ts`. A wrong fragment failed the gate during development, so the check is live.

7. **Accepted fixture asserts every invalid producer's reason string** through `ReasonOf<Member> = Member[Exclude<keyof Member, 'evidence'>]`, grafted from candidate 2's `Reason` assertions. This is what makes each gate mutation fail at a line that names the expected message.

8. **README section has no before/after table for the existing fixtures.** The "before" is the prototype commit, which is not on main, so a table against it would be a session echo. The numbers are in `impl/report.md`.

9. **TSDoc wording fix is its own commit** (`docs(foldkit): clarify the produceBlock producer guidance`) instead of being folded into the types commit, since interactive rebase is unavailable here.

10. **`model.ts` and `page/ui/index.ts` are untouched.** Per the brief, `uiPages: UiBlock.Model` stays as the benchmark control; `page/ui/index.ts` already exports only `UiBlock` on this base, so the design's re-export removal has nothing to remove.
