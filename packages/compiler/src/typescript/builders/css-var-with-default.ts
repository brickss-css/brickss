import * as ts from "typescript";
import { PrintableValueCSSVar } from "../../common/print-styles";

/**
 * (myVar.defaultValue ? "font-size: " + myVar.defaultValue + ";" : "") + "font-size: " + "var(--" + myVar.name + ", " + (myVar.defaultValue || "") + ");"
 */
export function createCssVarWithDefault(cssVar: PrintableValueCSSVar) {
  return ts.createBinary(
    ts.createBinary(
      ts.createBinary(
        ts.createBinary(
          ts.createBinary(
            ts.createBinary(
              ts.createParen(
                ts.createConditional(
                  ts.createPropertyAccess(
                    ts.createIdentifier(cssVar.value.identifier),
                    ts.createIdentifier("defaultValue")
                  ),
                  ts.createBinary(
                    ts.createBinary(
                      ts.createStringLiteral(cssVar.value.name + ": "),
                      ts.createToken(ts.SyntaxKind.PlusToken),
                      ts.createPropertyAccess(
                        ts.createIdentifier(cssVar.value.identifier),
                        ts.createIdentifier("defaultValue")
                      )
                    ),
                    ts.createToken(ts.SyntaxKind.PlusToken),
                    ts.createStringLiteral(";")
                  ),
                  ts.createStringLiteral("")
                )
              ),
              ts.createToken(ts.SyntaxKind.PlusToken),
              ts.createStringLiteral(cssVar.value.name + ": ")
            ),
            ts.createToken(ts.SyntaxKind.PlusToken),
            ts.createStringLiteral("var(--")
          ),
          ts.createToken(ts.SyntaxKind.PlusToken),
          ts.createPropertyAccess(
            ts.createIdentifier(cssVar.value.identifier),
            ts.createIdentifier("name")
          )
        ),
        ts.createToken(ts.SyntaxKind.PlusToken),
        ts.createStringLiteral(", ")
      ),
      ts.createToken(ts.SyntaxKind.PlusToken),
      ts.createParen(
        ts.createBinary(
          ts.createPropertyAccess(
            ts.createIdentifier(cssVar.value.identifier),
            ts.createIdentifier("defaultValue")
          ),
          ts.createToken(ts.SyntaxKind.BarBarToken),
          ts.createStringLiteral("")
        )
      )
    ),
    ts.createToken(ts.SyntaxKind.PlusToken),
    ts.createStringLiteral(");")
  );
}
