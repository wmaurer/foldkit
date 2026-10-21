import { Block } from 'foldkit'
import * as Program from 'foldkit/program'

import { ChildBinding, ParentBlock } from './parentblock.js'

export const roots: ReadonlyArray<Block.AnyBlock> = [ParentBlock]
export const app = Program.makeElement({ block: ParentBlock, container: document.body })
export const embed = ChildBinding.embedView
