import { Program } from 'foldkit'

import { HeadlessBlock } from './produce-block-block.js'
import { ParentDefinition } from './produce-block-definition.js'
import {
  Any,
  Erased,
  Foreign,
  HeadlessButView,
  Never,
  NotFunction,
  OutTwin,
  SameId,
  SameModel,
  ViewButHeadless,
  WithParameter,
} from './produce-block-invalid.js'

// @ts-expect-error A Block from a Definition with another id does not bind.
ParentDefinition.makeBinding(Foreign, { field: 'child' })
// @ts-expect-error Another id with the same Model is still another Definition.
ParentDefinition.makeBinding(SameModel, { field: 'child' })
// @ts-expect-error The same id with another Model does not bind.
ParentDefinition.makeBinding(SameId, { field: 'child' })
// @ts-expect-error The Definition declares no OutMessage and the Block has one.
ParentDefinition.makeBinding(OutTwin, { field: 'child' })
// @ts-expect-error A never producer is not a Block.
ParentDefinition.makeBinding(Never, { field: 'child' })
// @ts-expect-error A Block is not a producer function.
ParentDefinition.makeBinding(NotFunction, { field: 'child' })
// @ts-expect-error A producer may not require arguments.
ParentDefinition.makeBinding(WithParameter, { field: 'child' })
// @ts-expect-error An any producer proves nothing about the Block.
ParentDefinition.makeBinding(Any, { field: 'child' })
// @ts-expect-error An erased implementation completes no Block.
ParentDefinition.makeBinding(Erased, { field: 'child' })
// @ts-expect-error produceBlock needs a Block with a default view.
ParentDefinition.makeBinding(ViewButHeadless, { field: 'child' })
// @ts-expect-error produceHeadlessBlock needs a Block without a default view.
ParentDefinition.makeBinding(HeadlessButView, { field: 'child' })
// @ts-expect-error A headless Block has no default view for a Program root.
Program.makeElement({ block: HeadlessBlock, container: document.body })
// @ts-expect-error A foreign produced Block is not a Program root.
Program.makeElement({ block: Foreign, container: document.body })
