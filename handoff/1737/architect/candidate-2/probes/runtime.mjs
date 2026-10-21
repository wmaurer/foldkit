import { Layer, Schema } from 'effect'
import * as Block from '../fk/dist/block/public.js'
import * as Message from '../fk/dist/message/public.js'
import { defaultViewOf } from '../fk/dist/block/defaultView.js'
import { blockMarkOf } from '../fk/dist/block/blockMark.js'

const Model = Schema.Struct({ count: Schema.Number })
const Msg = Message.defineMessageUnion({ Clicked: {} })
const results = []
const expect = (name, fn, pattern) => {
  try {
    const value = fn()
    results.push([name, pattern === undefined ? 'ok' : 'UNEXPECTED ACCEPT', ''])
    return value
  } catch (error) {
    const text = String(error.message)
    const matched = pattern !== undefined && pattern.test(text)
    results.push([name, matched ? 'rejected' : pattern === undefined ? 'UNEXPECTED REJECT' : 'WRONG MESSAGE', text])
  }
}
const make = (id, extra = {}) => {
  const Def = Block.makeDefinition(id, { Model, Message: Msg, ...extra })
  const Comp = Def.makeComposition()
  const base = { init: () => ({ model: { count: 0 } }), update: Comp.makeUpdate((model) => ({ model })) }
  const view = Comp.makeView((model, h) => h.div([], [String(model.count)]))
  return { Def, Comp, headless: () => Comp.assembleBlock(base), withView: () => Comp.assembleBlock({ ...base, view }) }
}
const own = make('Own')
const viewBlock = own.withView()
const produced = expect('produce view block returns the identical object', () => {
  const block = own.Def.produceBlock(() => viewBlock)
  if (block !== viewBlock) throw new Error('identity lost')
  if (defaultViewOf(block) === undefined) throw new Error('default view lost')
  if (blockMarkOf(block) === undefined) throw new Error('mark lost')
  return block
})
expect('produce a second assemble of the same Definition', () => own.Def.produceBlock(() => own.withView()))
expect('produceHeadless returns the identical object', () => {
  const headless = own.headless()
  if (own.Def.produceHeadlessBlock(() => headless) !== headless) throw new Error('identity lost')
})
expect('chained replaceEffectsLayer result is accepted', () => own.Def.produceBlock(() => viewBlock.replaceEffectsLayer(Layer.empty)))
expect('chained result is registered to the same Definition', () => {
  const chained = viewBlock.replaceEffectsLayer(Layer.empty)
  if (blockMarkOf(chained) !== blockMarkOf(viewBlock)) throw new Error('mark differs')
})
const foreign = make('Foreign')
expect('foreign Definition, different id', () => own.Def.produceBlock(() => foreign.withView()), /assembled for Definition "Foreign"/)
const twin = make('Own')
expect('separate Block.makeDefinition with the same id and Model', () => own.Def.produceBlock(() => twin.withView()), /separate Definition that is also named "Own"/)
const NS = Block.makeNamespace('Shared')
const siblingA = NS.makeDefinition({ Model, Message: Msg })
const siblingB = NS.makeDefinition({ Model, Message: Msg })
const compA = siblingA.makeComposition()
const compB = siblingB.makeComposition()
const implFor = (comp) => ({ init: () => ({ model: { count: 0 } }), update: comp.makeUpdate((model) => ({ model })), view: comp.makeView((model, h) => h.div([], [String(model.count)])) })
expect('shared-namespace sibling accepted for itself', () => siblingA.produceBlock(() => compA.assembleBlock(implFor(compA))))
expect('shared-namespace sibling Definition, same owner object and Model', () => siblingA.produceBlock(() => compB.assembleBlock(implFor(compB))), /assembled for a separate Definition that is also named "Shared"|assembled for Definition/)
expect('non-function argument', () => own.Def.produceBlock(viewBlock), /expects a function/)
expect('producer returns a plain object', () => own.Def.produceBlock(() => ({ Model })), /completed by assembleBlock/)
expect('producer returns undefined', () => own.Def.produceBlock(() => undefined), /completed by assembleBlock/)
expect('view declared, headless produced', () => own.Def.produceBlock(() => own.headless()), /without a default view/)
expect('headless declared, view produced', () => own.Def.produceHeadlessBlock(() => own.withView()), /with a default view/)
expect('replaceEffectsLayer chain from a foreign block', () => own.Def.produceBlock(() => foreign.withView().replaceEffectsLayer(Layer.empty)), /assembled for Definition "Foreign"/)
for (const [name, status, text] of results) console.log(status.padEnd(18), name, text ? `\n    ${text}` : '')
const bad = results.filter(([, status]) => status !== 'ok' && status !== 'rejected')
console.log(bad.length === 0 ? 'ALL AS EXPECTED' : `FAILURES: ${bad.length}`)
process.exit(bad.length === 0 ? 0 : 1)
