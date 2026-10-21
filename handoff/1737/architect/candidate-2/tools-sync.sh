#!/bin/sh
# Regenerates fk/dist/block/{produced,define,public}.d.ts from sketch/produced.ts and the base dist.
set -e
C="$(cd "$(dirname "$0")" && pwd)"
S=/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad
BASE=$S/wt-base/packages/foldkit/dist/block
sed -e "s#from './internals.js'#from './__INTERNALS__'#" "$C/sketch/produced.ts" \
  | node -e '
const fs=require("fs");let s=fs.readFileSync(0,"utf8");
s=s.replace(/import type \{ DefaultViewTypeId \} from .\.\/__INTERNALS__.;?\n/, "import type { DefaultViewTypeId } from \"./defaultView.js\";\n");
s=s.replace(/import type \{ AnyBlock \} from .\.\/__INTERNALS__.;?\n/, "import type { AnyBlock } from \"./definition.js\";\n");
fs.writeFileSync(process.argv[1], s);' "$C/fk/dist/block/produced.d.ts"
sed -e "s#import type { ProducedCompositionBlock } from './produced.js';#import type { ProducedBlock } from './produced.js';#" \
    -e "s#produceBlock: <Producer>(produce: Producer) => ProducedCompositionBlock<ModelSchema, OutMessageSchema, Producer>;#produceBlock: <Producer>(produce: Producer) => ProducedBlock<'View', Owner<Id, Concrete>, ModelSchema, OutMessageSchema, Producer>;\n    produceHeadlessBlock: <Producer>(produce: Producer) => ProducedBlock<'Headless', Owner<Id, Concrete>, ModelSchema, OutMessageSchema, Producer>;#" \
    $BASE/define.d.ts > "$C/fk/dist/block/define.d.ts"
sed -e "s#export type { ProducedBlockWithOutMessage, ProducedBlockWithView, ProducedBlockWithViewAndOutMessage, ProducedBlockWithoutViewOrOutMessage, ProducedCompositionBlock, } from './produced.js';#export type { ProducedBlock, ProducedBlockKind, ProducedBlockWithOutMessage, ProducedBlockWithView, ProducedBlockWithViewAndOutMessage, ProducedBlockWithoutViewOrOutMessage } from './produced.js';#" $BASE/public.d.ts > "$C/fk/dist/block/public.d.ts"
