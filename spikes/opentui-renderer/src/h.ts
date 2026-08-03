import { h as snabbdomH } from '../../../packages/foldkit/src/snabbdom/h.js'
import {
  type Key,
  type VNode,
  type VNodeData,
  VNodeDataMask,
  vnodeDataMaskKey,
} from '../../../packages/foldkit/src/snabbdom/vnode.js'

// A terminal element vocabulary, standing in for Foldkit's `HtmlBuilder`.
// `box` and `text` are enough to exercise every branch of the patch algorithm.

export type TuiProps = Record<string, unknown>
export type Children = Array<VNode | string>

const data = (props: TuiProps, key?: Key): VNodeData => ({
  props,
  ...(key === undefined ? {} : { key }),
  [vnodeDataMaskKey]: VNodeDataMask.Props,
})

export const box = (props: TuiProps, children: Children = []): VNode =>
  snabbdomH('box', data(props), children)

export const text = (props: TuiProps, children: Children = []): VNode =>
  snabbdomH('text', data(props), children)

export const span = (props: TuiProps, children: Children = []): VNode =>
  snabbdomH('span', data(props), children)

export const keyedBox = (
  key: Key,
  props: TuiProps,
  children: Children = [],
): VNode => snabbdomH('box', data(props, key), children)

export const keyedText = (
  key: Key,
  props: TuiProps,
  children: Children = [],
): VNode => snabbdomH('text', data(props, key), children)

export const comment = (value: string): VNode =>
  snabbdomH('!', {}, value as unknown as Children)

export const keyedSpan = (
  key: Key,
  props: TuiProps,
  children: Children = [],
): VNode => snabbdomH('span', data(props, key), children)
