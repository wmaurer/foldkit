import type { CliRenderer } from '@opentui/core'

import { init } from '../../../packages/foldkit/src/snabbdom/init.js'
import type { VNode } from '../../../packages/foldkit/src/snabbdom/vnode.js'
import { tuiLifecycleModule, tuiPropsModule } from './modules.js'
import { TuiBox, type TuiNode } from './nodes.js'
import { createOpenTuiDomApi } from './opentuiDomApi.js'

export type TuiRoot = Readonly<{
  render: (vnode: VNode) => void
  /** The live renderable for the view root, after the most recent render. */
  rootElement: () => TuiNode
}>

/** Mirrors Foldkit's `vdom.ts` setup, with the terminal DOMAPI and modules
 *  swapped in for the browser ones. As in Foldkit, the first patch replaces the
 *  mount element with the view root. */
export const createRoot = (renderer: CliRenderer): TuiRoot => {
  const api = createOpenTuiDomApi(renderer.root.ctx)
  const patch = init([tuiPropsModule, tuiLifecycleModule], api)

  const mountPoint = new TuiBox(renderer.root.ctx, { flexGrow: 1 })
  renderer.root.add(mountPoint)

  let current: VNode | undefined

  return {
    rootElement: () => {
      if (current === undefined) {
        return mountPoint
      }
      return current.elm as unknown as TuiNode
    },
    render: (vnode: VNode): void => {
      current =
        current === undefined
          ? patch(mountPoint as never, vnode)
          : patch(current, vnode)
      renderer.root.requestRender()
    },
  }
}
