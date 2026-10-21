import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'

type Equal<Left, Right> =
  (<V>() => V extends Left ? 1 : 2) extends <V>() => V extends Right ? 1 : 2 ? true : false
type Expect<T extends true> = T

const Model = Schema.Struct({ count: Schema.Number })
const ChildMessage = Message.defineMessageUnion({ Clicked: {} })
const ChildOut = Message.defineMessageUnion({ Done: {} })

// A: view, no OutMessage
const ADef = Block.makeDefinition('A', { Model, Message: ChildMessage })
const AComp = ADef.makeComposition()
const ABlock = ADef.produceBlock(() =>
  AComp.assembleBlock({
    init: () => ({ model: Model.make({ count: 0 }) }),
    update: AComp.makeUpdate((model, _message) => ({ model })),
    view: AComp.makeView((model, h) => h.div([], [String(model.count)])),
  }),
)
// B: headless, no OutMessage
const BDef = Block.makeDefinition('B', { Model, Message: ChildMessage })
const BComp = BDef.makeComposition()
const BAssembled = BComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: BComp.makeUpdate((model, _message) => ({ model })),
})
const BBlock = BDef.produceBlock(() => BAssembled)
// C: view + OutMessage
const CDef = Block.makeDefinition('C', { Model, Message: ChildMessage, OutMessage: ChildOut })
const CComp = CDef.makeComposition()
const CAssembled = CComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: CComp.makeUpdate((model, _message) => ({ model })),
  view: CComp.makeView((model, h) => h.div([], [String(model.count)])),
})
const CBlock = CDef.produceBlock(() => CAssembled)
// D: headless + OutMessage
const DDef = Block.makeDefinition('D', { Model, Message: ChildMessage, OutMessage: ChildOut })
const DComp = DDef.makeComposition()
const DAssembled = DComp.assembleBlock({
  init: () => ({ model: Model.make({ count: 0 }) }),
  update: DComp.makeUpdate((model, _message) => ({ model })),
})
const DBlock = DDef.produceBlock(() => DAssembled)
// E: wrong Definition
const OtherModel = Schema.Struct({ name: Schema.String })
const EDef = Block.makeDefinition('E', { Model: OtherModel, Message: ChildMessage })
const EBlock = EDef.produceBlock(() => BAssembled)

// shapes of assembled values
type AssembledKinds = [
  typeof BAssembled extends Block.CompletedBlockWithoutViewOrOutMessage<any, any, any, any, any, any> ? 'B-headless' : 'B-other',
  typeof CAssembled extends Block.CompletedBlockWithViewAndOutMessage<any, any, any, any, any, any, any> ? 'C-viewout' : 'C-other',
  typeof DAssembled extends Block.CompletedBlockWithOutMessage<any, any, any, any, any, any, any> ? 'D-out' : 'D-other',
]
export const kinds: AssembledKinds = null!
export const kindsReveal: 'zzz' = kinds

// AnyBlock assignability
export const anyA: typeof ABlock extends Block.AnyBlock ? 'A ok' : 'A fails AnyBlock' = null!
export const anyB: typeof BBlock extends Block.AnyBlock ? 'B ok' : 'B fails AnyBlock' = null!
export const anyC: typeof CBlock extends Block.AnyBlock ? 'C ok' : 'C fails AnyBlock' = null!
export const anyD: typeof DBlock extends Block.AnyBlock ? 'D ok' : 'D fails AnyBlock' = null!
export const anyBAssembled: typeof BAssembled extends Block.AnyBlock ? 'Bassembled ok' : 'Bassembled fails' = null!
export const r1: 'zzz' = anyA
export const r2: 'zzz' = anyB
export const r3: 'zzz' = anyC
export const r4: 'zzz' = anyD
export const r5: 'zzz' = anyBAssembled

// E: model mismatch silently accepted?
export type EModel = Expect<Equal<typeof EBlock.Model, typeof OtherModel>>
export const eOwner: 'zzz' = null! as typeof EBlock.owner
export const eInit: 'zzz' = null! as ReturnType<typeof EBlock.init>
