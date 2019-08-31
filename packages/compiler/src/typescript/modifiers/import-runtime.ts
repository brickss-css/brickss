import * as ts from "typescript";
import { simpleString } from "../helpers/simple-string";
import { runtimeIdentifier } from "../helpers/constants";

export function importRuntime(
  node: ts.ImportDeclaration,
  importContext: Set<string>
) {
  if (
    simpleString(node.moduleSpecifier) !== "@brickss/compiler" ||
    !node.importClause
  ) {
    return node;
  }

  let namedBindings = node.importClause.namedBindings;

  if (namedBindings && ts.isNamedImports(namedBindings)) {
    namedBindings.elements.forEach(element => {
      importContext.add(element.name.text);
    });
  }

  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamespaceImport(runtimeIdentifier)
    ),
    ts.createStringLiteral("@brickss/runtime")
  );
}
