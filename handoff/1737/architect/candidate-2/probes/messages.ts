import type { Assert, Equal } from './harness.js'
import {
  BadAny,
  BadErased,
  BadForeign,
  BadHeadlessDeclaredView,
  BadNever,
  BadNotFunction,
  BadOutTwin,
  BadParameter,
  BadSameId,
  BadSameModel,
  BadViewDeclaredHeadless,
} from './rejected.js'

export type Any = Assert<Equal<keyof typeof BadAny.update, 'The producer returned any. Return the Block that assembleBlock completes.'>>
export type Never = Assert<Equal<keyof typeof BadNever.update, 'The producer must be a function that takes no arguments.'>>
export type Erased = Assert<Equal<keyof typeof BadErased.update, 'The producer returned never. Return the Block that assembleBlock completes.'>>
export type NotFunction = Assert<Equal<keyof typeof BadNotFunction.update, 'The producer must be a function that takes no arguments.'>>
export type Parameter = Assert<Equal<keyof typeof BadParameter.update, 'The producer must be a function that takes no arguments.'>>
export type Foreign = Assert<Equal<keyof typeof BadForeign.update, 'The producer returned a Block from a different Definition.'>>
export type SameModel = Assert<Equal<keyof typeof BadSameModel.update, 'The producer returned a Block from a different Definition.'>>
export type SameId = Assert<Equal<keyof typeof BadSameId.update, 'The producer returned a Block with a different Model than this Definition.'>>
export type OutTwin = Assert<Equal<keyof typeof BadOutTwin.update, 'The producer returned a Block whose OutMessage differs from this Definition.'>>
export type ViewHeadless = Assert<Equal<keyof typeof BadViewDeclaredHeadless.update, 'produceBlock needs a Block with a default view. Use produceHeadlessBlock for a Block without one.'>>
export type HeadlessView = Assert<Equal<keyof typeof BadHeadlessDeclaredView.update, 'produceHeadlessBlock needs a Block without a default view. Use produceBlock for a Block with one.'>>
