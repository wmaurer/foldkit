#!/bin/sh
# Breaks one producer check at a time in dist/block/produced.d.ts, runs the declaration gate, prints its failure lines, and restores.
set -u
SP=/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad
TARGET=$SP/wt-impl/packages/foldkit/dist/block/produced.d.ts
BACKUP=$SP/impl/produced.d.ts.orig
cp $TARGET $BACKUP
mutate() {
  label=$1
  expression=$2
  sed -i "$expression" $TARGET
  if cmp -s $TARGET $BACKUP; then
    echo "== $label: sed changed nothing"
    return
  fi
  (cd $SP/wt-impl && pnpm --filter foldkit check:emitted-declarations > $SP/impl/mutation-$3.log 2>&1)
  echo "== $label: gate exit $?"
  grep -E "error TS|failed|does not contain" $SP/impl/mutation-$3.log | sed -E 's#^.*fixtures/##; s#^.*produced-block/##' | cut -c1-260
  echo "   rejected fixture alone:"
  (cd $SP/wt-impl/packages/foldkit && ./node_modules/.bin/tsc -p $SP/impl/quick/tsconfig.rejected.json 2>&1 | grep "error TS" | sed -E 's#^.*declaration-tests/##' | cut -c1-200)
  cp $BACKUP $TARGET
}
mutate "owner check removed" "s/IsMutual<ProducedOwner, Expectation\['owner'\]> extends true/true extends true/" owner
mutate "view check removed" "s/ViewAgrees<Completed, Expectation\['view'\]> extends infer ViewVerdict/true extends infer ViewVerdict/" view
mutate "parameter check relaxed" "s/Producer extends () => infer Completed/Producer extends (...args: ReadonlyArray<any>) => infer Completed/" parameter
cmp $TARGET $BACKUP && echo "restored"
