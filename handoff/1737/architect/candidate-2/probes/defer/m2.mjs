import { createRequire } from 'node:module'
const require = createRequire(process.argv[2])
const ts = require('typescript')
const consumer = process.argv[3]
const options = { strict: true, exactOptionalPropertyTypes: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, skipLibCheck: true, types: [], allowImportingTsExtensions: true }
const program = ts.createProgram([consumer], options)
const checker = program.getTypeChecker()
const start = performance.now()
const d = program.getSemanticDiagnostics(program.getSourceFile(consumer))
console.log(consumer, 'instantiations', checker.getInstantiationCount(), 'types', checker.getTypeCount(), (performance.now()-start).toFixed(0)+'ms', 'diags', d.length)
