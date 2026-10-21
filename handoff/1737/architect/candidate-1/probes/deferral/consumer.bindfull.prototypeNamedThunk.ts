import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import { TheBlock } from './prototypeNamedThunk.js'
const P = Block.makeDefinition('Parent', { Model: Schema.Struct({ child: TheBlock.Model }), Message: Message.defineMessageUnion({ Noted: {} }) })
export const ChildBinding = P.makeBinding(TheBlock, { field: 'child' })
export const Root = P.makeComposition({ bindings: [ChildBinding] })
