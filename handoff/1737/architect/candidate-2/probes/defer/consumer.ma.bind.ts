import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'
import { V } from './blocks.ma.js'

const Outer = Schema.Struct({ child: V.Model })
const OuterDef = Block.makeDefinition('Outer', { Model: Outer, Message: Message.defineMessageUnion({ Noted: {} }) })
export const binding = OuterDef.makeBinding(V, { field: 'child' })
