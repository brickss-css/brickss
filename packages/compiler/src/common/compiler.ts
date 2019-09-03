import { isPsuedoSelector, isElementSelector, isAtRule } from "./css";

/**
 * Compiles Brickss RawStyles to a denormalised intermediate representation.
 */
export class Compiler {
  private root: RootScope;
  private rawStyle: RawStyle;

  constructor(name: string, rawStyle: RawStyle) {
    this.rawStyle = rawStyle;
    this.root = {
      name,
      styles: [],
      modifiers: {},
      modifiersToClass: {},
      selectorsToClass: {}
    };
  }

  /**
   * Main compiler method that outputs RootScope with style declarations and metadata
   */
  run(): RootScope {
    let rootStyle: StyleDeclaration = {
      selectors: [this.createRootSelector(this.root.name)],
      properties: []
    };

    this.root.styles.push(rootStyle);
    this.root.selectorsToClass.scope = this.root.name;
    this.compileNested(this.rawStyle, this.root.styles, rootStyle);

    // console.log(JSON.stringify(this.root, null, 2));
    return this.root;
  }

  /**
   * Compiles nested style declarations, mutates root scope
   */
  private compileNested(
    rawStyle: RawStyle,
    styles: Array<StyleDeclaration | AtRuleDeclaration>,
    parentStyle: StyleDeclaration
  ) {
    Object.entries(rawStyle).forEach(([name, value]) => {
      if (value.type) {
        // Property
        parentStyle.properties.push({
          name: this.toKebabCase(name),
          value: value as CSSPropertyValue
        });
      } else if (isAtRule(name)) {
        // at-rule
        let atRule: AtRuleDeclaration = { rule: name, styles: [] };
        let styleDeclaration: StyleDeclaration = {
          selectors: ([] as Array<Selector>).concat(parentStyle.selectors),
          properties: []
        };

        atRule.styles.push(styleDeclaration);

        this.compileNested(
          rawStyle[name] as RawStyle,
          atRule.styles,
          styleDeclaration
        );

        styles.push(atRule);
      } else {
        // Selector
        let selectors = name
          .split(",")
          .map(s => s.trim())
          .reduce<any>(
            (acc, selectorString) =>
              acc.concat(
                this.processSelector(selectorString, parentStyle.selectors)
              ),
            []
          );

        let style: StyleDeclaration = { selectors, properties: [] };
        styles.push(style);
        this.compileNested(rawStyle[name] as RawStyle, styles, style);
      }
    });
  }

  private processSelector(
    selectorString: string,
    parentSelectors: Array<Selector>
  ) {
    let {
      cleanSelector,
      modifiers,
      isPsuedo,
      isModifier,
      isElement,
      isComposite
    } = this.parseSelector(selectorString);

    if (isComposite) {
      cleanSelector = this.processCompositeSelector(selectorString);
    }

    // Updates selectorToClass map
    // Selector .selector-foo[state|inverse]
    // CleanSelector: selector-foo
    // Key: selectorFoo
    // Value: .scope__selector-foo
    if (!isModifier && !isPsuedo && !isElement && !isComposite) {
      this.registerInSelectorToClassMap(cleanSelector);
    }

    return parentSelectors.map(parent => {
      let scopedSelector = this.createScopedSelector({
        scope: parent.scope,
        cleanSelector,
        isPsuedo,
        isModifier,
        isComposite,
        isElement
      });

      let { combinedModifiers, compiledModifiers } = this.processModifiers(
        modifiers,
        parent.modifiers
      );

      let compiledSelector = this.applyModifiers(
        scopedSelector,
        compiledModifiers,
        parent,
        isPsuedo
      );

      return {
        scope: isModifier ? parent.scope : scopedSelector,
        raw: selectorString,
        modifiers: combinedModifiers,
        compiled: compiledSelector,
        isModifier,
        isPsuedo,
        isElement,
        isComposite
      };
    });
  }

  /**
   * Applies modifiers to a scoped selector:
   *
   * .test-hash__something -> .test-hash--inverse.test-hash--size-small .test-hash__something
   */
  private applyModifiers(
    scopedSelector: string,
    compiledModifiers: string,
    parent: Selector,
    isPsuedo: boolean
  ) {
    let compiledSelector = scopedSelector;

    if (compiledModifiers) {
      if (isPsuedo) {
        compiledSelector = parent.scope
          ? compiledModifiers + " " + scopedSelector
          : compiledModifiers + scopedSelector;
      } else if (scopedSelector) {
        compiledSelector = compiledModifiers + " " + scopedSelector;
      } else {
        compiledSelector = compiledModifiers;
      }
    }

    return compiledSelector;
  }

  private processModifiers(
    modifiers: Array<[string, string]>,
    parentModifiers: Array<[string, string]>
  ) {
    modifiers.forEach(([name, value]) => {
      // Updates modifiersToClass map
      // Selector .selector-foo[state|inverse|size=small]
      // Modifiers: inverse=boolean, size=small
      // KV: inverse:   .scope--inverse
      //     sizeSmall: .scope--size-small
      this.root.modifiersToClass[
        value === "boolean" ? name : this.toCamelCase(name + "-" + value)
      ] = this.buildModifierSelector(name, value);

      if (!this.root.modifiers[name]) {
        this.root.modifiers[name] =
          value === "boolean" ? value : new Set([value]);
        return;
      }

      if (value !== "boolean" && this.root.modifiers[name] !== "boolean") {
        (this.root.modifiers[name] as Set<string>).add(value);
      }
    });

    let combinedModifiers = ([] as Array<[string, string]>)
      .concat(parentModifiers)
      .concat(modifiers);

    let compiledModifiers = combinedModifiers
      .map(([name, value]) => "." + this.buildModifierSelector(name, value))
      .join("");

    return { combinedModifiers, compiledModifiers };
  }

  private processCompositeSelector(selectorString: string): string {
    return selectorString
      .split(" ")
      .map(subSelector => {
        if (subSelector.startsWith(".")) {
          let cleanSubSelector = this.getCleanSelector(subSelector);
          this.registerInSelectorToClassMap(cleanSubSelector);
          return this.createScopedSelector({
            scope: "",
            cleanSelector: cleanSubSelector,
            isComposite: false,
            isModifier: false,
            isPsuedo: false,
            isElement: false
          });
        }
        return subSelector;
      })
      .join(" ");
  }

  private parseSelector(selectorString: string) {
    let isComposite = selectorString.includes(" ");
    let cleanSelector = this.getCleanSelector(selectorString);
    let modifiers = this.getModifiersFromSelector(selectorString);
    let isPsuedo = isPsuedoSelector(cleanSelector);
    let isModifier = Boolean(!cleanSelector && modifiers.length);
    let isElement = isElementSelector(selectorString);

    return {
      cleanSelector,
      modifiers,
      isPsuedo,
      isModifier,
      isElement,
      isComposite
    };
  }

  private registerInSelectorToClassMap(name: string) {
    this.root.selectorsToClass[
      name.replace(/-([a-z])/g, (m, w) => w.toUpperCase())
    ] = this.root.name + "__" + name;
  }

  private createScopedSelector({
    scope,
    cleanSelector,
    isPsuedo,
    isModifier,
    isComposite,
    isElement
  }: {
    scope: string;
    cleanSelector: string;
    isPsuedo: boolean;
    isModifier: boolean;
    isComposite: boolean;
    isElement: boolean;
  }) {
    let prefixedSelector = cleanSelector;

    if (!isPsuedo && !isModifier && !isComposite && !isElement) {
      prefixedSelector = "." + this.root.name + "__" + cleanSelector;
    }

    if (isPsuedo) {
      return (scope || "." + this.root.name) + prefixedSelector;
    }

    if (isComposite) {
      return (scope || "." + this.root.name) + " " + prefixedSelector;
    }

    if (!scope || isModifier) {
      return prefixedSelector;
    }

    return scope + " " + prefixedSelector;
  }

  private getCleanSelector(selector: string): string {
    return selector
      .replace(/\[state\|(.+)\]/g, "")
      .replace(/^\./, "")
      .trim();
  }

  private buildModifierSelector(name: string, value: string) {
    return (
      this.root.name + "--" + name + (value === "boolean" ? "" : "-" + value)
    );
  }

  private getModifiersFromSelector(selector: string): Array<[string, string]> {
    let startIndex = selector.indexOf("[state|");
    if (startIndex === -1) {
      return [];
    }
    let endIndex = selector.indexOf("]", startIndex);
    return selector
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

  private createRootSelector(name: string): Selector {
    return {
      scope: "",
      raw: "",
      cleanSelector: name,
      compiled: "." + name,

      modifiers: [],

      isPsuedo: false,
      isModifier: false
    };
  }

  private toKebabCase(str: string) {
    return str.replace(/([A-Z])/g, ($1: string) => "-" + $1.toLowerCase());
  }

  private toCamelCase(str: string) {
    return str.replace(/-([a-z])/g, (m, w) => w.toUpperCase());
  }
}

export function isStyleDeclaration(obj: any): obj is StyleDeclaration {
  return obj && obj.selectors;
}

export interface RawStyle {
  [key: string]: CSSPropertyValue | RawStyle;
}

export type RootScope = {
  name: string;
  styles: Array<StyleDeclaration | AtRuleDeclaration>;
  modifiers: Record<string, Set<string> | "boolean">;
  modifiersToClass: Record<string, string>;
  selectorsToClass: Record<string, string>;
};

export type AtRuleDeclaration = {
  rule: string;
  styles: Array<StyleDeclaration | AtRuleDeclaration>;
};

export type Selector = {
  scope: string;
  raw: string;
  compiled: string;
  cleanSelector: string;
  modifiers: Array<[string, string]>;
  isPsuedo?: boolean;
  isModifier?: boolean;
  isElement?: boolean;
  isComposite?: boolean;
};

export type StyleDeclaration = {
  selectors: Array<Selector>;
  properties: Array<{ name: string; value: CSSPropertyValue }>;
};

export type CSSPropertyValue =
  | {
      type: "string";
      value: string;
    }
  | { type: "number"; value: number }
  | { type: "identifier"; value: string }
  | { type: "complex"; value: any };
