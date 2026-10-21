# Foldkit #1737: earlier type performance experiments

## Reading the results

The target is editor response after an edit in the Website project. Compiler instantiation counts are screening evidence. Native hover, completion, and error clear requests decide whether a candidate addresses the user visible problem. Source and declaration gates decide whether a candidate preserves the tested contract.

The clearest causal control is the parent Model ablation: replacing only `UiBlock.Model` with the exactly equal local Ui Model Schema cut median native hover from 3921 to 1788 ms cold and from 3513 to 1491 ms after a newline edit, reductions of 54.4% and 57.6%. That patch is diagnostic only because it removes the dependency rather than improving Block construction. See `05-ui-model-dependency-ablation.patch`.

An instrumented cold TypeScript 6.0.3 request attributed the exact Ui assembly request mainly to producing call resolution: about 2475 ms in resolved signature work, 1264 ms in overlapping type argument inference, and 984 ms in overlapping applicability checks. The final `getReturnTypeOfSignature` step was about 0.019 ms. These are overlapping, directional instrumented times, not native TypeScript 7 performance. Inference included about 1212 ms of nested init/update/view work, and the final return-retrieval measurement excludes later property expansion. This informed the producing-call experiments; it does not establish native causal attribution or prove that every return-only encoding must fail.

## 1. Completed return representations

### Lazy completed return

`01-lazy-completed-return.patch` changes only the omitted Layer plus view overload. `Model` projects directly from the Composition; every other completed member indexes the unchanged `CompletedWithView` result through a private interface.

- Base: `65d1cd9c3031fa69ca23e5c2de7c31fd7371d5c7`.
- Static result: Foldkit source, forced declaration build, Website, bounded source and emitted consumers, and the actual Ui root Schema oracle passed. Several strict generic field identity assertions also fail in the untouched source to declaration roundtrip, so they were not treated as candidate regressions.
- Cost: Website instantiations rose 0.183%; types rose 0.007%.
- Native screen: one pair. Cold hover changed 3518 to 3453 ms, while post newline hover changed 3221 to 3384 ms. The candidate arm also recorded watcher warnings, so this is only a no gain screen.
- Decision: rejected for no useful observed gain. It isolates the return representation and leaves overload resolution, parameter inference, and applicability intact.

Earlier direct completed projections belong to the same family. A known view direct return passed source/build but increased Website instantiations 6.95% and types 14.11%. An explicit completed boundary projection produced mixed fixture counts and higher types/symbols. Neither reached native timing. They are grouped here because both retain producing call inference and differ only in return materialization.

## 2. Cheap selectors and passive projections

### Optional Schema selector

`02-optional-schema-selector.patch` replaces ten already bounded optional Schema predicates with `Schema.Constraint` checks. It does not change public bounds, overloads, validators, or the expensive unbounded completed Schema matches.

- Base: `65d1`.
- Static result: accepted source and natural emission, relocated consumers, full framework source, forced build, Website, and unchanged budgets passed.
- Corrected cost: Website instantiations +0.220%, types -0.078%, files unchanged. An earlier count used a different threading mode and was withdrawn; it is not evidence for or against the candidate.
- Native screen: one pair. Cold 3244 to 3221 ms; post edit 3118 to 2933 ms, a 5.9% screen improvement while the request remained near three seconds.
- Decision: rejected as immaterial; completion and error clear were not measured.

### Passive Composition projection

`03-passive-composition-projection.patch` makes the public Composition `Pick` read a private passive field record rather than the complete Definition. The final encoding preserves the original unresolved OutMessage conditional and `makeOutMessageForward` arm.

- Base: `65d1`.
- First safety failure: the slimmer version omitted the forwarding member and failed three unchanged unresolved generic Composition projection cases. Candidate emission and performance were not run for that revision.
- Repaired static result: source, natural emission, relocated declarations, full source/build/Website, and budgets passed.
- Cost: Website instantiations +0.198%, types effectively flat.
- Native screen: one pair. Cold regressed 14.9%; post edit improved 3.1%.
- Decision: rejected as small and mixed.

## 3. Policy and compact graph boundaries

### Independent delivery facts: feasibility only

`06-independent-delivery-facts-proof.patch` adds a reverse mapped carrier so `makeComposition` independently infers a concrete delivery fact tuple, guarded by exact comparison with the original delivery records. The public Binding tuple and original fallback remain.

- Base: `65d1`.
- Static result: source and emitted consumers passed 51 exact assertions, nine paired rejection cases, and two explicit widening/staleness rejections. Removing the exact guard made both negative cases fail as intended. The emitted facts omitted raw Children, `SelectedChildBinding`, and parent Model references.
- Performance: not run. Only the Composition Message projection consumed the tuple; update, init, assembly, and public lifecycle members retained the raw graph.
- Decision: retained as a boundary feasibility proof, not a performance candidate.

### Policy capsules and facts only update aliases

Several compact policy attempts are one logical family:

1. A capture only capsule inferred and emitted independent policy facts while the original update representation remained. Source, emission, relocation, and exact guard mutation passed. No performance was claimed. Its complete `65d1` relative source delta is `07a-policy-capsule-capture-prerequisite.patch`.
2. A required carrier version failed bidirectional Binding and Composition assignment even though the original policy constructors and validators accepted both shapes. Performance was not run. Its complete independent `65d1` relative source delta is `14-required-policy-carrier-rejected.patch`.
3. A complete facts only `makeUpdate` used a distinct generic function representation. Pointwise concrete calls mostly agreed, but original and captured Composition shapes failed assignment in both directions because generic callback inference revalidated an already validated intersection. Emission and timing were not run. Its complete independent `65d1` relative source delta is `15-facts-only-update-boundary-rejected.patch`.
4. A derived optional capsule implementation reached the real Ui path but created reciprocal inference cycles, raised Website instantiations 23.7% and types 16.5%, and was 44 to 46% slower in its single hover screen.
5. Reusing existing raw evidence tuples passed source/build and the actual Ui witness but left raw policy/fold ancestry in defaults and raised Website instantiations 10.9% and types 15.2%. Native timing was not run.

These failures reject those representations. They do not show that every independently inferred graph representation is impossible.

### Trailing per call policy mode

`07-trailing-per-call-policy-mode.patch` is the exact rejected delta on top of the passing capture only capsule snapshot. Apply `07a-policy-capsule-capture-prerequisite.patch` to `65d1` first, then apply `07-trailing-per-call-policy-mode.patch`. It adds a fourth trailing generic to the existing three generic update method and selects raw or captured policy resolution per call.

- Base: the complete passing capture only snapshot reconstructed by `07a` from `65d1`.
- First gate: native TypeScript 7.0.2 rejected original to new and new to original method assignment, both generic pass through calls, and both whole Composition assignment directions. New raw and new captured forms assigned to each other. `Parameters` and `ReturnType` equality still passed.
- Diagnostic: generic callback inference inferred an `AuthoredUpdate` already intersected with its validator and then required validation again. That first gate did not isolate generic count from the added guard. Later controls kept the callback byte-identical: an original three-generic form with fixed facts and a four-generic form without the added input guard still failed old/new method and generic-utility assignment. The extra guard and fourth generic slot are therefore not necessary causes of the incompatibility.
- Emission/performance: not run after the supported compatibility failure.
- Decision: rejected at the first public compatibility gate.

### Canonical guarded policy resolver

`04-canonical-guarded-policy-resolver.patch` gives the existing public aliases one guarded implementation. Exact complete policy facts take a compact path; missing, stale, refined, erased, or unsupported facts fall back to the untouched raw resolver.

- Base: `65d1`.
- Static result: source/emitted/relocated consumers, mutation controls, 25 actual Ui assertions, core source, forced build, Website, and unchanged budgets passed.
- Cost: Website instantiations 25,863,432 to 26,364,354; types 680,818 to 689,261. Wide fixture instantiations rose about 9.25%.
- Native screen: one pair. Cold improved 11.7%; post edit improved only 2.2% and remained 3095 ms. The baseline arm recorded a watcher failure, so no stable speedup is claimed.
- Decision: rejected for no material post edit gain.

## 4. Delivery and requirement algorithms

### Command requirement projection

`08-command-requirement-projection.patch` reads Command Services through `Effect.Services` while retaining the old conditional for the `effect: never` edge case.

- Tested base: `5550ed7`; touched source is applicable to the `65d1` framework tree.
- Static result: source and a broad equivalence matrix passed.
- Website gate limitation: both the baseline and candidate filtered Website checks exited 1 with the same unrelated unused `@ts-expect-error` in `packages/website/scripts/og-image.ts`. The paired counts remain valid screening evidence, but this was not a clean Website consumer pass.
- Cost: Website instantiations +0.295%; focused fixtures +0.011% to +0.082%.
- Native result: three interleaved completion pairs in full replacement and ranged edit protocols. Post edit medians changed -0.57% and +0.09%; payloads were identical.
- Decision: rejected for no material improvement.

### Direct delivery channels

`09-direct-delivery-channels.patch` lets two consumers read resolved OutMessage, requirements, and registration channels before reconstructing a structural update result. The corrected version reconstructs one opaque recipe before projecting channels to preserve intersected recipe inference.

- Tested base: `49f671f`; the touched baseline framework bytes match `65d1`.
- Static result: expanded equality matrix, mutation, source, and declaration emission passed.
- Cost: Website instantiations -1.74%, but deep fixture +13.47%, wide +23.07%, and wide types +91.67%.
- Native: not run after the focused fixture regressions.
- Decision: rejected as encoded. This does not reject all direct channel consumption.

### Scalar Binding placement lookup

`10-scalar-binding-placement.patch` distributes over Binding members and compares the constrained `placement` member directly. Exceptional guards preserve whole member `any` and placement `any`/`never` behavior.

- Tested base: `49f671f`; touched baseline bytes match `65d1`.
- Static result: 490 equality cases, mutation checks, source, and forced declaration build passed; runtime JavaScript was unchanged.
- Cost: Website instantiations -2.53%, types -0.68%, symbols -0.22%; focused fixtures were essentially flat.
- Native: three interleaved full/ranged pairs were noisy and mixed. Full post edit median improved 5.3% while its mean regressed 0.35%; ranged post edit median regressed 0.46%.
- Decision: did not earn integration or a material improvement claim.

### Combined incoming/outgoing delivery index

`13-combined-delivery-index.patch` replaces separate incoming and outgoing owner tables plus a third conflict map with one combined owner table visited for incoming tags.

- Base framework bytes: `65d1`.
- Safety evolution: an earlier normalization disagreed in 4 of 34 oracle cases and was discarded. The final single table encoding passed source, emitted declaration, relocation, accepted/rejected wiring, and an expanded ownership proof. A recursive single pass alternative exceeded instantiation depth at 100 Bindings.
- Cost: deep fixture instantiations -0.94%, wide -7.67%, command -0.07%.
- Native: five interleaved runs. Cold improved 2.5%, whitespace 0.6%, semantic edit regressed 5.5%; ranges overlapped.
- Decision: rejected as the latency fix despite useful deterministic savings.

## 5. Other inference surfaces

### HtmlBuilder marker inference

`11-htmlbuilder-marker-inference.patch` infers Message and Mount requirements from dedicated marker universes and suppresses redundant inference from the full `HtmlBuilder` member body.

- Base: `65d1`.
- Static result: framework source, forced build, Website, and source/emitted focused oracle passed. Only `html/index.d.ts` changed among 275 declarations.
- Cost: Website instantiations rose from 25,863,432 to 25,885,924 (+0.087%).
- Native: six guarded runs. Cold median 3103 to 3138 ms; post newline median 2861 to 2881 ms. Payload and process guards passed.
- Decision: rejected for no observed gain.

### Guarded assembly signatures

`12-guarded-assembly-signature.patch` is the final key based narrow signature screen. It was one of four internal source only assembly controls: an adjacent assembly fast path, a view guard, receiver `NoInfer`, and a narrow key guard. All retained the ordinary `UiComposition.assembleBlock({ init, update, view })` call shape.

- Base: `65d1`.
- Static result: relevant framework source, build, Website, and paired declaration key probes passed for the final guard.
- Native: one run per control, against a two session baseline post edit median of 3285 ms. Candidate post edit times were 3179, 3320, 2988, and 3353 ms respectively. These screens do not establish stable effects; every request remained near three seconds.
- Scope limits: A and B recorded FSEvents watcher warnings. No full emitted/relocated safety suite or compiler-budget run is claimed for these four rejected screens.
- Decision: all four rejected for insufficient observed improvement. They show that these overload encodings did not reproduce the producer boundary gain, not that an internal assembly design cannot do so.

## 6. Profile only evidence

The following informed candidate selection but are not patches to adopt:

- Native whole session CPU samples concentrated in type instantiation, conditional instantiation, conditional evaluation, and relation checks. They do not attribute elapsed time to one Foldkit alias.
- Request scoped TypeScript 6 counters showed large active mapper substitutions through selected Binding intersections, while ordinary alias and conditional root misses were far smaller. This corrected an earlier interpretation that the constructor selection ladder itself ran tens of thousands of times.
- Actual Ui assembly phase instrumentation showed overload inference/applicability dominated the producing call and final return retrieval was negligible. It is directional TS6 attribution, not a native TS7 benchmark.
- The root Ui Model ablation is the strong native dependency control, but it is not an admissible framework fix.

## 7. Separate adopted work

The public validator optimization at commit `38e8` belongs outside these rejected families. Its adoption does not turn any experiment above into a passing editor latency fix, and the experiments should still be evaluated from their stated base and workload.

## Current boundary of the evidence

These results establish that several obvious return aliases, selector substitutions, graph carriers, and small validator rewrites either broke a supported generic contract or failed to materially improve the measured post edit request. They do not establish a TypeScript language impossibility. The corrected guarded explicit producer experiment, whose public authoring form was rejected, shows that retaining `Block.Model` with precise other channels is possible when a stable producer boundary prevents Model lookup from resolving the full inferred assembly call; its API ergonomics are a separate design problem and are outside this earlier experiment pack.

AI-generated by Sol (Codex), posted at the user's request.
