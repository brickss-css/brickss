import test from "ava";
import { processStyle } from "./process-style";

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
  },

  "[state|info]": {
    ".icon": {
      color: { type: "string", value: "#0052CC" }
    }
  },

  "[state|note]": {
    ".icon": {
      color: { type: "string", value: "#0052CC" }
    }
  }
};

let filePath = "packages/something/button.ts";

test("should process basic style", t => {
  let result = processStyle(unprocessedStyle, filePath);
  t.snapshot(JSON.stringify(result, null, 2));
});
