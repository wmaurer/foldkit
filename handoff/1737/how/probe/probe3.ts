import { Schema } from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/node_modules/effect/dist/index.js'
import * as Block from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/src/block/public.ts'
import * as Message from '/tmp/claude-10604308/-home-mrwe1-office-begasoft-ch-projects-foldkit-foldkit/962e359b-1e5f-438a-81f8-73fb99a793e4/scratchpad/wt-base/packages/foldkit/src/message/public.ts'
const M = Schema.Struct({ a: Schema.String })
const Msg = Message.defineMessageUnion({ Clicked: {} })
const make = <Name extends string>(name: Name) => Block.makeNamespace(name).makeDefinition({ Model: M, Message: Msg })
type O = ReturnType<typeof make<'Q'>>['owner']
export const isFalse: O extends Block.Owner<'Q', false> ? true : false = true
export const notTrue: O extends Block.Owner<'Q', true> ? true : false = false
const makeLiteral = <A>() => Block.makeDefinition('Toastish', { Model: M, Message: Msg })
type O2 = ReturnType<typeof makeLiteral<number>>['owner']
export const literalTrue: O2 extends Block.Owner<'Toastish', true> ? true : false = true
