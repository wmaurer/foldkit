// Usage: node measure.mjs <typescript package dir> <this dir>
// Counts instantiations while checking ONLY a consumer file, so the producing
// module is typed only as far as the consumer demands.
import { createRequire } from 'node:module'
import fs from 'node:fs'
const require = createRequire(process.argv[2] + '/package.json')
const ts = require(process.argv[2])
const dir = process.argv[3]
const variants = ['noBlock', 'eager', 'prototype', 'candidateMethod', 'candidateInferred']
const consumers = {
  modelOnly: v => `import { TheBlock } from './${v}.js'\nexport type M = typeof TheBlock.Model\nexport const m: M['Type'] = { count: 1, label: '', items: [] }\n`,
  initRead: v => `import { TheBlock } from './${v}.js'\nexport type I = ReturnType<typeof TheBlock.init>\n`,
  binding: v => `import { Schema } from 'effect'\nimport * as Block from 'foldkit/block'\nimport * as Message from 'foldkit/message'\nimport { TheBlock } from './${v}.js'\nconst P = Block.makeDefinition('Parent', { Model: Schema.Struct({ child: TheBlock.Model }), Message: Message.defineMessageUnion({ Noted: {} }) })\nexport const ChildBinding = P.makeBinding(TheBlock, { field: 'child' })\n`,
}
const options = { strict: true, exactOptionalPropertyTypes: true, noEmit: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'], types: [] }
console.log('typescript', ts.version)
for (const [consumerName, source] of Object.entries(consumers)) {
  for (const variant of variants) {
    if (consumerName !== 'modelOnly' && variant === 'noBlock') continue
    const file = `${dir}/consumer.${consumerName}.${variant}.ts`
    fs.writeFileSync(file, source(variant))
    const program = ts.createProgram([file], options)
    const checker = program.getTypeChecker()
    const start = performance.now()
    const diagnostics = program.getSemanticDiagnostics(program.getSourceFile(file))
    const ms = performance.now() - start
    console.log(consumerName.padEnd(10), variant.padEnd(18), 'instantiations', String(checker.getInstantiationCount()).padStart(8), 'types', String(checker.getTypeCount()).padStart(7), `${ms.toFixed(0)}ms`.padStart(7), 'diags', diagnostics.length, diagnostics.slice(0, 1).map(d => ts.flattenDiagnosticMessageText(d.messageText, ' ').slice(0, 120)).join(''))
  }
}
