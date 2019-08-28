import test from "ava";
import { scopeVariable } from "./scope-variable";

test("scopeVariable: creates scoped variable name", t => {
  let scoped = scopeVariable("my-css-variable");
  t.true(scoped.startsWith("my-css-variable__"));
});
