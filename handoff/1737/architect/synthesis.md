# Synthesis decision: hardened produceBlock

Base: candidate 1 (`architect/candidate-1/`). The cross-judge (sonnet, `architect/judge.md`) picked the same base: A 28, B 27, C 27. Candidate 1 leaves the completed Block contract untouched, and its plan measures the Website directly.

Convergence across all three candidates, so these parts are settled:
- `produceBlock` lives only on `AuthoringDefinition`. `owner`, `Model` and `OutMessage` come straight from the Definition.
- Every other member comes from a mapped type over the contract's keys, so there is no hand-copied list. Each member reads one cached producer verdict.
- Type errors appear at the first consumer, not at the `produceBlock(` line.
- At runtime, `assembleBlock` registers a per-Definition token. The produce methods compare against it and return the identical object.
- A producer that adds members (Query, Toast enrichment) is rejected. Enrich after producing instead.
- Composition-only factories, Query and Toast stay on `assembleBlock` in this change.

Choices where candidates differed:
- View presence: two methods, `produceBlock` and `produceViewlessBlock` (candidates 1 and 2). Rejected: candidate 3's change of every completed Block's view member to required `undefined`. It widens the change to all ~132 Blocks and puts budgets at risk, while keeping the contract untouched is possible. The name follows the Website docs' "viewless Block". "Headless" collides with Headless UI.
- Owner and Model comparison: mutual assignability, the `ValidateViewOwner` precedent (candidates 1 and 3). Candidate 2's identity comparison was motivated by a false accept that the judge could not reproduce, and candidate 2's own mutation row fails no gate. Revisit if a reproducible case appears.
- Inline-thunk cost: try candidate 3's `NoInfer` on `assembleBlock`'s return types as the first implementation unit, measured on the real Website.
  - If the full Website typecheck with the inline producer plus `NoInfer` lands within 0.5% of the eager instantiation count, adopt `NoInfer`. The inline form then becomes the documented form, and no lint rule is needed. This fixes the root cause instead of policing syntax.
  - Otherwise, use a named producer (`const assembleUiBlock = () => ...`) and leave the `named-block-producer` lint as a follow-up.

Grafts:
- From candidate 2: the executed fixture set layout (modules, accepted, byte-identical consumer, rejected) with `relocate.sh` and `mutation.sh`, the runtime harness, and its mutation table as the checklist.
- From candidate 3: `NoInfer` (as above), and `runtime.mjs`, which exercises the token candidate 1 never ran. Also the `produced-composition-8` perf fixture idea, as the budget gate for the inline cost.

Deferred: oxlint detection and new rules, the codemod and migration waves, Website docs and snippet, generic-factory restructure.

Judge's corrections, accepted:
- The 6x to 8.4x figures are toy-program ratios. The Website figure is 1.085x (`measure-forms.md`).
- Candidate 1's runtime token was inferred, not executed.
