import { createTestRenderer } from '@opentui/core/testing'

import { box, keyedText, text } from './src/h.js'
import { createRoot } from './src/mount.js'

const harness = await createTestRenderer({ width: 34, height: 9 })
const root = createRoot(harness.renderer)

const show = async (title: string) => {
  await harness.renderOnce()
  const frame = harness
    .captureCharFrame()
    .split('\n')
    .map(line => `  │${line.padEnd(34).slice(0, 34)}│`)
    .join('\n')
  console.log(
    `\n${title}\n  ┌${'─'.repeat(34)}┐\n${frame}\n  └${'─'.repeat(34)}┘`,
  )
}

const list = (items: Array<string>, title: string) =>
  box({ flexDirection: 'column', border: true, width: 24, height: 7 }, [
    text({ fg: '#7dd3fc' }, [title]),
    ...items.map(item => keyedText(item, {}, [`  • ${item}`])),
  ])

root.render(list(['alpha', 'beta', 'gamma'], 'todo'))
await show('1. initial mount')

root.render(list(['gamma', 'alpha', 'beta'], 'todo'))
await show('2. keyed reorder (gamma to front)')

root.render(list(['gamma', 'beta'], 'todo, one down'))
await show('3. remove from middle + text patch')

harness.renderer.destroy()
