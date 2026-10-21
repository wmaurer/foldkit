import { Schema } from 'effect'
import { Block } from 'foldkit'
import * as Message from 'foldkit/message'
import * as Program from 'foldkit/program'

import { HeadlessBlock, ReplacedBlock, ViewBlock, ViewOutBlock } from './emitted.js'

export const blocks: ReadonlyArray<Block.AnyBlock> = [ViewBlock, ViewOutBlock, HeadlessBlock, ReplacedBlock]
const ParentModel = Schema.Struct({ a: ViewBlock.Model, b: ViewOutBlock.Model, c: HeadlessBlock.Model })
const ParentDef = Block.makeDefinition('EmitParent', { Model: ParentModel, Message: Message.defineMessageUnion({ Noted: {} }) })
export const a = ParentDef.makeBinding(ViewBlock, { field: 'a' })
export const c = ParentDef.makeBinding(HeadlessBlock, { field: 'c' })
export const p = Program.makeElement({ block: ViewBlock, container: document.body })
// @ts-expect-error A headless produced Block has no default view for a Program root.
export const q = Program.makeElement({ block: HeadlessBlock, container: document.body })
export const embedA: Parameters<typeof a.embedView>[0] = null! as never
