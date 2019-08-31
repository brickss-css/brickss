let path = require("path");
let fs = require("fs");
let ts = require("typescript");
let rollup = require("rollup");
let nodeResolve = require("rollup-plugin-node-resolve");
let commonjs = require("rollup-plugin-commonjs");
let replace = require("rollup-plugin-replace");
let { transform } = require("@brickss/compiler");

// Just a new line for output
console.log();

let name = process.argv[2] || "all";
if (name !== "all") {
  compile(name);
} else {
  fs.readdirSync(path.join(__dirname, "examples"))
    .filter(file => !file.startsWith("."))
    .forEach(file => compile(file));
}

async function compile(example) {
  let htmlFilePath = path.join(__dirname, "examples", example, "index.html");
  let tsFilePath = path.join(__dirname, "examples", example, "index.tsx");
  let jsFilePath = path.join(__dirname, "examples", example, "index.js");

  compileTS(tsFilePath);
  await bundle(jsFilePath);

  console.log(`${example} – ${htmlFilePath}`);
}

function compileTS(filePath) {
  let program = ts.createProgram([filePath], {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.React
  });
  program.emit(undefined, undefined, undefined, undefined, {
    before: [transform]
  });
}

async function bundle(filePath) {
  let bundle = await rollup.rollup({
    input: filePath,
    plugins: [
      nodeResolve(),
      commonjs({
        namedExports: {
          "../node_modules/react/index.js": [
            "Children",
            "Component",
            "PropTypes",
            "createElement"
          ],
          "../node_modules/react-dom/index.js": ["render"]
        }
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development")
      })
    ]
  });

  await bundle.write({
    file: filePath,
    format: "iife",
    name: "brickss__bundle"
  });
}
