import * as path from "path";
import test from "ava";
import * as ts from "typescript";
import { transform } from "./transform";

test("TS transform: compiles simple example without blowing up", t => {
  const compilerHost = ts.createCompilerHost({});
  const program = ts.createProgram(
    [path.join(__dirname, "./__fixtures__/example.ts")],
    {},
    compilerHost
  );
  program.emit(undefined, undefined, undefined, undefined, {
    before: [transform]
  });
  t.pass();
});
