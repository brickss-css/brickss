import { types as t } from "@babel/core";
import { hash } from "../../common/hash";
import { safeProp } from "../../common/safe-prop";
import { TransformationContext } from "../transformation-context";

export function cssVar(tctx: TransformationContext, path: any) {
  let node: t.CallExpression = path.node;

  if (!tctx.isBrickssImport("cssVar", node.callee, path)) {
    return;
  }

  let varName = safeProp(path, "parent.id.name", "");
  let [rawName, defaultValue] = node.arguments;
  let name = (rawName as t.StringLiteral).value;

  path.replaceWith(
    t.objectExpression([
      t.objectProperty(
        t.identifier("name"),
        t.stringLiteral(`${name}__${hash(varName + tctx.fileName)}`)
      ),
      t.objectProperty(t.identifier("_c_"), t.numericLiteral(1)),
      t.objectMethod(
        "method",
        t.identifier("toString"),
        [],
        t.blockStatement([t.returnStatement(defaultValue as any)])
      )
    ])
  );
}
