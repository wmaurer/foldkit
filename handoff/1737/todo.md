# 1737 produceBlock hardening (Feature playbook)

- [x] 1. `how` over the affected subsystem.
- [x] 2. `architect` for parallel design exploration.
- [x] 3. Write the throughput checkpoint as four todo items.
  - Blocking first steps: base commit d8626087d (done), then `how` grounding, then architect synthesis. Implementation waits on the synthesized design.
  - Independent workstreams: architect runners in parallel, each writing only its own design file in the scratchpad. Verification splits into checks (declarations, budgets, tests) and the benchmark.
  - Shared mutable state: the host CPU during benchmarks (serialize: benchmark runs alone, after all builds), and the wt-base checkout (no delegate writes there; the implementer gets its own worktree from d8626087d).
  - Smallest safe decomposition: one implementation owner, because produced.ts, define.ts, public.ts and the declaration tests change together.
- [x] 4. Delegate code-writing to a subagent (opus, own worktree, named data shape, success criteria).
- [x] 5. Verify on the matching surface (emitted declarations, compiler budgets, foldkit tests, website typecheck, native LSP benchmark).
- [x] 6. Rebase into small, ordered commits. Stack follow-ups.
- [ ] 7. If the design is contested, `interrogate` before shipping. deferred: user runs the review after compaction
- [ ] 8. Run **Opening a PR**. skip: user wants a compactable state for their own review first; posting is outward-facing.
- [x] show-me-your-work audit and cross-model trail review
- [x] Pause safely: publish resume checkpoint for compaction
