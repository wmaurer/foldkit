import * as Program from 'foldkit/program'
import { BadForeign, BadSameId, BadNever, BadAny, BadErased, BadViewDeclaredHeadless, BadHeadlessDeclaredView, BadNotFunction } from './rejected.js'

export const r1 = Program.makeElement({ block: BadForeign, container: document.body })
export const r2 = Program.makeElement({ block: BadSameId, container: document.body })
export const r3 = Program.makeElement({ block: BadNever, container: document.body })
export const r4 = Program.makeElement({ block: BadAny, container: document.body })
export const r5 = Program.makeElement({ block: BadErased, container: document.body })
export const r6 = Program.makeElement({ block: BadViewDeclaredHeadless, container: document.body })
export const r7 = Program.makeElement({ block: BadHeadlessDeclaredView, container: document.body })
export const r8 = Program.makeElement({ block: BadNotFunction, container: document.body })
