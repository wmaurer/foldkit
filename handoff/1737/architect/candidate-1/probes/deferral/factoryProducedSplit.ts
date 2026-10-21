import { producerOf } from '../produced.js'
import { ChildMessage, ChildOutMessage, FactoryNamespace, Model, makeParts } from './factoryCommon.js'
const makeFactoryDefinition = () => FactoryNamespace.makeDefinition({ Model, Message: ChildMessage, OutMessage: ChildOutMessage })
const makeBlock = <Item extends string>() => {
  const assembleFactoryBlock = () => {
    const { composition, implementation } = makeParts<Item>()
    return composition.assembleBlock(implementation)
  }
  return producerOf(makeFactoryDefinition()).produceBlock(assembleFactoryBlock)
}
export type Completed<Item extends string> = ReturnType<typeof makeBlock<Item>>
export const create = <Item extends string>(): Completed<Item> => makeBlock<Item>()
