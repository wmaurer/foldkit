import { create } from './factoryProducedSplit.js'
export const FruitBlock = create<'Apple' | 'Pear'>()
export type M = typeof FruitBlock.Model
