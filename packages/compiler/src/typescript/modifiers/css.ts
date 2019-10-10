import * as ts from "typescript";
import { createBricksStyleFunction } from "../builders/bricks-style-fn";
import { buildObjectFromAST } from "../helpers/ast-to-object";
import { getScopeNameFromFilePath } from "../../common/hash";
import { StylesCompiler } from "../../common/styles-compiler";

export function css(node: ts.CallExpression) {
  let scopeName = getScopeNameFromFilePath(node.getSourceFile().fileName);
  let compiler = new StylesCompiler(
    scopeName,
    buildObjectFromAST(node.arguments[0] as ts.ObjectLiteralExpression)
  );
  let stylesScope = compiler.run();
  return createBricksStyleFunction(stylesScope);
}
