import { spawn } from 'node:child_process'
import fs from 'node:fs'
const [tsc, dir, ...files] = process.argv.slice(2)
const runOnce = file => new Promise((resolve, reject) => {
  const child = spawn(tsc, ['--lsp', '--stdio'], { cwd: dir, stdio: ['pipe', 'pipe', 'inherit'] })
  let buffer = Buffer.alloc(0)
  let nextId = 1
  const pending = new Map()
  const send = message => {
    const body = Buffer.from(JSON.stringify({ jsonrpc: '2.0', ...message }))
    child.stdin.write(`Content-Length: ${body.length}\r\n\r\n`)
    child.stdin.write(body)
  }
  const request = (method, params) => new Promise(done => { const id = nextId++; pending.set(id, done); send({ id, method, params }) })
  child.stdout.on('data', chunk => {
    buffer = Buffer.concat([buffer, chunk])
    for (;;) {
      const headerEnd = buffer.indexOf('\r\n\r\n')
      if (headerEnd < 0) return
      const length = Number(/Content-Length: (\d+)/.exec(buffer.subarray(0, headerEnd).toString())[1])
      if (buffer.length < headerEnd + 4 + length) return
      const message = JSON.parse(buffer.subarray(headerEnd + 4, headerEnd + 4 + length).toString())
      buffer = buffer.subarray(headerEnd + 4 + length)
      if (message.id !== undefined && pending.has(message.id) && message.method === undefined) { pending.get(message.id)(message); pending.delete(message.id) }
      else if (message.method && message.id !== undefined) send({ id: message.id, result: null })
    }
  })
  ;(async () => {
    const uri = `file://${dir}/${file}`
    await request('initialize', { processId: process.pid, rootUri: `file://${dir}`, capabilities: { textDocument: { diagnostic: {} } }, workspaceFolders: [{ uri: `file://${dir}`, name: 'repro' }] })
    send({ method: 'initialized', params: {} })
    send({ method: 'textDocument/didOpen', params: { textDocument: { uri, languageId: 'typescript', version: 1, text: fs.readFileSync(`${dir}/${file}`, 'utf8') } } })
    const start = performance.now()
    const response = await request('textDocument/diagnostic', { textDocument: { uri } })
    const ms = performance.now() - start
    child.kill()
    resolve({ ms, items: response.result?.items?.map(item => `L${item.range.start.line + 1} ${item.message.slice(0, 70)}`) ?? response })
  })().catch(reject)
})
for (const file of files) {
  const samples = []
  let items
  for (let run = 0; run < 3; run++) { const result = await runOnce(file); samples.push(result.ms.toFixed(0)); items = result.items }
  console.log(file.padEnd(28), samples.join('/').padEnd(14), 'ms', JSON.stringify(items))
}
