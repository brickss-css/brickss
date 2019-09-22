import { types as t } from "@babel/core";
import { scopeVariable } from "../common/scope-variable";

export class TransformationContext {
  fileName: string;
  runtimeIdentifier: string;
  imports: { css: null | string; cssVar: null | string } = {
    css: null,
    cssVar: null
  };

  constructor(fileName: string) {
    this.fileName = fileName;
    this.runtimeIdentifier = scopeVariable("runtime");
  }

  registerImport(type: "css" | "cssVar", name: string) {
    this.imports[type] = name;
  }

  isBrickssImport(type: "css" | "cssVar", node: any, localPath: any) {
    if (!node || !t.isIdentifier(node)) {
      return false;
    }

    let name = node.name;
    let parent = localPath.scope.getBinding(name).path.parent;

    return (
      t.isImportDeclaration(parent) &&
      parent.source.value === "@brickss/compiler" &&
      this.imports[type] === name
    );
  }
}
