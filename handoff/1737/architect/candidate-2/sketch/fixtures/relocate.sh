#!/bin/sh
# Mirrors the declaration gate: emit the accepted file, then compile the consumer and rejected files against the emitted declarations.
set -eu
cd "$(dirname "$0")"
TSC=/home/mrwe1@office.begasoft.ch/projects/foldkit/foldkit/node_modules/.pnpm/typescript@7.0.2/node_modules/typescript/bin/tsc
node $TSC -p tsconfig.json && echo "against dist: accepted, rejected exit 0"
node $TSC -p tsconfig.emit.json && echo "emit accepted: exit 0"
mkdir -p relocated
cp emitted/*.d.ts relocated/
cp produce-block.consumer.ts produce-block.rejected.ts relocated/
cp package.json relocated/
sed 's#"files": \[.*\]#"files": ["produce-block.consumer.ts", "produce-block.rejected.ts"]#' tsconfig.json > relocated/tsconfig.json
(cd relocated && node $TSC -p tsconfig.json && echo "against relocated declarations: consumer, rejected exit 0")
