import { types as t } from "@babel/core";
import template from "@babel/template";
import { hash, randomId } from "../../common/hash";
import { safeProp } from "../../common/safe-prop";
import { RawStyle, Compiler, RootScope } from "../../common/compiler";
import { scopeVariable } from "../../common/scope-variable";
import { runtimeIdentifier } from "../helpers/constants";
import {
  PrintableValue,
  printStyles,
  PrintableValueCSSVar
} from "../../common/print-styles";

export function css(path: any, fileName: string) {
  let node: t.CallExpression = path.node;

  // TODO: improve detection
  if (!node || !node.callee || (node.callee as t.Identifier).name !== "css") {
    return;
  }

  let varName = safeProp(path, "parent.id.name", randomId());
  let scopeName = varName + "-" + hash(fileName);

  // TODO: check that an argument is actually an object
  let stylesObject = buildObjectFromAST(node
    .arguments[0] as t.ObjectExpression);

  let compiler = new Compiler(scopeName, stylesObject);
  let stylesScope = compiler.run();

  path.replaceWith(createBrickssStyleFunction(stylesScope));
}

function buildObjectFromAST(node: t.ObjectExpression) {
  let styles: RawStyle = {};

  // TODO: remove a type cast
  (node.properties as Array<t.ObjectProperty>).forEach(({ key, value }) => {
    let name = t.isIdentifier(key) ? key.name : key.value;

    if (t.isObjectExpression(value)) {
      styles[name] = buildObjectFromAST(value);
    } else if (t.isIdentifier(value)) {
      // TODO: inline not exported identifiers
      styles[name] = { type: "identifier", value: value.name };
    } else if (t.isStringLiteral(value)) {
      styles[name] = { type: "string", value: value.value };
    } else if (t.isNumericLiteral(value)) {
      styles[name] = { type: "number", value: value.value };
    } else {
      // TODO: better error
      throw new Error("Unsupported property type");
    }
  });

  return styles;
}

let brickssStyleFn = template(`
  var someName = function %%name%%(state) {
    if (state === void 0) { state = {}; }
    %%runtime%%._i(%%scope%%, %%styles%%);
    %%selectorToClassMap%%

    %%name%%.state = {};
    %%modifierToClassMap%%
    return %%runtime%%._os(
      %%modifiersStateChecks%%
    );
  }
`);

function createBrickssStyleFunction(stylesScope: RootScope) {
  let styles = printStyles(stylesScope);
  let fnName = t.identifier(scopeVariable("brickss"));
  return (brickssStyleFn({
    name: fnName,
    runtime: t.identifier(runtimeIdentifier),
    selectorToClassMap: Object.entries(stylesScope.selectorsToClass).map(
      ([name, value]) =>
        t.expressionStatement(
          t.assignmentExpression(
            "=",
            t.memberExpression(fnName, t.identifier(name)),
            t.stringLiteral(value)
          )
        )
    ),
    modifierToClassMap: Object.entries(stylesScope.modifiersToClass).map(
      ([name, value]) =>
        t.expressionStatement(
          t.assignmentExpression(
            "=",
            t.memberExpression(
              t.memberExpression(fnName, t.identifier("state")),
              t.identifier(name)
            ),
            t.stringLiteral(value)
          )
        )
    ),
    scope: t.stringLiteral(stylesScope.name),
    styles: buildStringFromStyles(styles),
    modifiersStateChecks: t.objectExpression(
      Object.entries(stylesScope.modifiers)
        .reduce<Array<t.ObjectProperty>>((acc, [name, values]) => {
          if (values === "boolean") {
            acc.push(
              t.objectProperty(
                t.stringLiteral(stylesScope.name + "--" + name),
                t.memberExpression(t.identifier("state"), t.identifier(name))
              )
            );
          } else {
            values.forEach(val => {
              acc.push(
                t.objectProperty(
                  t.stringLiteral(stylesScope.name + "--" + name + "-" + val),
                  t.binaryExpression(
                    "===",
                    t.memberExpression(
                      t.identifier("state"),
                      t.identifier(name)
                    ),
                    t.stringLiteral(val)
                  )
                )
              );
            });
          }

          return acc;
        }, [])
        .concat(
          t.objectProperty(
            t.stringLiteral(stylesScope.name),
            t.booleanLiteral(true)
          )
        )
    )
  }) as any).declarations[0].init; // :sad_marijn:
}

export function buildStringFromStyles(styles: Array<PrintableValue>) {
  if (styles.length < 2) {
    return t.stringLiteral(styles.map((style: any) => style.value).join(","));
  }

  return createBinaryRecursive(([] as Array<PrintableValue>).concat(styles));
}

let cssVarWithDefault = template(`
(%%varName%%.defaultValue ? %%propName%% + %%varName%%.defaultValue + ";" : "") + "font-size: " + "var(--" + %%varName%%.name + ", " + (%%varName%%.defaultValue || "") + ");"
`);
export function createCssVarWithDefault(cssVar: PrintableValueCSSVar) {
  return (cssVarWithDefault({
    varName: t.identifier(cssVar.value.identifier),
    propName: t.stringLiteral(cssVar.value.name + ": ")
  }) as any).expression;
}

export function createBinaryRecursive(
  styles: Array<PrintableValue>
): t.BinaryExpression | t.StringLiteral {
  let left = styles.shift();
  if (left && left.type === "static") {
    return t.binaryExpression(
      "+",
      t.stringLiteral(left.value),
      createBinaryRecursive(styles)
    );
  } else if (left && left.type === "cssVar") {
    return t.binaryExpression(
      "+",
      createCssVarWithDefault(left),
      createBinaryRecursive(styles)
    );
  }
  return t.stringLiteral("");
}
