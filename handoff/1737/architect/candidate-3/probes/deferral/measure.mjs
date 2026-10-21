import { createRequire } from 'node:module'
import fs from 'node:fs'
const [tsPath, dir, fkLink] = process.argv.slice(2)
const ts = createRequire(tsPath)('typescript')
fs.rmSync(`${dir}/node_modules/foldkit`, { force: true })
fs.symlinkSync(fkLink, `${dir}/node_modules/foldkit`)
const options = { strict: true, exactOptionalPropertyTypes: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, allowImportingTsExtensions: true, skipLibCheck: true, types: [], lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'] }
const cases = {
  NoBlock: `import { ProducedDefinition } from './blocks.ts'\nexport const m: typeof ProducedDefinition.Model.Type = { count: 1, label: '', items: [] }\n`,
  EagerModel: `import { Eager } from './blocks.ts'\nexport const m: typeof Eager.Model.Type = { count: 1, label: '', items: [] }\n`,
  ProducedModel: `import { Produced } from './blocks.ts'\nexport const m: typeof Produced.Model.Type = { count: 1, label: '', items: [] }\n`,
  EagerInit: `import { Eager } from './blocks.ts'\nexport const m = Eager.init\n`,
  ThunkReturnInit: `import { thunk } from './blocks.ts'\nexport const m = null! as ReturnType<typeof thunk>['init']\n`,
  SeparateThunkModel: `import { ThunkProduced } from './blocks.ts'\nexport const m: typeof ThunkProduced.Model.Type = { count: 1, label: '', items: [] }\n`,
  SeparateThunkInit: `import { ThunkProduced } from './blocks.ts'\nexport const m = ThunkProduced.init\n`,
  ProducedInit: `import { Produced } from './blocks.ts'\nexport const m = Produced.init\n`,
}
console.log('typescript', ts.version, 'foldkit ->', fkLink.split('/').slice(-1)[0])
for (const [name, source] of Object.entries(cases)) {
  const file = `${dir}/consumer.${name}.ts`
  fs.writeFileSync(file, source)
  const program = ts.createProgram([file], options)
  const checker = program.getTypeChecker()
  const start = performance.now()
  const diagnostics = program.getSemanticDiagnostics(program.getSourceFile(file))
  const ms = performance.now() - start
  console.log(name.padEnd(14), 'instantiations', String(checker.getInstantiationCount()).padStart(8), 'types', String(checker.getTypeCount()).padStart(7), `${ms.toFixed(0)}ms`.padStart(7), 'diagnostics', diagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, ' ').slice(0, 120)).join(' | ') || 0)
}
