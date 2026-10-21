import { createRequire } from 'node:module'
const require = createRequire(process.argv[2])
const ts = require('typescript')
const dir = process.argv[3]
const variants = ['NoBlock', 'Eager', 'ThunkUnconstrained', 'ThunkConstrained', 'ThunkContextual']
const fs = require('node:fs')
console.log('typescript', ts.version)
for (const variant of variants) {
  const consumer = `${dir}/consumer.${variant}.ts`
  fs.writeFileSync(consumer, `import { ${variant} } from './blocks'\nexport type M = typeof ${variant}.Model\nexport const m: M = { count: 1 }\n`)
  const program = ts.createProgram([consumer], { strict: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler })
  const checker = program.getTypeChecker()
  const start = performance.now()
  const diagnostics = program.getSemanticDiagnostics(program.getSourceFile(consumer))
  const ms = performance.now() - start
  console.log(variant.padEnd(20), 'instantiations', String(checker.getInstantiationCount()).padStart(8), 'types', String(checker.getTypeCount()).padStart(7), `${ms.toFixed(0)}ms`, 'diags', diagnostics.length)
}
