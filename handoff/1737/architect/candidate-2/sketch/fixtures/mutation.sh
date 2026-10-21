#!/bin/sh
# Break one rule at a time in the candidate's produced.d.ts and count the fixture diagnostics that appear. Restores after each.
set -u
cd "$(dirname "$0")"
C=$(cd ../.. && pwd)
TSC=/home/mrwe1@office.begasoft.ch/projects/foldkit/foldkit/node_modules/.pnpm/typescript@7.0.2/node_modules/typescript/bin/tsc
run() { node $TSC -p tsconfig.json 2>&1 | grep -v "^ " | sed -E 's/\([0-9]+,[0-9]+\)//' | sed -E 's/: error (TS[0-9]+).*/ \1/' | sort | uniq -c | tr '\n' ';'; }
echo "unmutated: [$(run)]"
mutate() { sed -i "$2" $C/fk/dist/block/produced.d.ts; echo "$1: [$(run)]"; $C/tools-sync.sh; }
mutate "owner comparison removed        " 's/SameType<CompletedOwner, OwnerValue> extends true/true extends true/'
mutate "Model comparison removed        " 's/SameType<CompletedModel, ModelSchema> extends true/true extends true/'
mutate "OutMessage agreement removed    " 's/OutMessageAgrees<OutMessageSchema, Completed> extends true/true extends true/'
mutate "view agreement removed          " 's/ViewAgrees<Kind, Completed> extends true/true extends true/'
mutate "any check removed               " 's/IsAny<Completed> extends true/false extends true/'
mutate "nullary check relaxed           " 's/\[Producer\] extends \[() => infer Completed\]/[Producer] extends [(...args: any[]) => infer Completed]/'
mutate "key set drops hostHandlers      " "s/'owner' | 'Model' | 'OutMessage'/'owner' | 'Model' | 'hostHandlers' | 'OutMessage'/"
mutate "mutual assignability for SameType" 's/^type SameType<Left, Right> =$/type SameType<Left, Right> = [Left, Right] extends [Right, Left] ? true : false\ntype SameTypeOld<Left, Right> =/'
