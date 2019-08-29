import * as ts from "typescript";
import { cssVarModifier } from "./modifiers/css-var";
import { importRuntime } from "./modifiers/import-runtime";
import { css } from "./modifiers/css";

export let visitor = (ctx: ts.TransformationContext, imports: Set<string>) => (
  node: ts.Node
): ts.Node => {
  if (ts.isImportDeclaration(node)) {
    return importRuntime(node, imports);
  }

  if (ts.isCallExpression(node) && imports.has(node.expression.getText())) {
    switch (node.expression.getText()) {
      case "cssVar":
        return cssVarModifier(node);
      case "css":
        return css(node);
      default:
        break;
    }
  }

  return ts.visitEachChild(node, visitor(ctx, imports), ctx);
};

export function transform(ctx: ts.TransformationContext): ts.CustomTransformer {
  return {
    transformSourceFile: node => {
      return ts.visitEachChild(node, visitor(ctx, new Set()), ctx);
    },
    transformBundle: node => node
  };
}
