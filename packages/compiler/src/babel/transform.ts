// @ts-ignore
import { declare } from "@babel/helper-plugin-utils";
import { importRuntime } from "./modifiers/import-runtime";
import { cssVar } from "./modifiers/css-var";
import { css } from "./modifiers/css";
import { randomId } from "../common/hash";
import { safeProp } from "../common/safe-prop";
import { TransformationContext } from "./transformation-context";

module.exports = declare(() => {
  return {
    visitor: {
      Program: {
        enter(path: any, state: any) {
          let tctx = new TransformationContext(
            safeProp(state, "file.opts.fileName", randomId())
          );

          path.traverse({
            ImportDeclaration(path: any) {
              importRuntime(tctx, path);
            },
            CallExpression(path: any) {
              cssVar(tctx, path);
              css(tctx, path);
            }
          });
        }
      }
    }
  };
});
