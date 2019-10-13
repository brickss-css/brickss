import {
  RootScope,
  AtRuleDeclaration,
  StyleDeclaration,
  isStyleDeclaration
} from "./styles-compiler";

export type PrintableValueIdentifier = {
  type: "identifier";
  value: { name: string; value: string };
};
export type PrintableValueComplex = {
  type: "complex";
  value: { name: string; value: any };
};
export type PrintableValue =
  | { type: "static"; value: string }
  | PrintableValueComplex
  | PrintableValueIdentifier;

export function printStyles(scope: RootScope) {
  let styles = scope.styles
    .reduce<Array<PrintableValue>>((acc, style) => {
      if (isStyleDeclaration(style)) {
        return acc.concat(printStyleDeclaration(scope, style));
      }
      return acc.concat(printAtRule(scope, style));
    }, [])
    .reduce((acc: Array<PrintableValue>, style: PrintableValue) => {
      let last = acc[acc.length - 1];
      if (last && last.type === "static" && style.type === "static") {
        last.value += " " + style.value;
      } else {
        acc.push(style);
      }
      return acc;
    }, []);

  return styles;
}

export function printAtRule(scope: RootScope, atRule: AtRuleDeclaration) {
  if (!atRule.styles.length) {
    return [{ type: "static", value: "" }] as Array<PrintableValue>;
  }

  let rule: Array<PrintableValue> = [
    { type: "static", value: atRule.rule + " {" }
  ];

  atRule.styles.forEach(style => {
    if (isStyleDeclaration(style)) {
      rule = rule.concat(printStyleDeclaration(scope, style));
    }
  });

  rule.push({ type: "static", value: "}" });
  return rule;
}

export function printStyleDeclaration(
  scope: RootScope,
  styleDeclaration: StyleDeclaration
) {
  if (!styleDeclaration.properties.length) {
    return [{ type: "static", value: "" }] as Array<PrintableValue>;
  }

  let style: Array<PrintableValue> = [];
  let selector = styleDeclaration.selectors
    .map(selector => selector.compiled)
    .join(", ");

  style.push({ type: "static", value: selector + " {" });

  styleDeclaration.properties.forEach(({ name, value }) => {
    if (value.type === "identifier") {
      style.push({
        type: "identifier",
        value: { name, value: value.value }
      });
    } else if (value.type === "complex") {
      style.push({
        type: "complex",
        value: { name, value: value.value }
      });
    } else {
      style.push({ type: "static", value: name + ": " + value.value + ";" });
    }
  });

  style.push({ type: "static", value: "}" });
  return style;
}
