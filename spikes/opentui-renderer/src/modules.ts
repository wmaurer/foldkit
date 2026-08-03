import type { Renderable } from '@opentui/core'

import type { Module } from '../../../packages/foldkit/src/snabbdom/module.js'
import {
  type VNode,
  VNodeDataMask,
} from '../../../packages/foldkit/src/snabbdom/vnode.js'
import type { TuiNode } from './nodes.js'

// The terminal replacement for snabbdom's attributes/class/style modules.
// OpenTUI renderables expose plain property setters that call requestRender()
// internally, so applying a prop is just an assignment, the same thing
// @opentui/react's setInitialProperties does.

type TuiProps = Record<string, unknown>

const applyProps = (oldVnode: VNode, vnode: VNode): void => {
  const element = vnode.elm as unknown as Renderable
  const oldProps = (oldVnode.data?.props ?? {}) as TuiProps
  const props = (vnode.data?.props ?? {}) as TuiProps

  if (oldProps === props) {
    return
  }

  for (const key in oldProps) {
    if (!(key in props)) {
      ;(element as unknown as TuiProps)[key] = undefined
    }
  }

  for (const key in props) {
    if (props[key] !== oldProps[key]) {
      ;(element as unknown as TuiProps)[key] = props[key]
    }
  }
}

export const tuiPropsModule: Module = {
  dataMask: VNodeDataMask.Props,
  create: applyProps,
  update: applyProps,
}

// Renderables own native resources, so a removed subtree has to be destroyed,
// not just detached. Snabbdom's `destroy` hook fires *before* the node is
// unlinked from its parent, so destroying there would pull the node out from
// under the removal. Collecting into a queue and flushing in `post`, after the
// whole patch has committed, gives the same guarantee @opentui/react gets from
// `detachDeletedInstance`.

const pendingDestroy: Array<TuiNode> = []

export const tuiLifecycleModule: Module = {
  destroy(vnode: VNode): void {
    if (vnode.elm !== undefined) {
      pendingDestroy.push(vnode.elm as unknown as TuiNode)
    }
  },
  post(): void {
    while (pendingDestroy.length > 0) {
      const node = pendingDestroy.pop()!
      if (node.parent === null || node.parent === undefined) {
        node.destroyRecursively()
      }
    }
  },
}
