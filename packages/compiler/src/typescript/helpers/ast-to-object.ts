import * as ts from "typescript";
import { simpleString } from "./simple-string";
import { RawStyle } from "../../common/styles-compiler";

export function buildObjectFromAST(node: ts.ObjectLiteralExpression): RawStyle {
  let style: RawStyle = {};

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
