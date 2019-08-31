import * as path from "path";
import { hash } from "./hash";
import { isSelector, isAtRule, isPsuedoSelector } from "./css";

export function processStyle(
  style: UnprocessedStyle,
  filePath: string
): StyleScope {
  let uniqId = hash(filePath);
  let scopeName = getScopeNameFromFilePath(filePath) + "-" + uniqId;
  let scope: StyleScope = {
    name: scopeName,
    uniqId,
    styles: [],
    modifiers: {},
    nameToClass: { scope: scopeName }
  };
  let scopeStyle = {
    classNames: [{ name: scopeName, modifiers: [] }],
    properties: []
  };
  scope.styles.push(scopeStyle);
  processStyleDeclarations(scope, style, scopeStyle, scope.styles);
  return scope;
}

export function processStyleDeclarations(
  scope: StyleScope,
  style: UnprocessedStyle,
  parentStyle: StyleDeclaration,
  resultStyle: Array<StyleDeclaration | AtRuleDeclaration>
) {
  for (let [key, value] of Object.entries(style)) {
    if (isSelector(key)) {
      let styleDeclaration = {
        classNames: processSelectors(key, scope, parentStyle.classNames),
        properties: []
      };
      resultStyle.push(styleDeclaration);
      processStyleDeclarations(
        scope,
        style[key] as UnprocessedStyle,
        styleDeclaration,
        resultStyle
      );
    } else if (isAtRule(key)) {
      let atRule: AtRuleDeclaration = {
        rule: key,
        styles: []
      };
      let styleDeclaration: StyleDeclaration = {
        classNames: ([] as Array<ClassName>).concat(parentStyle.classNames),
        properties: []
      };
      atRule.styles.push(styleDeclaration);
      processStyleDeclarations(
        scope,
        style[key] as UnprocessedStyle,
        styleDeclaration,
        atRule.styles
      );
      resultStyle.push(atRule);
    } else {
      parentStyle.properties.push({
        name: normalizePropertyName(key),
        value: value as CSSPropertyValue
      });
    }
  }
}

export function processSelectors(
  rawSelectors: string,
  scope: StyleScope,
  classNames: Array<ClassName>
): Array<ClassName> {
  let selectors = rawSelectors.split(",").map(s => s.trim());
  return selectors.reduce<Array<ClassName>>((acc, sel) => {
    let modifiers = getModifiersFromSelector(sel);
    let cleanSelector = getCleanSelector(sel);
    let isPsuedo = isPsuedoSelector(cleanSelector);

    modifiers.forEach(([name, value]) => {
      if (!scope.modifiers[name]) {
        scope.modifiers[name] = new Set();
      }

      if (value === "boolean") {
        scope.modifiers[name] = "boolean";
      }

      if (scope.modifiers[name] !== "boolean") {
        (scope.modifiers[name] as Set<string>).add(value);
      }
    });

    classNames.forEach(className => {
      let newClassName = {
        name: isPsuedo
          ? className.name + cleanSelector
          : className.name + "__" + cleanSelector,
        modifiers
      };

      acc.push(newClassName);

      if (!isPsuedo) {
        scope.nameToClass[cleanSelector] = newClassName.name;
      }
    });
    return acc;
  }, []);
}

export function getScopeNameFromFilePath(filePath: string): string {
  return path.basename(filePath).split(".")[0];
}

export function normalizePropertyName(attr: string) {
  return attr.replace(/([A-Z])/g, ($1: string) => "-" + $1.toLowerCase());
}

export function isStyleDeclaration(style: any): style is StyleDeclaration {
  return style && style.classNames;
}

export function getModifiersFromSelector(sel: string): Array<[string, string]> {
  let startIndex = sel.indexOf("[state|");
  if (startIndex === -1) {
    return [];
  }
  let endIndex = sel.indexOf("]", startIndex);
  return sel
    .substr(
      startIndex + "[state|".length,
      endIndex - (startIndex + "[state|".length)
    )
    .split("|")
    .map(str => {
      let modfier = str.split("=");

      if (modfier.length === 2) {
        return modfier as [string, string];
      }

      return [modfier[0], "boolean"];
    });
}

export function getCleanSelector(sel: string): string {
  return sel.replace(/\[state\|(.+)\]/g, "").replace(/^\./, "");
}

export type UnprocessedStyle = {
  [key: string]: CSSPropertyValue | UnprocessedStyle;
};

export type CSSPropertyValue = { type: string; value: string };

export type CSSProperty = {
  name: string;
  value: CSSPropertyValue;
};

export type ClassName = {
  name: string;
  modifiers: Array<[string, string]>;
};

export type StyleScope = {
  name: string;
  uniqId: string;
  styles: Array<StyleDeclaration | AtRuleDeclaration>;
  modifiers: Record<string, Set<string> | "boolean">;
  nameToClass: Record<string, string>;
};

export type StyleDeclaration = {
  classNames: Array<ClassName>;
  properties: Array<CSSProperty>;
};

export type AtRuleDeclaration = {
  rule: string;
  styles: Array<StyleDeclaration | AtRuleDeclaration>;
};

export type CSSDeclaration = StyleDeclaration | AtRuleDeclaration;
