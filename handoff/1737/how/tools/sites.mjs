import fs from 'node:fs'
import path from 'node:path'
const root = process.argv[2]
const list = fs.readFileSync(0, 'utf8').trim().split('\n')
const out = []
for (const entry of list) {
  const [file, lineStr] = entry.split(':')
  const src = fs.readFileSync(path.join(root, file), 'utf8')
  const lines = src.split('\n')
  const lineIdx = Number(lineStr) - 1
  let offset = lines.slice(0, lineIdx).join('\n').length + 1
  const callStart = src.indexOf('.assembleBlock(', offset)
  // receiver identifier
  let r = callStart - 1
  while (r >= 0 && /[\w$.]/.test(src[r])) r--
  const receiver = src.slice(r + 1, callStart)
  // statement prefix: from line start
  const lineStart = src.lastIndexOf('\n', callStart) + 1
  const prefix = src.slice(Math.max(0, lineStart - 200), callStart).split('\n').slice(-3).join(' | ').trim()
  // bracket match args
  let i = callStart + '.assembleBlock('.length
  let depth = 1
  const argStart = i
  while (depth > 0 && i < src.length) {
    const c = src[i]
    if (c === '(' || c === '{' || c === '[') depth++
    else if (c === ')' || c === '}' || c === ']') depth--
    else if (c === "'" || c === '"' || c === '`') {
      const q = c; i++
      while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++ }
    }
    i++
  }
  const args = src.slice(argStart, i - 1).trim()
  const after = src.slice(i, i + 80).split('\n')[0]
  // top-level keys
  const keys = []
  if (args.startsWith('{')) {
    let d = 0
    let tok = ''
    for (let k = 0; k < args.length; k++) {
      const c = args[k]
      if ('({['.includes(c)) { d++; if (d === 1) { tok = ''; continue } }
      if (')}]'.includes(c)) { d--; }
      if (d === 1) {
        if (c === ',' || c === '\n') { const t = tok.trim(); if (t) keys.push(t.split(/[:\s(]/)[0]); tok = '' }
        else tok += c
      }
    }
    const t = tok.trim(); if (t) keys.push(t.split(/[:\s(]/)[0])
  } else keys.push('<non-literal:' + args.slice(0, 40) + '>')
  out.push({ file, line: lineStr, receiver, prefix: prefix.slice(-140), keys: [...new Set(keys.filter(Boolean))], after: after.trim() })
}
for (const o of out) console.log(JSON.stringify(o))
