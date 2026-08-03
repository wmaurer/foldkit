import {
  type BoxOptions,
  BoxRenderable,
  type RenderContext,
  RootTextNodeRenderable,
  TextNodeRenderable,
  type TextOptions,
  TextRenderable,
} from '@opentui/core'

// Snabbdom's `createElm` reaches past the DOMAPI in exactly one place: it calls
// `element.setAttribute('id' | 'class', ...)` directly when the selector carries
// a `#` or `.`. Every node class below carries a `setAttribute` shim so that
// path does not explode, plus a `nodeName` for `api.tagName`.
//
// The backing store is `domAttributes`, not `attributes`: OpenTUI already uses
// `attributes` on TextRenderable and TextNodeRenderable for the text style
// bitmask (bold/italic/underline). The DOM vocabulary and the terminal
// vocabulary collide on the name, and the terminal one was there first.

let nextNodeId = 0
const makeId = (tag: string): string => `${tag}-${nextNodeId++}`

export type TuiAttributes = Map<string, string>

export class TuiBox extends BoxRenderable {
  public readonly nodeName = 'box'
  public readonly domAttributes: TuiAttributes = new Map()

  constructor(ctx: RenderContext, options: Partial<BoxOptions> = {}) {
    super(ctx, { id: makeId('box'), ...options } as BoxOptions)
  }

  setAttribute(name: string, value: string): void {
    this.domAttributes.set(name, value)
  }

  getAttribute(name: string): string | null {
    return this.domAttributes.get(name) ?? null
  }
}

export class TuiText extends TextRenderable {
  public readonly nodeName = 'text'
  public readonly domAttributes: TuiAttributes = new Map()

  constructor(ctx: RenderContext, options: Partial<TextOptions> = {}) {
    super(ctx, { id: makeId('text'), ...options } as TextOptions)
  }

  setAttribute(name: string, value: string): void {
    this.domAttributes.set(name, value)
  }

  getAttribute(name: string): string | null {
    return this.domAttributes.get(name) ?? null
  }
}

// An inline styled run, e.g. `<span fg="red">`. OpenTUI models these as
// TextNodeRenderables, a tree that is separate from the Renderable tree and can
// only hang off a `text` element.
export class TuiSpan extends TextNodeRenderable {
  public readonly nodeName = 'span'
  public readonly domAttributes: TuiAttributes = new Map()

  constructor() {
    super({ id: makeId('span') })
  }

  setAttribute(name: string, value: string): void {
    this.domAttributes.set(name, value)
  }

  getAttribute(name: string): string | null {
    return this.domAttributes.get(name) ?? null
  }
}

// A DOM text node. OpenTUI only allows these under a `text` renderable, which
// the DOMAPI enforces in `appendChild` / `insertBefore`.
export class TuiTextNode extends TextNodeRenderable {
  public readonly nodeName = '#text'

  constructor(text: string) {
    super({ id: makeId('#text') })
    this.children = [text]
  }

  get data(): string {
    const first = this.children[0]
    return typeof first === 'string' ? first : ''
  }

  set data(text: string) {
    this.children = [text]
  }
}

// A DOM comment node. OpenTUI has no equivalent, so this is a zero-size
// invisible box: it holds a position in the child list (which snabbdom's
// `nextSibling` arithmetic depends on) and paints nothing.
export class TuiComment extends BoxRenderable {
  public readonly nodeName = '#comment'
  public data: string

  constructor(ctx: RenderContext, text: string) {
    super(ctx, {
      id: makeId('#comment'),
      width: 0,
      height: 0,
      visible: false,
    } as BoxOptions)
    this.data = text
  }

  setAttribute(): void {}
}

export type TuiElement = TuiBox | TuiText | TuiSpan
export type TuiNode = TuiElement | TuiTextNode | TuiComment

export const isTuiElement = (node: unknown): node is TuiElement =>
  node instanceof TuiBox || node instanceof TuiText || node instanceof TuiSpan

/** Nodes that live in OpenTUI's text-node tree rather than the renderable
 *  tree, and so may only hang off a `text` element or another such node. */
export const isTextTreeNode = (node: unknown): node is TuiSpan | TuiTextNode =>
  node instanceof TuiSpan || node instanceof TuiTextNode

export const isTuiTextNode = (node: unknown): node is TuiTextNode =>
  node instanceof TuiTextNode

export const isTuiComment = (node: unknown): node is TuiComment =>
  node instanceof TuiComment

export const isRootTextNode = (node: unknown): node is RootTextNodeRenderable =>
  node instanceof RootTextNodeRenderable
