import { Program } from 'foldkit'
import type { Block } from 'foldkit'

import { ViewlessBlock } from './produced-block-block.js'
import { ParentDefinition } from './produced-block-definition.js'
import {
  AnyProducerBlock,
  AnyResultBlock,
  EnrichedBlock,
  ErasedBlock,
  ForeignBlock,
  MissingViewBlock,
  NeverBlock,
  NotFunctionBlock,
  ParameterBlock,
  SameIdBlock,
  UnexpectedViewBlock,
} from './produced-block-invalid.js'

// @ts-expect-error A Block assembled from a Definition with another id does not bind.
ParentDefinition.makeBinding(ForeignBlock, { field: 'child' })
// @ts-expect-error A Block with the same id and another Model does not bind.
ParentDefinition.makeBinding(SameIdBlock, { field: 'child' })
// @ts-expect-error A never producer types no Block.
ParentDefinition.makeBinding(NeverBlock, { field: 'child' })
// @ts-expect-error An erased implementation completes no Block.
ParentDefinition.makeBinding(ErasedBlock, { field: 'child' })
// @ts-expect-error A completed Block is not a producer function.
ParentDefinition.makeBinding(NotFunctionBlock, { field: 'child' })
// @ts-expect-error A producer cannot require a parameter.
ParentDefinition.makeBinding(ParameterBlock, { field: 'child' })
// @ts-expect-error An any producer types no Block.
ParentDefinition.makeBinding(AnyProducerBlock, { field: 'child' })
// @ts-expect-error A producer that returns any types no Block.
ParentDefinition.makeBinding(AnyResultBlock, { field: 'child' })
// @ts-expect-error A producer cannot add members to the completed Block.
ParentDefinition.makeBinding(EnrichedBlock, { field: 'child' })
// @ts-expect-error produceBlock requires a Block with a default view.
ParentDefinition.makeBinding(MissingViewBlock, { field: 'child' })
// @ts-expect-error produceViewlessBlock requires a Block without a default view.
ParentDefinition.makeBinding(UnexpectedViewBlock, { field: 'child' })
// @ts-expect-error A Block from another Definition is not an AnyBlock.
export const foreignAsAnyBlock: Block.AnyBlock = ForeignBlock
// @ts-expect-error A viewless produced Block cannot be a Program root.
Program.makeElement({ block: ViewlessBlock, container: document.body })
// @ts-expect-error A Block from another Definition cannot be a Program root.
Program.makeElement({ block: ForeignBlock, container: document.body })
