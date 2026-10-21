import { UiComposition } from './composition'
import { UiDefinition } from './definition'
import { init } from './init'
import { update } from './update'
import { view } from './view'

const assembleUiBlock = () =>
  UiComposition.assembleBlock({
    init,
    update,
    view,
  })

export const UiBlock = UiDefinition.produceBlock(assembleUiBlock)
