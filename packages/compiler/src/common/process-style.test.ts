import test from "ava";
import { processStyle } from "./process-style";

let unprocessedStyle = {
  color: "red",

  // TODO:
  // "[state|inverse]": {
  //   backgroundColor: "yellow"
  // },

  ":hover": {
    color: "green"
  },

  backgroundColor: "red",

  ".something[state|inverse]": {
    color: "green",
    fontSize: "var(--my-font-size__hash)"
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

  // TODO:
  // div: {
  //   color: "purple"
  // }
};

// .scope--inverse .something

let filePath = "packages/something/button.ts";

test("should process basic style", t => {
  let result = processStyle(unprocessedStyle, filePath);
  // console.log(JSON.stringify(result, null, 2));
  // t.pass();
  t.snapshot(result);
});
