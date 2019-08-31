import * as ts from "typescript";
import { StyleScope } from "../../common/process-style";
import { printStyles, PrintableValue } from "../../common/print-styles";
import { runtimeIdentifier } from "../helpers/constants";
import { createCssVarWithDefault } from "./css-var-with-default";
import { randomId } from "../../common/hash";

export function createBricksStyleFunction(stylesScope: StyleScope) {
  let styles = printStyles(stylesScope);
  let id = ts.createUniqueName("brickss");
  return ts.createFunctionExpression(
    undefined,
    undefined,
    id,
    undefined,
    [
      ts.createParameter(
        undefined,
        undefined,
        undefined,
        ts.createIdentifier("state"),
        undefined,
        undefined,
        ts.createObjectLiteral([], false)
      )
    ],
    undefined,
    ts.createBlock(
      [
        ts.createExpressionStatement(
          ts.createCall(
            ts.createPropertyAccess(
              runtimeIdentifier,
              ts.createIdentifier("_i")
            ),
            undefined,
            [
              ts.createStringLiteral(stylesScope.name + "__" + randomId()),
              buildStringFromStyles(styles)
            ]
          )
        ),
        ...Object.entries(stylesScope.nameToClass).map(([name, value]) => {
          return ts.createExpressionStatement(
            ts.createBinary(
              ts.createPropertyAccess(id, ts.createIdentifier(name)),
              ts.createToken(ts.SyntaxKind.EqualsToken),
              ts.createStringLiteral(value)
            )
          );
        }),
        ts.createReturn(
          ts.createCall(
            ts.createPropertyAccess(
              runtimeIdentifier,
              ts.createIdentifier("_os")
            ),
            undefined,
            [
              ts.createObjectLiteral(
                [
                  ts.createPropertyAssignment(
                    ts.createStringLiteral(stylesScope.name),
                    ts.createTrue()
                  ),
                  ...Object.entries(stylesScope.modifiers).reduce<
                    Array<ts.PropertyAssignment>
                  >((acc, [modifier, values]) => {
                    if (values === "boolean") {
                      acc.push(
                        ts.createPropertyAssignment(
                          ts.createStringLiteral(
                            stylesScope.name + "--" + modifier
                          ),
                          ts.createPropertyAccess(
                            ts.createIdentifier("state"),
                            ts.createIdentifier(modifier)
                          )
                        )
                      );
                    }
                    return acc;
                  }, [])
                ],
                true
              )
            ]
          )
        )
      ],
      true
    )
  );
}

export function buildStringFromStyles(styles: Array<PrintableValue>) {
  if (styles.length < 2) {
    return ts.createStringLiteral(
      styles.map((style: any) => style.value).join(",")
    );
  }

  return createBinaryRecursive(([] as Array<PrintableValue>).concat(styles));
}

export function createBinaryRecursive(
  styles: Array<PrintableValue>
): ts.BinaryExpression | ts.StringLiteral {
  let left = styles.shift();
  if (left && left.type === "static") {
    return ts.createBinary(
      ts.createStringLiteral(left.value),
      ts.SyntaxKind.PlusToken,
      createBinaryRecursive(styles)
    );
  } else if (left && left.type === "cssVar") {
    return ts.createBinary(
      createCssVarWithDefault(left),
      ts.SyntaxKind.PlusToken,
      createBinaryRecursive(styles)
    );
  }

  return ts.createStringLiteral("");
}
