import type * as Block from 'foldkit/block'
import { makeParts } from './factoryCommon.js'
type BlockParts<Item extends string> = ReturnType<typeof makeParts<Item>>
export interface Completed<Item extends string> extends Block.CompletedWithViewAndOutMessage<BlockParts<Item>['composition'], BlockParts<Item>['implementation']> {}
const makeBlock = <Item extends string>(): Completed<Item> => {
  const { composition, implementation } = makeParts<Item>()
  return composition.assembleBlock(implementation)
}
export const create = <Item extends string>(): Completed<Item> => makeBlock<Item>()
