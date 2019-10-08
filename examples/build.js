let path = require("path");
let fs = require("fs");
let rollup = require("rollup");
let nodeResolve = require("rollup-plugin-node-resolve");
let commonjs = require("rollup-plugin-commonjs");
let babel = require("rollup-plugin-babel");
let replace = require("rollup-plugin-replace");

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
  let sourceFilePath = path.join(__dirname, "examples", example, "index.tsx");
  let outputFilePath = path.join(__dirname, "examples", example, "index.js");

  await bundle(sourceFilePath, outputFilePath);

  console.log(`${example} – ${htmlFilePath}`);
}

async function bundle(filePath, outputPath) {
  let bundle = await rollup.rollup({
    input: filePath,
    plugins: [
      nodeResolve(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      commonjs({
        include: /node_modules|packages/,
        namedExports: {
          "../node_modules/react/index.js": [
            "Children",
            "Component",
            "Fragment",
            "PropTypes",
            "createElement",
            "useState",
            "useEffect",
            "useRef"
          ],
          "../node_modules/react-dom/index.js": ["render"]
        }
      }),
      babel({
        exclude: "node_modules/**",
        extensions: ["js", "jsx", "ts", "tsx"]
      })
    ]
  });

  await bundle.write({
    file: outputPath,
    format: "iife",
    name: "brickss__bundle"
  });
}
