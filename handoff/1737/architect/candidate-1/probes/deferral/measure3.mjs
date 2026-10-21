import { createRequire } from 'node:module'
import fs from 'node:fs'
const require = createRequire(process.argv[2] + '/package.json')
const ts = require(process.argv[2])
const dir = process.argv[3]
const options = { strict: true, exactOptionalPropertyTypes: true, noEmit: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'], types: [] }
const consumers = {
  model: v => `import { TheBlock } from './${v}.js'\nexport type M = typeof TheBlock.Model\n`,
  init: v => `import { TheBlock } from './${v}.js'\nexport type I = ReturnType<typeof TheBlock.init>\n`,
}
for (const variant of process.argv.slice(4)) {
  const row = [variant.padEnd(26)]
  for (const [name, source] of Object.entries(consumers)) {
    const file = `${dir}/consumer.m3${name}.${variant}.ts`
    fs.writeFileSync(file, source(variant))
    const program = ts.createProgram([file], options)
    const checker = program.getTypeChecker()
    const diagnostics = program.getSemanticDiagnostics(program.getSourceFile(file))
    row.push(`${name} ${String(checker.getInstantiationCount()).padStart(8)} diags ${diagnostics.length}`)
  }
  console.log(row.join('  '))
}
