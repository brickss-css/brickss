import { types as t } from "@babel/core";
import { hash } from "../../common/hash";
import { safeProp } from "../../common/safe-prop";

export function cssVar(path: any, fileName: string) {
  let node: t.CallExpression = path.node;

  // TODO: improve detection
  if (
    !node ||
    !node.callee ||
    (node.callee as t.Identifier).name !== "cssVar"
  ) {
    return;
  }

  let varName = safeProp(path, "parent.id.name", "");
  let [rawName, defaultValue] = node.arguments;
  let name = (rawName as t.StringLiteral).value;

  path.replaceWith(
    t.objectExpression([
      t.objectProperty(
        t.identifier("name"),
        t.stringLiteral(`${name}__${hash(varName + fileName)}`)
      ),
      t.objectProperty(
        t.identifier("defaultValue"),
        (defaultValue as any) || t.identifier("undefined")
      )
    ])
  );
}
