import { createRequire } from 'node:module'
const require = createRequire(process.argv[2])
const ts = require('typescript')
const fs = require('node:fs')
const dir = process.argv[3]
const options = { strict: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler }
const cases = {
  modelOnly: `import { Good } from './blocks2'\nexport const m: typeof Good.Model = { count: 1 }\n`,
  exactMember: `import { Good } from './blocks2'\nexport const bad: number = Good.impl.view().v3\n`,
  goodModelOnBadBlock: `import { Bad } from './blocks2'\nexport const m: typeof Bad.Model = { count: 1 }\n`,
}
for (const [name, source] of Object.entries(cases)) {
  const consumer = `${dir}/c2.${name}.ts`
  fs.writeFileSync(consumer, source)
  const program = ts.createProgram([consumer], options)
  const checker = program.getTypeChecker()
  const diagnostics = program.getSemanticDiagnostics(program.getSourceFile(consumer))
  console.log(name.padEnd(22), 'instantiations', String(checker.getInstantiationCount()).padStart(8), diagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, ' ')).join(' | ') || 'no diagnostics')
}
const program = ts.createProgram([`${dir}/blocks2.ts`], options)
const diagnostics = program.getSemanticDiagnostics(program.getSourceFile(`${dir}/blocks2.ts`))
console.log('blocks2.ts diagnostics:', diagnostics.map(d => `line ${d.file.getLineAndCharacterOfPosition(d.start).line + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`))
