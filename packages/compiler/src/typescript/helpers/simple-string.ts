import * as ts from "typescript";

/**
 * Strips the quote from the suffix and prefix
 * @param value
 */
export function simpleString(value: ts.Expression | ts.ComputedPropertyName) {
  const text = value.getText();
  if (text.startsWith("'") || text.startsWith('"')) {
    return text.substr(1, text.length - 2);
  }
  return text;
}
