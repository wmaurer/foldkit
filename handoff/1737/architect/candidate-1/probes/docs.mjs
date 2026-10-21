// Usage: node docs.mjs <typescript6 dir> <probe dir>. Prints the TSDoc TypeScript reports
// for members of a produced Block and of the assembled Block it wraps.
import { createRequire } from 'node:module'
const require = createRequire(process.argv[2] + '/package.json')
const ts = require(process.argv[2])
const file = `${process.argv[3]}/accepted.ts`
const options = { strict: true, exactOptionalPropertyTypes: true, noEmit: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'], types: [] }
const program = ts.createProgram([file], options)
const checker = program.getTypeChecker()
const source = program.getSourceFile(file)
const moduleSymbol = checker.getSymbolAtLocation(source)
for (const name of ['ABlock', 'CBlock']) {
  const exported = checker.getExportsOfModule(moduleSymbol).find(symbol => symbol.name === name)
  const type = checker.getTypeOfSymbol(exported)
  for (const member of ['Model', 'init', 'update', 'operations', 'Message', 'OutMessage']) {
    const property = checker.getPropertyOfType(type, member)
    const docs = property ? ts.displayPartsToString(property.getDocumentationComment(checker)).slice(0, 70) : '(no property)'
    console.log(name, member.padEnd(11), JSON.stringify(docs))
  }
}
