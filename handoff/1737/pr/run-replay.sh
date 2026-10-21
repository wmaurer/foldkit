#!/bin/bash
SP=$1; R=$SP/pr/replay; mkdir -p $R; cd $SP/wt-pr
: > $R/results.txt
for c in $(git rev-list --reverse 9a5f9307c..wm/1737-produce-block-pr); do
  s=$(git log -1 --format=%h $c)
  git checkout -q $c || { echo "$s checkout-failed" >> $R/results.txt; continue; }
  pnpm -F foldkit build > $R/$s-build.log 2>&1; b=$?
  pnpm -F foldkit typecheck > $R/$s-typecheck.log 2>&1; t=$?
  line="$s build=$b typecheck=$t"
  if git show --name-only --format= $c | grep -q '^packages/website/'; then
    (cd packages/website && pnpm typecheck) > $R/$s-website.log 2>&1; line="$line website=$?"
  fi
  echo "$line" >> $R/results.txt
done
git checkout -q wm/1737-produce-block-pr
echo "head $(git rev-parse --short HEAD) $(git branch --show-current)" >> $R/results.txt
