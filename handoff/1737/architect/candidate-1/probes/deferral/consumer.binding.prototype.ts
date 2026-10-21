import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import { TheBlock } from './prototype.js'
const P = Block.makeDefinition('Parent', { Model: Schema.Struct({ child: TheBlock.Model }), Message: Message.defineMessageUnion({ Noted: {} }) })
export const ChildBinding = P.makeBinding(TheBlock, { field: 'child' })
