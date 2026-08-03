import {
  type RenderContext,
  type Renderable,
  TextNodeRenderable,
} from '@opentui/core'

import type { DOMAPI } from '../../../packages/foldkit/src/snabbdom/htmldomapi.js'
import {
  TuiBox,
  TuiComment,
  type TuiNode,
  TuiSpan,
  TuiText,
  TuiTextNode,
  isRootTextNode,
  isTextTreeNode,
  isTuiComment,
  isTuiElement,
  isTuiTextNode,
} from './nodes.js'

// A snabbdom DOMAPI backed by OpenTUI's Renderable tree.
//
// The whole shim is these ~16 methods. Everything snabbdom does (create,
// insert, move, remove, diff) flows through here, so if this is enough to run
// Foldkit's real patch algorithm, the renderer question is answered.

/** The child list under a node, addressed the way the caller wrote it.
 *
 * In @opentui/core 0.5.0 `TextRenderable` overrides `add`/`remove`/
 * `insertBefore` to route into its internal text-node tree, but does *not*
 * override `getChildren()`. That still reports the renderable-tree children,
 * which for a `<text>` are always none. So `textElement.getChildren()` is
 * empty while the text plainly renders. (The override exists on `main` in the
 * OpenTUI checkout, so this is version-specific.)
 *
 * The DOMAPI below dodges this by accident: `nextSibling` reads `node.parent`,
 * which for anything inside a `<text>` is the internal
 * `RootTextNodeRenderable`, whose `getChildren()` works correctly. Nothing ever
 * asks a `TuiText` for its children during a patch. This helper exists for
 * callers outside the patch loop (tests, debugging, anything introspecting the
 * tree) where the asymmetry is a live trap. */
export const childNodes = (container: unknown): Array<TuiNode> => {
  if (container instanceof TuiText) {
    return container.textNode.children as Array<TuiNode>
  }
  if (container instanceof TextNodeRenderable) {
    return container.children as Array<TuiNode>
  }
  return (container as Renderable).getChildren() as unknown as Array<TuiNode>
}

const requireTextParent = (parent: TuiNode, child: TuiNode): void => {
  if (!isTextTreeNode(child)) {
    return
  }
  if (parent instanceof TuiText || parent instanceof TuiSpan) {
    return
  }
  throw new Error(
    `Text must live inside a <text> element; got <${parent.nodeName}>. ` +
      'OpenTUI has no free-floating text renderable.',
  )
}

export const createOpenTuiDomApi = (ctx: RenderContext): DOMAPI => {
  const api = {
    createElement(tagName: string): TuiNode {
      if (tagName === 'box') {
        return new TuiBox(ctx)
      }
      if (tagName === 'text') {
        return new TuiText(ctx)
      }
      if (tagName === 'span') {
        return new TuiSpan()
      }
      throw new Error(`Unknown terminal element: <${tagName}>`)
    },

    createElementNS(): never {
      throw new Error('Namespaced elements have no terminal equivalent')
    },

    createTextNode(text: string): TuiTextNode {
      return new TuiTextNode(text)
    },

    createComment(text: string): TuiComment {
      return new TuiComment(ctx, text)
    },

    appendChild(parent: TuiNode, child: TuiNode): void {
      requireTextParent(parent, child)
      ;(parent as unknown as Renderable).add(child)
    },

    insertBefore(
      parent: TuiNode,
      child: TuiNode,
      reference: TuiNode | null,
    ): void {
      requireTextParent(parent, child)
      if (reference === null) {
        ;(parent as unknown as Renderable).add(child)
        return
      }
      ;(parent as unknown as Renderable).insertBefore(child, reference)
    },

    removeChild(parent: TuiNode, child: TuiNode): void {
      ;(parent as unknown as Renderable).remove(child)
    },

    parentNode(node: TuiNode): TuiNode | null {
      const parent = node.parent
      if (parent === null || parent === undefined) {
        return null
      }
      // Unwrap the internal RootTextNodeRenderable back to its `text` element,
      // so snabbdom sees the tree shape it built rather than OpenTUI's.
      if (isRootTextNode(parent)) {
        return parent.textParent as unknown as TuiNode
      }
      return parent as unknown as TuiNode
    },

    nextSibling(node: TuiNode): TuiNode | null {
      const parent = node.parent
      if (parent === null || parent === undefined) {
        return null
      }
      const siblings = childNodes(parent)
      const index = siblings.indexOf(node)
      if (index === -1) {
        return null
      }
      return (siblings[index + 1] as TuiNode | undefined) ?? null
    },

    tagName(node: TuiNode): string {
      return node.nodeName
    },

    setTextContent(node: TuiNode, text: string | null): void {
      const value = text ?? ''
      if (isTuiTextNode(node)) {
        node.data = value
        return
      }
      if (node instanceof TuiText) {
        node.content = value
        return
      }
      if (value === '') {
        // Snabbdom clears text on a childless element; nothing to do for a box.
        return
      }
      throw new Error(
        `Cannot set text on <${node.nodeName}>; wrap it in a <text> element.`,
      )
    },

    getTextContent(node: TuiNode): string | null {
      if (isTuiTextNode(node)) {
        return node.data
      }
      if (node instanceof TuiText) {
        return node.content.toString()
      }
      return null
    },

    isElement: (node: TuiNode): boolean => isTuiElement(node),
    isText: (node: TuiNode): boolean => isTuiTextNode(node),
    isComment: (node: TuiNode): boolean => isTuiComment(node),
  }

  // The DOMAPI interface is typed in DOM terms (HTMLElement, Text, Comment,
  // Node). Nothing here is a DOM node, so the boundary needs one cast. See
  // README.md. This is the one thing that cannot be fixed from outside
  // Foldkit.
  return api as unknown as DOMAPI
}
