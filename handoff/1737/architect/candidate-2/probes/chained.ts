import { Array, Effect, Schema } from 'effect'
import * as Block from 'foldkit/block'
import { defineMessageUnion } from 'foldkit/message'

import type { Assert, Equal, MembersEqual } from './harness.js'

const Model = Schema.Struct({ contents: Schema.String })
const Message = defineMessageUnion({ SucceededSaveDocument: {}, ClickedSave: {} })
const EditorDefinition = Block.makeDefinition('Editor', { Model, Message })
const EditorComposition = EditorDefinition.makeComposition()
const SaveDocument = EditorDefinition.makeCommand('SaveDocument', {
  args: { contents: Schema.String },
  messages: [Message.SucceededSaveDocument],
})
const init = EditorComposition.makeInit((contents: string) => ({ model: { contents } }))
const update = EditorComposition.makeUpdate((model, message) =>
  Message.match(message, {
    ClickedSave: () => ({ model, commands: [SaveDocument({ contents: model.contents })] }),
    SucceededSaveDocument: () => ({ model }),
  }),
)
const EditorAssembled = EditorComposition.assembleBlock({ init, update, hostHandlers: [SaveDocument] })
const assembleEditor = () => EditorComposition.assembleBlock({ init, update, hostHandlers: [SaveDocument] })
export const EditorBlock = EditorDefinition.produceHeadlessBlock(assembleEditor)

const SaveDocumentLayer = Array.headNonEmpty(EditorBlock.hostHandlers).toLayer(
  Effect.succeed(() => Effect.succeed(EditorBlock.Message.SucceededSaveDocument())),
)
const provideEditorHandlers = () => EditorBlock.provideHandlers(SaveDocumentLayer)
export const ProvidedEditor = EditorDefinition.produceHeadlessBlock(provideEditorHandlers)
const ProvidedAssembled = EditorAssembled.provideHandlers(
  Array.headNonEmpty(EditorAssembled.hostHandlers).toLayer(
    Effect.succeed(() => Effect.succeed(EditorAssembled.Message.SucceededSaveDocument())),
  ),
)
export type C1 = Assert<MembersEqual<typeof EditorAssembled, typeof EditorBlock>>
export type C2 = Assert<Equal<keyof typeof EditorAssembled, keyof typeof EditorBlock>>
export type C3 = Assert<Equal<keyof typeof ProvidedAssembled, keyof typeof ProvidedEditor>>
export type C4 = Assert<MembersEqual<typeof ProvidedAssembled, typeof ProvidedEditor>>
export type C5 = Assert<Equal<typeof EditorAssembled.hostHandlers, typeof EditorBlock.hostHandlers>>
export const anyBlock: ReadonlyArray<Block.AnyBlock> = [EditorBlock, ProvidedEditor]
