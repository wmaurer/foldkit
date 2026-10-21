import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'

const Model = Schema.Struct({ selected: Schema.Option(Schema.String), query: Schema.String })
const ItemMessage = Message.defineMessageUnion({ Selected: { item: Schema.String }, Cleared: {} })
const Def = Block.makeDefinition('Fruit', { Model, Message: ItemMessage })
const Comp = Def.makeComposition()

const makeAssemble = <Item extends string>(items: ReadonlyArray<Item>) => () =>
  Comp.assembleBlock({
    init: () => ({ model: Model.make({ selected: Schema.Option(Schema.String).make(undefined as never), query: '' }) }),
    update: Comp.makeUpdate((model, _message) => ({ model })),
    view: Comp.makeView((model, h) => h.div([], items.map(item => h.span([], [item + model.query])))),
  })

export interface Completed<Item extends string>
  extends Block.ProducedBlockWithView<
    Block.Owner<'Fruit', true>,
    typeof Model,
    () => ReturnType<ReturnType<typeof makeAssemble<Item>>>
  > {}

export const makeBlock = <Item extends string>(items: ReadonlyArray<Item>): Completed<Item> =>
  Def.produceBlock(makeAssemble(items))

export interface CompletedOld<Item extends string>
  extends ReturnType<ReturnType<typeof makeAssemble<Item>>> {}
