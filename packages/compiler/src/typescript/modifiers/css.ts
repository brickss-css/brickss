import * as ts from "typescript";
import { processStyle } from "../../common/process-style";
import { createBricksStyleFunction } from "../builders/bricks-style-fn";
import { buildObjectFromAST } from "../helpers/ast-to-object";

export function css(node: ts.CallExpression) {
  let fileName = node.getSourceFile().fileName;
  let stylesScope = processStyle(
    buildObjectFromAST(node.arguments[0] as ts.ObjectLiteralExpression),
    fileName
  );
  return createBricksStyleFunction(stylesScope);
}