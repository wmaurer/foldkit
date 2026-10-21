#!/bin/sh
# Re-runs every probe of candidate 2. Output is recorded in results.txt.
set -u
cd "$(dirname "$0")"
P=$(pwd)
TSC=/home/mrwe1@office.begasoft.ch/projects/foldkit/foldkit/node_modules/.pnpm/typescript@7.0.2/node_modules/typescript/bin/tsc
TS6=/home/mrwe1@office.begasoft.ch/projects/foldkit/foldkit/node_modules/.pnpm/typescript@6.0.3/node_modules/typescript/package.json
FLAGS="--ignoreConfig --noEmit --strict --exactOptionalPropertyTypes --module nodenext --moduleResolution nodenext --target es2022 --skipLibCheck --types ''"
whole() { node $TSC --ignoreConfig --noEmit --strict --exactOptionalPropertyTypes --module nodenext --moduleResolution nodenext --target es2022 --skipLibCheck --types "" --extendedDiagnostics "$1" 2>&1 | grep -E "^Instantiations|error" | tr '\n' ' ' | sed 's/Instantiations: *//'; }

echo "== 1. type probes, exactOptionalPropertyTypes on (tsc 7.0.2 -p tsconfig.json)"
echo "   expected: no diagnostics in shapes.ts chained.ts messages.ts; rejected.ts 13 x TS2769 + 1 x TS2589 (Program root); roots.ts the same family"
node $TSC -p tsconfig.json 2>&1 | grep -v "^ " | awk -F'[(:]' '{print $1}' | sort | uniq -c
echo "   TS2769 lines in rejected.ts:"; node $TSC -p tsconfig.json 2>&1 | grep "^rejected.ts(.*TS2769" | sed 's/rejected.ts(\([0-9]*\),.*/\1/' | tr '\n' ' '; echo
echo "== 2. same probes with exactOptionalPropertyTypes off (tsconfig.noexact.json)"
node $TSC -p tsconfig.noexact.json 2>&1 | grep -v "^ " | awk -F'[(:]' '{print $1}' | sort | uniq -c
echo "   TS2769 count in rejected.ts: $(node $TSC -p tsconfig.noexact.json 2>&1 | grep -c '^rejected.ts(.*TS2769')"

echo "== 3. deferral matrix, instantiations to read one member (TS 6.0.3 API, defer/count.mjs)"
(cd defer && python3 gen.py)
printf "%-34s %10s %10s %10s %10s %10s\n" form Model owner OutMessage Message makeBinding
for v in ea:eager-assembleBlock pa:prototype-inline-arrow pb:prototype-named-producer ma:candidate2-inline-arrow mb:candidate2-named-producer mc:candidate2-function-declaration; do
  key=${v%%:*}; label=${v#*:}
  line=$(printf "%-34s" $label)
  for m in Model owner OutMessage Message bind; do
    f="$P/defer/consumer.$key.$m.ts"
    n=$(node defer/count.mjs $TS6 "$f" | tr -d ' ')
    line="$line $(printf '%10s' $n)"
  done
  echo "$line"
done
echo "   whole-program instantiations, tsc 7.0.2 --extendedDiagnostics (includes about 101k of shared fixture head)"
for v in ea mb ma mc pa pb; do printf "   %-4s %s\n" $v "$(whole defer/blocks.$v.ts)"; done

echo "== 4. what makes inline arrows expensive: producer passed through a signature (whole program / read .Model on TS 6.0.3)"
for t in tax-naked tax-function tax-object tax-contextual-signature tax-intersection-guard tax-named; do
  printf "   %-28s whole %-10s read-Model %s\n" $t "$(whole defer/blocks.$t.ts)" "$(node defer/count.mjs $TS6 "$P/defer/consumer.$t.Model.ts" | tr -d ' ')"
done

echo "== 5. twenty independent Blocks per file"
for m in eager inline named; do printf "   %-7s whole %-10s read 20x .Model %s\n" $m "$(whole perf/mine/produce-20-$m.ts)" "$(node defer/count.mjs $TS6 "$P/perf/mine/produce-20-$m.consumer.ts" | tr -d ' ')"; done

echo "== 6. budget fixtures: AuthoringDefinition gains two methods (tsc 7.0.2 instantiations, prototype dist vs candidate dist)"
for f in baseline deep-composition-8 wide-composition-100 command-requirements-200; do
  a=$(node $TSC --ignoreConfig --noEmit --strict --skipLibCheck --module nodenext --moduleResolution nodenext --target es2022 --lib esnext,dom --types "" --verbatimModuleSyntax --extendedDiagnostics perf/proto/$f.ts 2>&1 | grep -E "^Instantiations" | sed 's/Instantiations: *//')
  b=$(node $TSC --ignoreConfig --noEmit --strict --skipLibCheck --module nodenext --moduleResolution nodenext --target es2022 --lib esnext,dom --types "" --verbatimModuleSyntax --extendedDiagnostics perf/mine/$f.ts 2>&1 | grep -E "^Instantiations" | sed 's/Instantiations: *//')
  printf "   %-26s prototype %-9s candidate2 %s\n" $f $a $b
done

echo "== 7. declaration emit (noEmitOnError, skipLibCheck false, exactOptionalPropertyTypes)"
(cd emit && node $TSC -p tsconfig.json && echo "   emit.ts: emitted, exit 0" ; node $TSC -p tsconfig.cross.json && echo "   childblock.ts + parentblock.ts: emitted, exit 0")
(cd emit-consumer && node $TSC -p tsconfig.json && echo "   consumer of emitted emit.d.ts: exit 0")
(cd emit-consumer2 && node $TSC -p tsconfig.json && echo "   consumer of emitted cross-module d.ts: exit 0")

echo "== 8. generic factory with a Definition in scope (factory/)"
for f in consumer.new.ts consumer.old.ts consumer.new.msg.ts; do printf "   %-22s %s\n" $f "$(node defer/count.mjs $TS6 "$P/factory/$f" | tr -d ' ')"; done

echo "== 9. runtime (node runtime.mjs against the patched copy of dist)"
node runtime.mjs | sed 's/^/   /'
