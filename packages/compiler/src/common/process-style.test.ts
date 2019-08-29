import test from "ava";
import { processStyle } from "./process-style";

let unprocessedStyle = {
  color: { type: "string", value: "red" },

  ":hover": {
    color: { type: "string", value: "green" }
  },

  backgroundColor: { type: "string", value: "red" },

  ".something[state|inverse]": {
    color: { type: "string", value: "green" },
    fontSize: { type: "identifier", value: "myVar" },
    paddingTop: { type: "string", value: "10px" },
    paddingLeft: { type: "string", value: "10px" },
    paddingBottom: { type: "string", value: "10px" },
    paddingRight: { type: "string", value: "10px" }
  },

  ".icon[state|size=small]": {
    padding: { type: "string", value: "20px" }
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
};

// .scope--inverse .something

let filePath = "packages/something/button.ts";

test("should process basic style", t => {
  let result = processStyle(unprocessedStyle, filePath);
  t.snapshot(result);
});
