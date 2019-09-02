import * as ts from "typescript";
import { hash } from "../../common/hash";
import { simpleString } from "../helpers/simple-string";

export interface CSSVariable {
  name: string;
  defaultValue?: string;
}

export function cssVarModifier(node: ts.CallExpression) {
  const [variable, defaultValue] = node.arguments;
  if (variable && ts.isStringLiteral(variable)) {
    const name = simpleString(variable);
    const fileName = node.getSourceFile().fileName;

    return ts.createObjectLiteral(
      [
        ts.createPropertyAssignment(
          ts.createIdentifier("name"),
          ts.createStringLiteral(`${name}__${hash(fileName)}`)
        ),
        ts.createPropertyAssignment(
          ts.createIdentifier("defaultValue"),
          defaultValue || ts.createIdentifier("undefined")
        )
      ],
      true
    );
  }

  return node;
}
