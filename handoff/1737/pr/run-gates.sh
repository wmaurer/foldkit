#!/bin/bash
SP=$1; G=$SP/pr/gates; cd $SP/wt-pr
run() { name=$1; shift; ( "$@" ) > $G/$name.log 2>&1; echo "$name $?" >> $G/exit-codes.txt; }
: > $G/exit-codes.txt
run foldkit-build pnpm -F foldkit build
run foldkit-typecheck pnpm -F foldkit typecheck
run foldkit-test pnpm -F foldkit test
run check-emitted-declarations pnpm check:emitted-declarations
run check-block-type-performance pnpm check:block-type-performance
run website-typecheck bash -c "cd packages/website && pnpm typecheck"
run r-typecheck pnpm -r typecheck
run format-check pnpm format:check
run lint pnpm lint
echo DONE >> $G/exit-codes.txt
