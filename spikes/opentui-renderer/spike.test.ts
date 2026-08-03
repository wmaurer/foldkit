import { describe, expect, test } from 'bun:test'

import {
  type TestRendererSetup,
  createTestRenderer,
} from '@opentui/core/testing'

import { box, comment, keyedSpan, keyedText, span, text } from './src/h.js'
import { type TuiRoot, createRoot } from './src/mount.js'
import { type TuiNode, TuiSpan, TuiText } from './src/nodes.js'
import { childNodes } from './src/opentuiDomApi.js'

const setup = async (): Promise<TestRendererSetup & { root: TuiRoot }> => {
  const harness = await createTestRenderer({ width: 40, height: 10 })
  return { ...harness, root: createRoot(harness.renderer) }
}

/** The visible frame, trimmed to non-empty lines. */
const screen = (harness: TestRendererSetup): Array<string> =>
  harness
    .captureCharFrame()
    .split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.length > 0)

const childrenOf = (node: TuiNode): Array<TuiNode> => childNodes(node)

const labels = (items: Array<string>) =>
  box(
    { flexDirection: 'column' },
    items.map(item => keyedText(item, {}, [item])),
  )

describe('snabbdom patching an OpenTUI renderable tree', () => {
  test('mounts a tree and paints it', async () => {
    const harness = await setup()
    harness.root.render(
      box({ flexDirection: 'column' }, [
        text({}, ['hello']),
        text({}, ['terminal']),
      ]),
    )
    await harness.renderOnce()

    expect(screen(harness)).toEqual(['hello', 'terminal'])
  })

  test('patches text in place without recreating the renderable', async () => {
    const harness = await setup()
    harness.root.render(
      box({ flexDirection: 'column' }, [text({}, ['before'])]),
    )
    await harness.renderOnce()

    const before = childrenOf(harness.root.rootElement())[0]!

    harness.root.render(box({ flexDirection: 'column' }, [text({}, ['after'])]))
    await harness.renderOnce()

    const after = childrenOf(harness.root.rootElement())[0]!

    expect(screen(harness)).toEqual(['after'])
    expect(after).toBe(before)
    expect(after).toBeInstanceOf(TuiText)
  })

  test('reorders keyed children by moving renderables, not rebuilding them', async () => {
    const harness = await setup()
    harness.root.render(labels(['a', 'b', 'c']))
    await harness.renderOnce()

    const original = childrenOf(harness.root.rootElement())
    expect(screen(harness)).toEqual(['a', 'b', 'c'])

    harness.root.render(labels(['c', 'a', 'b']))
    await harness.renderOnce()

    const reordered = childrenOf(harness.root.rootElement())

    expect(screen(harness)).toEqual(['c', 'a', 'b'])
    // Same three instances, permuted. The whole point of keyed diffing.
    expect(reordered).toEqual([original[2]!, original[0]!, original[1]!])
  })

  test('inserts into the middle of a keyed list', async () => {
    const harness = await setup()
    harness.root.render(labels(['a', 'c']))
    await harness.renderOnce()
    const [a, c] = childrenOf(harness.root.rootElement())

    harness.root.render(labels(['a', 'b', 'c']))
    await harness.renderOnce()

    const next = childrenOf(harness.root.rootElement())
    expect(screen(harness)).toEqual(['a', 'b', 'c'])
    expect(next[0]).toBe(a!)
    expect(next[2]).toBe(c!)
  })

  test('removes from the middle of a keyed list and destroys the renderable', async () => {
    const harness = await setup()
    harness.root.render(labels(['a', 'b', 'c']))
    await harness.renderOnce()
    const removed = childrenOf(harness.root.rootElement())[1]!

    harness.root.render(labels(['a', 'c']))
    await harness.renderOnce()

    expect(screen(harness)).toEqual(['a', 'c'])
    expect(childrenOf(harness.root.rootElement())).toHaveLength(2)
    expect(removed.parent).toBeNull()
    expect((removed as never as { isDestroyed: boolean }).isDestroyed).toBe(
      true,
    )
  })

  test('replaces a node when the element type changes', async () => {
    const harness = await setup()
    harness.root.render(box({ flexDirection: 'column' }, [text({}, ['leaf'])]))
    await harness.renderOnce()
    const leaf = childrenOf(harness.root.rootElement())[0]!

    harness.root.render(
      box({ flexDirection: 'column' }, [box({}, [text({}, ['nested'])])]),
    )
    await harness.renderOnce()

    const replacement = childrenOf(harness.root.rootElement())[0]!
    expect(screen(harness)).toEqual(['nested'])
    expect(replacement).not.toBe(leaf)
    expect(leaf.parent).toBeNull()
  })

  test('applies and removes props through the module hooks', async () => {
    const harness = await setup()
    harness.root.render(
      box({ flexDirection: 'column', border: true, width: 20, height: 4 }, [
        text({}, ['boxed']),
      ]),
    )
    await harness.renderOnce()

    const bordered = screen(harness)
    expect(bordered[0]).toContain('─')
    expect(bordered.some(line => line.includes('boxed'))).toBe(true)

    harness.root.render(
      box({ flexDirection: 'column', width: 20, height: 4 }, [
        text({}, ['boxed']),
      ]),
    )
    await harness.renderOnce()

    expect(screen(harness)).toEqual(['boxed'])
  })

  test('keeps sibling arithmetic correct across a comment node', async () => {
    const harness = await setup()
    harness.root.render(
      box({ flexDirection: 'column' }, [
        text({}, ['first']),
        comment('placeholder'),
        text({}, ['third']),
      ]),
    )
    await harness.renderOnce()

    expect(screen(harness)).toEqual(['first', 'third'])

    harness.root.render(
      box({ flexDirection: 'column' }, [
        text({}, ['first']),
        comment('placeholder'),
        text({}, ['second']),
        text({}, ['third']),
      ]),
    )
    await harness.renderOnce()

    expect(screen(harness)).toEqual(['first', 'second', 'third'])
    expect(childrenOf(harness.root.rootElement())).toHaveLength(4)
  })

  test('nests inline styled spans inside a text element', async () => {
    const harness = await setup()
    harness.root.render(
      box({ flexDirection: 'column' }, [
        text({}, [
          'status: ',
          span({ fg: '#22c55e' }, ['ok']),
          ' / ',
          span({ fg: '#ef4444' }, ['fail']),
        ]),
      ]),
    )
    await harness.renderOnce()

    expect(screen(harness)).toEqual(['status: ok / fail'])
  })

  test('patches a span in place, keeping the text-node instance', async () => {
    const harness = await setup()
    const view = (label: string, color: string) =>
      box({ flexDirection: 'column' }, [
        text({}, ['status: ', span({ fg: color }, [label])]),
      ])

    harness.root.render(view('ok', '#22c55e'))
    await harness.renderOnce()

    const textElement = childrenOf(harness.root.rootElement())[0]!
    const before = childrenOf(textElement)[1]!
    expect(before).toBeInstanceOf(TuiSpan)

    harness.root.render(view('fail', '#ef4444'))
    await harness.renderOnce()

    const after = childrenOf(childrenOf(harness.root.rootElement())[0]!)[1]!

    expect(screen(harness)).toEqual(['status: fail'])
    expect(after).toBe(before)
  })

  test('reorders spans within a text element', async () => {
    const harness = await setup()
    const view = (parts: Array<string>) =>
      box({ flexDirection: 'column' }, [
        text(
          {},
          parts.map(part => keyedSpan(part, {}, [part])),
        ),
      ])

    harness.root.render(view(['one', 'two', 'three']))
    await harness.renderOnce()
    expect(screen(harness)).toEqual(['onetwothree'])

    harness.root.render(view(['three', 'one', 'two']))
    await harness.renderOnce()
    expect(screen(harness)).toEqual(['threeonetwo'])
  })

  // This permutation is the one that drives snabbdom's "moved right" branch,
  // the only branch that anchors an insertion on `api.nextSibling`. It is the
  // sole coverage for that method against OpenTUI's text-node tree.
  test('anchors a moved span on its next sibling', async () => {
    const harness = await setup()
    const view = (parts: Array<string>) =>
      box({ flexDirection: 'column' }, [
        text(
          {},
          parts.map(part => keyedSpan(part, {}, [part])),
        ),
      ])

    harness.root.render(view(['one', 'two', 'three', 'four']))
    await harness.renderOnce()
    expect(screen(harness)).toEqual(['onetwothreefour'])

    harness.root.render(view(['two', 'three', 'one', 'four']))
    await harness.renderOnce()
    expect(screen(harness)).toEqual(['twothreeonefour'])
  })

  test('rejects text outside a text element', async () => {
    const harness = await setup()

    expect(() =>
      harness.root.render(box({ flexDirection: 'column' }, ['bare string'])),
    ).toThrow(/Text must live inside a <text> element/)
  })

  test('survives a churn of renders', async () => {
    const harness = await setup()
    const rows = ['a', 'b', 'c', 'd', 'e']

    for (let step = 0; step < rows.length; step++) {
      harness.root.render(labels(rows.slice(0, step + 1)))
      await harness.renderOnce()
    }
    expect(screen(harness)).toEqual(rows)

    for (let step = 0; step < rows.length; step++) {
      harness.root.render(
        labels(
          rows
            .slice()
            .reverse()
            .slice(0, step + 1),
        ),
      )
      await harness.renderOnce()
    }
    expect(screen(harness)).toEqual(rows.slice().reverse())
  })
})
