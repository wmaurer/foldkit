import { Layer } from 'effect'
import type { Block } from 'foldkit'
import { Ok, OwnDef, assembleOwn } from './enriched-base.js'
void Ok
type Test = Readonly<{ run: () => number }>
const produced = OwnDef.produceBlock(assembleOwn)
export const Enriched = Object.assign(produced, { test: { run: () => 1 } satisfies Test })
export type Keeps = typeof Enriched extends Block.AnyBlock ? 'AnyBlock' : 'broken'
export const keeps: 'AnyBlock' = null! as Keeps
export const hasExtra: Test = Enriched.test
export const replaced = Enriched.replaceEffectsLayer(Layer.empty)
