import { createRequire } from 'node:module'
import fs from 'node:fs'
const require = createRequire(process.argv[2] + '/package.json')
const ts = require(process.argv[2])
const dir = process.argv[3]
const options = { strict: true, exactOptionalPropertyTypes: true, noEmit: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'], types: [] }
for (const variant of process.argv.slice(4)) {
  const file = `${dir}/consumer.init2.${variant}.ts`
  fs.writeFileSync(file, `import { TheBlock } from './${variant}.js'\nexport type I = ReturnType<typeof TheBlock.init>\n`)
  const program = ts.createProgram([file], options)
  const checker = program.getTypeChecker()
  const diagnostics = program.getSemanticDiagnostics(program.getSourceFile(file))
  console.log(variant.padEnd(18), 'instantiations', String(checker.getInstantiationCount()).padStart(8), 'diags', diagnostics.length, diagnostics.slice(0,1).map(d => ts.flattenDiagnosticMessageText(d.messageText, ' ').slice(0, 160)).join(''))
}
