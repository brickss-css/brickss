import { types as t } from "@babel/core";
import { TransformationContext } from "../transformation-context";

export function importRuntime(tctx: TransformationContext, path: any) {
  let node: t.ImportDeclaration = path.node;
  if (node.source.value !== "@brickss/compiler") {
    return;
  }

  node.specifiers.forEach(specifier => {
    if (
      t.isImportDefaultSpecifier(specifier) ||
      t.isImportNamespaceSpecifier(specifier)
    ) {
      throw new Error("TODO: unsupported yet");
    } else {
      let imported = specifier.imported.name as "css" | "cssVar";
      let local = specifier.local.name;
      tctx.registerImport(imported, local);
    }
  });

  path.replaceWith(
    t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(tctx.runtimeIdentifier))],
      t.stringLiteral("@brickss/runtime")
    )
  );
}
