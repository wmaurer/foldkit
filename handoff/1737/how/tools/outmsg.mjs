import fs from 'node:fs'
import path from 'node:path'
const root = process.argv[2]
const sites = fs.readFileSync(0, 'utf8').trim().split('\n').map(JSON.parse)
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'node_modules' ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.ts') ? [path.join(d, e.name)] : [])
const cache = new Map()
const filesNear = file => {
  // search up to package src root
  let dir = path.dirname(path.join(root, file))
  const parts = []
  for (let k = 0; k < 4; k++) { parts.push(dir); dir = path.dirname(dir) }
  return parts
}
const findDecl = (name, file) => {
  for (const dir of filesNear(file)) {
    const files = cache.get(dir) ?? walk(dir); cache.set(dir, files)
    // prefer same file first
    const ordered = [path.join(root, file), ...files]
    for (const f of ordered) {
      const src = fs.readFileSync(f, 'utf8')
      const re = new RegExp(`(?:const|let)\\s+${name}\\s*(?::[^=]+)?=\\s*([\\s\\S]{0,600})`)
      const m = src.match(re)
      if (m) return { f, rhs: m[1].split(/\n(?:export )?(?:const|let|type|function) |\n\n/)[0] }
    }
  }
}
const configHasOutMessage = rhs => {
  const idx = rhs.indexOf('makeDefinition(')
  if (idx < 0) return undefined
  // take until matching paren
  let i = idx + 'makeDefinition('.length, d = 1
  while (d > 0 && i < rhs.length) { if (rhs[i] === '(') d++; else if (rhs[i] === ')') d--; i++ }
  const cfg = rhs.slice(idx, i)
  return /\bOutMessage\b\s*[:,}\n]/.test(cfg.replace(/OutMessage\?/, ''))
}
for (const s of sites) {
  let result = '?'
  const recv = s.receiver
  const d1 = findDecl(recv, s.file)
  if (d1) {
    if (d1.rhs.includes('makeDefinition(')) result = configHasOutMessage(d1.rhs)
    else {
      const m = d1.rhs.match(/^\s*([A-Za-z_$][\w$]*)\s*\.makeComposition/)
      if (m) { const d2 = findDecl(m[1], s.file); if (d2) result = configHasOutMessage(d2.rhs) }
    }
  }
  const hasView = s.keys.includes('view')
  console.log([s.file + ':' + s.line, recv, 'outMessage=' + result, 'view=' + (s.keys[0]?.startsWith('<') ? '?' : hasView), 'keys=' + s.keys.join(',')].join('\t'))
}
