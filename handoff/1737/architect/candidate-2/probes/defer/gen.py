# Generates the deferral and tax probes next to this file. Run from this directory.
IMPL = '''{
    init: () => ({ model: ParentModel.make({ child: Model.make({ count: 0, label: "" }), other: Model.make({ count: 0, label: "" }) }) }),
    update: Comp.makeUpdate((model, _message) => ({ model })),
    view: Comp.makeView((model, h) => h.div([], [String(model.child.count)])),
  }'''

def head(package):
    return f'''import {{ Schema }} from 'effect'
import * as Block from '{package}/block'
import * as Message from '{package}/message'

export const Model = Schema.Struct({{ count: Schema.Number, label: Schema.String }})
const ChildMessage = Message.defineMessageUnion({{ Clicked: {{}}, Reset: {{}} }})
const GrandDef = Block.makeDefinition('Grand', {{ Model, Message: ChildMessage }})
const GrandComp = GrandDef.makeComposition()
const GrandBlock = GrandComp.assembleBlock({{
  init: () => ({{ model: Model.make({{ count: 0, label: '' }}) }}),
  update: GrandComp.makeUpdate((model, _message) => ({{ model }})),
  view: GrandComp.makeView((model, h) => h.div([], [String(model.count)])),
}})
export const ParentModel = Schema.Struct({{ child: Model, other: Model }})
const Def = Block.makeDefinition('Parent', {{ Model: ParentModel, Message: ChildMessage }})
const First = Def.makeBinding(GrandBlock, {{ field: 'child' }})
const Second = Def.makeBinding(GrandBlock, {{ field: 'other', placement: 'Second' }})
const Comp = Def.makeComposition({{ bindings: [First, Second] }})
'''

variants = {
    'ea': ('foldkit', f'export const V = Comp.assembleBlock({IMPL})'),
    'pa': ('foldkit-proto', f'export const V = Def.produceBlock(() => Comp.assembleBlock({IMPL}))'),
    'pb': ('foldkit-proto', f'const assemble = () => Comp.assembleBlock({IMPL})\nexport const V = Def.produceBlock(assemble)'),
    'ma': ('foldkit', f'export const V = Def.produceBlock(() => Comp.assembleBlock({IMPL}))'),
    'mb': ('foldkit', f'const assemble = () => Comp.assembleBlock({IMPL})\nexport const V = Def.produceBlock(assemble)'),
    'mc': ('foldkit', f'function assemble() {{ return Comp.assembleBlock({IMPL}) }}\nexport const V = Def.produceBlock(assemble)'),
}
for name, (package, body) in variants.items():
    open(f'blocks.{name}.ts', 'w').write(head(package) + body + '\n')
    for member in ['Model', 'owner', 'OutMessage', 'Message', 'update']:
        open(f'consumer.{name}.{member}.ts', 'w').write(f"import {{ V }} from './blocks.{name}.js'\nexport type M = typeof V.{member}\n")
    open(f'consumer.{name}.bind.ts', 'w').write(f"""import {{ Schema }} from 'effect'
import * as Block from '{package}/block'
import * as Message from '{package}/message'
import {{ V }} from './blocks.{name}.js'

const Outer = Schema.Struct({{ child: V.Model }})
const OuterDef = Block.makeDefinition('Outer', {{ Model: Outer, Message: Message.defineMessageUnion({{ Noted: {{}} }}) }})
export const binding = OuterDef.makeBinding(V, {{ field: 'child' }})
""")

box = "type Box<P> = { readonly Model: typeof ParentModel; readonly message: P extends () => infer C ? C extends { Message: infer M } ? M : never : never }\n"
signatures = {
    'tax-naked': 'declare function produce<P>(p: P): Box<P>',
    'tax-function': 'declare function produce<P extends Function>(p: P): Box<P>',
    'tax-object': 'declare function produce<P extends object>(p: P): Box<P>',
    'tax-contextual-signature': 'declare function produce<P extends (...args: any[]) => unknown>(p: P): Box<P>',
    'tax-intersection-guard': "type Check<P> = P extends () => infer C ? ([C] extends [{ Model: unknown }] ? unknown : never) : never\ndeclare function produce<P>(p: P & Check<P>): Box<P>",
}
for name, signature in signatures.items():
    open(f'blocks.{name}.ts', 'w').write(head('foldkit') + box + signature + f"\nexport const V = produce(() => Comp.assembleBlock({IMPL}))\n")
    open(f'consumer.{name}.Model.ts', 'w').write(f"import {{ V }} from './blocks.{name}.js'\nexport type M = typeof V.Model\n")
open('blocks.tax-named.ts', 'w').write(head('foldkit') + box + 'declare function produce<P>(p: P): Box<P>' + f"\nconst assemble = () => Comp.assembleBlock({IMPL})\nexport const V = produce(assemble)\n")
open('consumer.tax-named.Model.ts', 'w').write("import { V } from './blocks.tax-named.js'\nexport type M = typeof V.Model\n")
