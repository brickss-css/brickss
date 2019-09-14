import { types as t } from "@babel/core";
import { runtimeIdentifier } from "../helpers/constants";

export function importRuntime(path: any) {
  let node: t.ImportDeclaration = path.node;
  if (node.source.value !== "@brickss/compiler") {
    return;
  }

  path.replaceWith(
    t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(runtimeIdentifier))],
      t.stringLiteral("@brickss/runtime")
    )
  );
}
