#!/bin/sh
# Usage: measure-website.sh <label>. Runs the full Website check 3 times, prints per-run and median figures.
set -u
SP=/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad
label=$1
out=$SP/impl/measure/$label
mkdir -p $out
cd $SP/wt-impl/packages/website
for run in 1 2 3; do
  pnpm exec tsc --noEmit --extendedDiagnostics --singleThreaded > $out/run$run.txt 2>&1
  echo "exit $?" >> $out/run$run.txt
done
for field in 'Instantiations' 'Types' 'Check time' 'Total time'; do
  values=$(grep -h "^$field:" $out/run*.txt | awk -F: '{gsub(/[ s]/,"",$2); print $2}' | sort -n | tr '\n' ' ')
  median=$(echo $values | awk '{print $2}')
  echo "$label | $field | runs: $values| median: $median"
done
echo "$label | errors: $(grep -c 'error TS' $out/run1.txt) | exits: $(grep -h '^exit' $out/run*.txt | tr '\n' ' ')"
