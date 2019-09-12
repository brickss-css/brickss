import test from "ava";
import { printStyles, PrintableValue } from "./print-styles";
import { Compiler } from "./compiler";

let unprocessedStyle = {
  color: { type: "string", value: "red" },

  ":hover": {
    color: { type: "string", value: "green" }
  },

  "[state|inverse]": {
    color: { type: "string", value: "red" },

    ".something[state|inverse], .something-else": {
      color: { type: "string", value: "green" },
      fontSize: { type: "identifier", value: "myVar" }
    }
  },

  backgroundColor: { type: "string", value: "red" },

  div: {
    margin: { type: "string", value: "10px" }
  },

  "> div": {
    margin: { type: "string", value: "20px" }
  },

  "div + div": {
    margin: { type: "string", value: "30px" }
  },

  ".something[state|inverse]": {
    color: { type: "string", value: "green" },
    fontSize: { type: "identifier", value: "myVar" },
    paddingTop: { type: "string", value: "10px" },
    paddingLeft: { type: "string", value: "10px" },
    paddingBottom: { type: "string", value: "10px" },
    paddingRight: { type: "string", value: "10px" },

    ":hover": {
      ".icon": {
        padding: { type: "string", value: "10px" }
      }
    }
  },

  ".icon[state|size=small]": {
    padding: { type: "string", value: "20px" },
    ":hover": {
      color: { type: "string", value: "red" }
    },
    "::before, ::after": {
      content: { type: "string", value: "" }
    }
  },

  ".something[state|inverse], .something-else": {
    color: { type: "string", value: "green" },
    fontSize: { type: "identifier", value: "myVar" }
  },

  "@media screen and (min-width: 900px)": {
    color: { type: "string", value: "black" },

    ".something[state|inverse]": {
      color: { type: "string", value: "blue" }
    }
  }
} as const;

let filePath = "packages/something/button.ts";

let stringfy = (styles: Array<PrintableValue>) =>
  styles
    .map(style => {
      if (style.type === "static") {
        return style.value;
      }
      return `${style.value.name}: "{${style.value.identifier}}";`;
    })
    .join("");

test("should process basic style", async t => {
  let compiler = new Compiler("button", unprocessedStyle);
  let result = printStyles(compiler.run());
  t.snapshot(stringfy(result));
});
