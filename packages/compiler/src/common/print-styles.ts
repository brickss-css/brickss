import {
  StyleScope,
  StyleDeclaration,
  isStyleDeclaration,
  AtRuleDeclaration
} from "./process-style";

export type PrintableValueCSSVar = {
  type: "cssVar";
  value: { name: string; identifier: string };
};
export type PrintableValue =
  | { type: "static"; value: string }
  | PrintableValueCSSVar;

export function printStyles(scope: StyleScope) {
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

export function printAtRule(scope: StyleScope, atRule: AtRuleDeclaration) {
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
  scope: StyleScope,
  styleDeclaration: StyleDeclaration
) {
  if (!styleDeclaration.properties.length) {
    return [{ type: "static", value: "" }] as Array<PrintableValue>;
  }

  let style: Array<PrintableValue> = [];
  let classNames = styleDeclaration.classNames
    .map(className => {
      let modifiers = buildModifiers(scope.name, className.modifiers);
      return modifiers
        ? "." + modifiers + " ." + className.name
        : "." + className.name;
    })
    .join(", ");

  style.push({ type: "static", value: classNames + " {" });

  styleDeclaration.properties.forEach(({ name, value }) => {
    if (value.type === "identifier") {
      style.push({
        type: "cssVar",
        value: { name, identifier: value.value }
      });
    } else {
      style.push({ type: "static", value: name + ": " + value.value + ";" });
    }
  });

  style.push({ type: "static", value: "}" });
  return style;
}

export function buildModifiers(
  scopeName: string,
  modifiers: Array<[string, string]>
) {
  return modifiers
    .map(
      ([name, value]) =>
        scopeName + "--" + name + (value === "boolean" ? "" : "-" + value)
    )
    .join(".");
}
