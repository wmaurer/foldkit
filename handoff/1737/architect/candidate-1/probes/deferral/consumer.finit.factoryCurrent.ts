import { create } from './factoryCurrent.js'
export const FruitBlock = create<'Apple' | 'Pear'>()
export type I = ReturnType<typeof FruitBlock.init>
export type O = typeof FruitBlock.OutMessage.Type
export type R = Parameters<typeof FruitBlock.operations.rename>
