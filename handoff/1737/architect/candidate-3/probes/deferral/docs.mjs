import { createRequire } from 'node:module'
const [tsPath, file] = process.argv.slice(2)
const ts = createRequire(tsPath)('typescript')
const options = { strict: true, exactOptionalPropertyTypes: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, allowImportingTsExtensions: true, skipLibCheck: true, types: [] }
const program = ts.createProgram([file], options)
const checker = program.getTypeChecker()
const source = program.getSourceFile(file)
const moduleSymbol = checker.getSymbolAtLocation(source)
const produced = checker.getExportsOfModule(moduleSymbol).find(symbol => symbol.name === 'Produced')
const type = checker.getTypeOfSymbol(produced)
for (const name of ['Model', 'init', 'update', 'bindings']) {
  const property = checker.getPropertyOfType(type, name)
  console.log(name.padEnd(9), JSON.stringify(ts.displayPartsToString(property.getDocumentationComment(checker)).slice(0, 90)))
}
