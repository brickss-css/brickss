import * as ts from "typescript";
import { UnprocessedStyle } from "../../common/process-style";
import { simpleString } from "./simple-string";

export function buildObjectFromAST(
  node: ts.ObjectLiteralExpression
): UnprocessedStyle {
  let style: UnprocessedStyle = {};

  node.properties.forEach(prop => {
    if (ts.isPropertyAssignment(prop)) {
      style[simpleString(prop.name)] = ts.isObjectLiteralExpression(
        prop.initializer as ts.ObjectLiteralExpression
      )
        ? buildObjectFromAST(prop.initializer as ts.ObjectLiteralExpression)
        : ts.isIdentifier(prop.initializer)
        ? { type: "identifier", value: prop.initializer.getText() }
        : { type: "string", value: simpleString(prop.initializer) || '""' };
    }
  });

  return style;
}
