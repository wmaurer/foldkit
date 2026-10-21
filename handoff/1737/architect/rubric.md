# Arena rubric: hardened produceBlock design (judge-only, runners do not see this)

1. Deferral kept. Reading `.Model` never types the producer or the Composition: no constraint or contextual signature on the thunk, no return-position choice that depends on the producer (grounding 1-4).
2. Shape fidelity. All four completed shapes, factory extras (Query, Toast), and chained `replaceEffectsLayer`/`provideHandlers` results reach consumers exactly as `assembleBlock` gives them: same keys, same member types, same `embedView` overloads, same Program acceptance and rejection (5-13).
3. Foreign and invalid producers. Rejected lazily at the type level and eagerly at runtime, with stated error locations and stated limits for shared-namespace owners (14-23).
4. One way, no hand-synced lists. A clear story for `assembleBlock` and public `Block.Model` (no lasting second way for the same task); the member inventory is derived or fails the build on drift.
5. Authoring cost and reach. Small ceremony at ~132 sites, codemod-able, and a story for Composition-only factories (24-27) and oxlint (28-30).
6. Gate plan. Concrete declaration fixtures (accepted and rejected), budget handling, and a latency control fixture that keeps a parent reading `UiBlock.Model` (31-39).
