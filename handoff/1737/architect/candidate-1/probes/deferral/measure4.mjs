import { createRequire } from 'node:module'
const require = createRequire(process.argv[2] + '/package.json')
const ts = require(process.argv[2])
const dir = process.argv[3]
const options = { strict: true, exactOptionalPropertyTypes: true, noEmit: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'], types: [] }
for (const name of process.argv.slice(4)) {
  const file = `${dir}/${name}.ts`
  const program = ts.createProgram([file], options)
  const checker = program.getTypeChecker()
  const diagnostics = program.getSemanticDiagnostics(program.getSourceFile(file))
  console.log(name.padEnd(34), 'instantiations', String(checker.getInstantiationCount()).padStart(8), 'diags', diagnostics.length, diagnostics.slice(0,1).map(d => ts.flattenDiagnosticMessageText(d.messageText, ' ').slice(0, 200)).join(''))
}
