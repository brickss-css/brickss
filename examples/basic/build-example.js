const path = require("path");
const ts = require("typescript");
const { transform } = require("@brickss/compiler");

const compilerHost = ts.createCompilerHost({});
const program = ts.createProgram(
  [path.join(__dirname, "./index.ts")],
  {},
  compilerHost
);
program.emit(undefined, undefined, undefined, undefined, {
  before: [transform]
});
