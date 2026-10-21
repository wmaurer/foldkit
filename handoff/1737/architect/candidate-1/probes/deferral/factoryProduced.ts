import { producerOf } from '../produced.js'
import { makeParts } from './factoryCommon.js'
const makeBlock = <Item extends string>() => {
  const { Definition, composition, implementation } = makeParts<Item>()
  const assembleFactoryBlock = () => composition.assembleBlock(implementation)
  return producerOf(Definition).produceBlock(assembleFactoryBlock)
}
export type Completed<Item extends string> = ReturnType<typeof makeBlock<Item>>
export const create = <Item extends string>(): Completed<Item> => makeBlock<Item>()
