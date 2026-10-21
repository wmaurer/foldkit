import { Context, Effect, Layer, Option, Schema } from 'effect'
import * as Block from 'foldkit-proto/block'
import { defineMessageUnion } from 'foldkit-proto/message'
import type { Element as ElementProgram } from 'foldkit-proto/program'
import type * as Update from 'foldkit-proto/update'

const WarmupModel = Schema.Struct({ value: Schema.Number })
const WarmupMessage = defineMessageUnion({ CompletedWarmup: {} })

// oxlint-disable-next-line effecttsgo/floating-effect
Effect.void
Layer.empty
Option.none()
Block.makeDefinition('Application', {
  Model: WarmupModel,
  Message: WarmupMessage,
})
Context.Service
Block.makeDefinition('TypePerformanceWarmup', {
  Model: WarmupModel,
  Message: WarmupMessage,
})

export type WarmupStep = Update.Step<
  typeof WarmupModel.Type,
  typeof WarmupMessage.Type
>
export type WarmupElement = ElementProgram
