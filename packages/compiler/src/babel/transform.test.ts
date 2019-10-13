import test from "ava";
import * as babel from "@babel/core";
import * as transform from "./transform";

let options = {
  presets: [require.resolve("@babel/preset-env")],
  plugins: [transform]
};

let source = `
import { css as cs, cssVar } from "@brickss/compiler";

const randomHeight = () => Math.random();
const myVar = cssVar("my-font-size", "13px");
const dynamicValueCssVar = cssVar("height", \`$\{randomHeight() * 100}px\`);
const justAVar = "red";
const colors = { black: '#000' };

export const exportedCssVar = cssVar("my-font-size-2", "15px");

const styles = cs({
  background: "green",
  fontSize: myVar,
  lineHeight: exportedCssVar,
  height: dynamicValueCssVar,
  ".something": {
    color: justAVar,
    padding: "10px"
  },
  ".something[state|inverse]": {
    color: "#fff",
    "::before, ::after": {
      content: "",
      display: "block"
    }
  },
  "[state|inverse]": {
    ".icon": {
      color: colors.black
    }
  },
  "[state|size=small]": {
    ".icon": {
      color: "#f00"
    }
  }
});

function render(inverse = false) {
  console.log("rendering");
  const root = document.getElementById("root");
  const className = styles({ inverse });
  root.innerHTML = \`
    <div class="$\{className}">
      <p class="$\{styles.something}">Hello Sam</p>
      <button id="update">Toggle Inverse</button>
    </div>
  \`;
}

let inverse = true;
document.addEventListener("click", e => {
  if (e.target.id === "update") {
    const className = styles({ inverse });
    document.querySelector("." + styles.scope).className = className;
    inverse = !inverse;
  }
});

render(inverse);
`;

test("Babel: test transform", t => {
  t.notThrows(() => {
    let transformed = babel.transform(source, options).code;
    console.log(transformed);
  });
});

test("Babel: should throw [BSS1001] when an argument of 'css' function is not an ObjectExpression", t => {
  let error = t.throws(
    () =>
      babel.transform(
        `
  import { css } from "@brickss/compiler";
  const b = 123;
  const styles = css(b);
  `,
        options
      ).code
  );
  t.true(error.message.includes("BSS1001"));
});
