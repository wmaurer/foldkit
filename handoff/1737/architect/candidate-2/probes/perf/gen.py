# Generates twenty independent Definitions per file in three authoring forms. Run from this directory.
N = 20
head = '''import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'

const Model = Schema.Struct({ count: Schema.Number, label: Schema.String })
const ChildMessage = Message.defineMessageUnion({ Clicked: {}, Reset: {} })
'''
def unit(i, mode):
    impl = f'''{{
    init: () => ({{ model: Model.make({{ count: 0, label: '' }}) }}),
    update: Comp{i}.makeUpdate((model, _message) => ({{ model }})),
    view: Comp{i}.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }}'''
    s = f"const Def{i} = Block.makeDefinition('Unit{i}', {{ Model, Message: ChildMessage }})\nconst Comp{i} = Def{i}.makeComposition()\n"
    if mode == 'eager':
        s += f"export const Block{i} = Comp{i}.assembleBlock({impl})\n"
    elif mode == 'inline':
        s += f"export const Block{i} = Def{i}.produceBlock(() => Comp{i}.assembleBlock({impl}))\n"
    else:
        s += f"const assemble{i} = () => Comp{i}.assembleBlock({impl})\nexport const Block{i} = Def{i}.produceBlock(assemble{i})\n"
    return s
for mode in ['eager', 'inline', 'named']:
    open(f'mine/produce-{N}-{mode}.ts', 'w').write(head + ''.join(unit(i, mode) for i in range(N)))
    open(f'mine/produce-{N}-{mode}.consumer.ts', 'w').write(f"import * as All from './produce-{N}-{mode}.js'\nexport const models = [" + ','.join(f"All.Block{i}.Model" for i in range(N)) + "]\n")
