# Unit 1: NoInfer experiment

Command: `cd packages/website && pnpm exec tsc --noEmit --extendedDiagnostics --singleThreaded`, 3 runs per arm, medians.
Harness: `impl/tools/measure-website.sh <label>`; raw outputs in `impl/measure/<label>/run{1,2,3}.txt`.
foldkit was rebuilt (`pnpm -F foldkit build`) before each arm that changed `definition.ts`.
NoInfer patch: `impl/noinfer.patch` (13 return types: 11 `assembleBlock` overload returns, `replaceEffectsLayer`, `provideHandlers`; candidate 3's probed file minus its `DefaultViewTypeId` changes).

| arm | Instantiations (median) | Types | Check time (s) | errors |
|---|---|---|---|---|
| prototype inline, no NoInfer (d8626087d) | 28,123,937 | 769,970 | 9.636 | 0 |
| inline + NoInfer | 26,065,473 | 681,214 | 8.571 | 0 |
| eager (65d1cd9c block.ts) + NoInfer | 25,864,364 | 680,932 | 8.616 | 0 |
| named producer + NoInfer (context) | 25,766,305 | 680,999 | 8.586 | 0 |
| named producer, no NoInfer (context) | 25,766,136 | 680,882 | 8.615 | 0 |
| eager, no NoInfer (context) | 25,864,258 | 680,820 | 8.611 | 0 |

Per-run instantiation counts vary by about 58k between runs of one arm (for example 28,065,776 / 28,123,937 / 28,123,955), so differences under about 0.2% are noise.

## Decision rule (fixed before measuring)

Adopt NoInfer if inline + NoInfer is within 0.5% of eager + NoInfer and the Website typechecks with 0 errors.

inline + NoInfer exceeds eager + NoInfer by 201,109 instantiations, 0.78%. That is outside 0.5%. Decision: revert NoInfer; use a named producer (`const assembleUiBlock = () => UiComposition.assembleBlock({ init, update, view })`).

## What the numbers say

- The inline thunk costs 2,357,801 instantiations (9.2%) over the named producer on the full Website check without NoInfer.
- NoInfer removes 2,058,464 of that, leaving 299,168 over the named form (1.2%).
- NoInfer has no measurable effect on the named and eager forms (+169 and +106 instantiations), so it changes cost only for the inline form.
- The named producer is 98k cheaper than eager, because `model.ts` reads `UiBlock.Model` without typing the producer.
