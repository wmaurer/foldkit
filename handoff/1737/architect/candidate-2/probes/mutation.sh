#!/bin/sh
# Watch each gate fail: break one rule at a time in the candidate's copy of dist, count what stops rejecting, restore.
set -u
cd "$(dirname "$0")"
C=$(cd .. && pwd)
TSC=/home/mrwe1@office.begasoft.ch/projects/foldkit/foldkit/node_modules/.pnpm/typescript@7.0.2/node_modules/typescript/bin/tsc
count() { node $TSC -p tsconfig.json 2>&1 | grep -c "^rejected.ts(.*TS2769"; }
pinned() { node $TSC -p tsconfig.json 2>&1 | grep -c "^messages.ts"; }
echo "type level, rejections in rejected.ts (13 expected) and failing message pins in messages.ts (0 expected)"
echo "  unmutated:                    rejections $(count), failing pins $(pinned)"
mutate() { sed -i "$2" $C/fk/dist/block/produced.d.ts; echo "  $1: rejections $(count), failing pins $(pinned)"; $C/tools-sync.sh; }
mutate "owner comparison removed     " 's/SameType<CompletedOwner, OwnerValue> extends true/true extends true/'
mutate "Model comparison removed     " 's/SameType<CompletedModel, ModelSchema> extends true/true extends true/'
mutate "view agreement removed       " 's/ViewAgrees<Kind, Completed> extends true/true extends true/'
mutate "OutMessage agreement removed " 's/OutMessageAgrees<OutMessageSchema, Completed> extends true/true extends true/'
mutate "any check removed            " 's/IsAny<Completed> extends true/false extends true/'
echo "runtime, node runtime.mjs"
cp $C/fk/dist/block/define.js $C/define.js.keep
sed -i 's/if (blockMark !== mark) {/if (false) {/' $C/fk/dist/block/define.js
echo "  mark comparison removed:      $(node runtime.mjs 2>&1 | grep -E 'FAILURES|ALL AS')"
cp $C/define.js.keep $C/fk/dist/block/define.js
sed -i "s/if (kind === 'View' \&\& !hasView) {/if (false) {/" $C/fk/dist/block/define.js
echo "  view-required check removed:  $(node runtime.mjs 2>&1 | grep -E 'FAILURES|ALL AS')"
cp $C/define.js.keep $C/fk/dist/block/define.js
echo "  restored:                     $(node runtime.mjs 2>&1 | grep -E 'FAILURES|ALL AS')"
rm -f $C/define.js.keep
