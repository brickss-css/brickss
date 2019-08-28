import test from "ava";
import { printStyles } from "./print-styles";
import { processStyle } from "./process-style";

let unprocessedStyle = {
  color: "red",

  ":hover": {
    color: "green"
  },

  backgroundColor: "red",

  ".something[state|inverse]": {
    color: "green",
    fontSize: "var(--my-font-size__hash)",
    paddingTop: "10px",
    paddingLeft: "10px",
    paddingBottom: "10px",
    paddingRight: "10px"
  },

  ".icon[state|size=small]": {
    padding: "20px"
  },

  ".something[state|inverse], .something-else": {
    color: "green",
    fontSize: "var(--my-font-size__hash)"
  },

  "@media screen and (min-width: 900px)": {
    color: "black",

    ".something[state|inverse]": {
      color: "blue"
    }
  }
};

let filePath = "packages/something/button.ts";

test("should process basic style", async t => {
  let result = await printStyles(processStyle(unprocessedStyle, filePath));
  t.snapshot(result);
});

test("should process basic style and output minified result", async t => {
  let result = await printStyles(
    processStyle(unprocessedStyle, filePath),
    true
  );
  t.snapshot(result);
});
