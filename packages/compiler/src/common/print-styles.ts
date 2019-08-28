import {
  StyleScope,
  StyleDeclaration,
  isStyleDeclaration,
  AtRuleDeclaration
} from "./process-style";

export async function printStyles(
  scope: StyleScope,
  minify: boolean = false
): Promise<string> {
  let styles = scope.styles
    .map(style => {
      if (isStyleDeclaration(style)) {
        return printStyleDeclaration(scope, style);
      }
      return printAtRule(scope, style);
    })
    .join("\n");

  if (minify) {
    return (await require("postcss")([
      require("cssnano")({
        preset: "default"
      })
    ]).process(styles)).css;
  }

  return styles;
}

export function printAtRule(
  scope: StyleScope,
  atRule: AtRuleDeclaration
): string {
  if (!atRule.styles.length) {
    return "";
  }

  let rule: Array<string> = [atRule.rule + " {"];

  atRule.styles.forEach(style => {
    if (isStyleDeclaration(style)) {
      rule.push(printStyleDeclaration(scope, style));
    }
  });

  rule.push("}");
  return rule.join("\n");
}

export function printStyleDeclaration(
  scope: StyleScope,
  styleDeclaration: StyleDeclaration
): string {
  if (!styleDeclaration.properties.length) {
    return "";
  }

  let style: Array<string> = [];
  let classNames = styleDeclaration.classNames
    .map(className => {
      let modifiers = buildModifiers(scope.name, className.modifiers);
      return modifiers
        ? "." + modifiers + " ." + className.name
        : "." + className.name;
    })
    .join(", ");

  style.push(classNames, "{");

  styleDeclaration.properties.forEach(({ name, value }) => {
    let prop = name + ": " + value + ";";
    style.push(prop.padStart(prop.length + 2, " "));
  });

  style.push("}");
  return style.join("\n");
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
