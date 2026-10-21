import { createRequire } from 'node:module'
const require = createRequire(process.argv[2])
const ts = require('typescript')
const consumer = process.argv[3]
const options = { strict: true, exactOptionalPropertyTypes: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, skipLibCheck: true, types: [], allowImportingTsExtensions: true }
const program = ts.createProgram([consumer], options)
const checker = program.getTypeChecker()
const diagnostics = program.getSemanticDiagnostics(program.getSourceFile(consumer))
console.log(String(checker.getInstantiationCount()).padStart(9), diagnostics.length === 0 ? '' : `(${diagnostics.length} diagnostics)`)
