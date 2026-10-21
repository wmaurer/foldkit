import { Layer, Schema } from 'effect'
import * as Block from './fkdist/dist/block/public.js'
import * as Message from './fkdist/dist/message/public.js'
import { defaultViewOf } from './fkdist/dist/block/defaultView.js'

const ModelA = Schema.Struct({ a: Schema.String })
const ModelB = Schema.Struct({ b: Schema.Number })
const Msg = Message.defineMessageUnion({ Clicked: {} })
const assemble = (composition, model, value, view) =>
  composition.assembleBlock({
    init: composition.makeInit(() => ({ model: model.make(value) })),
    update: model => ({ model }),
    ...(view ? { view: composition.makeView((_m, h) => h.div([])) } : {}),
  })
const outcome = (label, run) => {
  try {
    const value = run()
    console.log(label.padEnd(44), 'ok', value)
  } catch (error) {
    console.log(label.padEnd(44), 'throws:', error.message)
  }
}

const OwnDefinition = Block.makeDefinition('Own', { Model: ModelA, Message: Msg })
const OwnComposition = OwnDefinition.makeComposition()
const SameIdDefinition = Block.makeDefinition('Own', { Model: ModelA, Message: Msg })
const OtherDefinition = Block.makeDefinition('Other', { Model: ModelB, Message: Msg })
const Shared = Block.makeNamespace('Shared')
const SingleDefinition = Shared.makeDefinition({ Model: ModelA, Message: Msg })
const MultipleDefinition = Shared.makeDefinition({ Model: ModelA, Message: Msg })
const MultipleComposition = MultipleDefinition.makeComposition()

const own = assemble(OwnComposition, ModelA, { a: '' }, true)
outcome('own Block, identical object', () => OwnDefinition.produceBlock(() => own) === own)
outcome('own Block keeps default view registration', () => defaultViewOf(OwnDefinition.produceBlock(() => own)) !== undefined)
outcome('second Composition of the same Definition', () => {
  const block = assemble(OwnDefinition.makeComposition(), ModelA, { a: '' }, false)
  return OwnDefinition.produceBlock(() => block) === block
})
outcome('replaceEffectsLayer result', () => {
  const replaced = own.replaceEffectsLayer(Layer.empty)
  return OwnDefinition.produceBlock(() => replaced) === replaced
})
outcome('enriched own Block (runtime accepts)', () => {
  const enriched = Object.assign(assemble(OwnComposition, ModelA, { a: '' }, false), { extra: 1 })
  return OwnDefinition.produceBlock(() => enriched) === enriched
})
outcome('foreign Block (different id)', () => OwnDefinition.produceBlock(() => assemble(OtherDefinition.makeComposition(), ModelB, { b: 1 }, true)))
outcome('same id, separate makeDefinition', () => SameIdDefinition.produceBlock(() => own))
outcome('shared namespace sibling, same Model', () => SingleDefinition.produceBlock(() => assemble(MultipleComposition, ModelA, { a: '' }, true)))
outcome('non-function producer', () => OwnDefinition.produceBlock(own))
outcome('producer with a parameter', () => OwnDefinition.produceBlock(count => own))
outcome('producer returning a non-Block', () => OwnDefinition.produceBlock(() => ({ owner: own.owner, Model: own.Model })))
outcome('Composition has no produceBlock', () => 'produceBlock' in OwnComposition)
