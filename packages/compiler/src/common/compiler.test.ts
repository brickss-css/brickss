import test from "ava";
import { Compiler } from "./compiler";

test("Compiler: should compile styles with just properties", t => {
  let compiler = new Compiler("test-hash", {
    color: { type: "string", value: "red" }
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should compile styles with simple selector", t => {
  let compiler = new Compiler("test-hash", {
    ".simple-selector": {
      color: { type: "string", value: "red" }
    }
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should compile styles with modifier only selectors", t => {
  let compiler = new Compiler("test-hash", {
    "[state|inverse]": {
      color: { type: "string", value: "red" }
    },

    "[state|size=small]": {
      color: { type: "string", value: "red" }
    },

    "[state|inverse|size=small]": {
      color: { type: "string", value: "red" }
    }
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should compile styles with nested inside modifier selectors", t => {
  let compiler = new Compiler("test-hash", {
    "[state|inverse|size=small]": {
      ":hover": {
        color: { type: "string", value: "red" }
      },

      ".button": {
        color: { type: "string", value: "red" },

        ".icon": {
          color: { type: "string", value: "red" }
        }
      }
    }
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should compile styles with multiple modifiers permutations", t => {
  let compiler = new Compiler("test-hash", {
    "[state|inverse]": {
      ".something[state|size=small], .something-else": {
        ".button": {}
      }
    }
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should compile styles with selectors: '[state|inverse], .icon[state|warning]'", t => {
  let compiler = new Compiler("test-hash", {
    "[state|inverse], .icon[state|warning]": {}
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should compile styles with selectors: '> .something'", t => {
  let compiler = new Compiler("test-hash", {
    "> .something": {}
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should support element selectors", t => {
  let compiler = new Compiler("test-hash", {
    ".title": {
      marginTop: { type: "string", value: "10px" },
      a: {
        color: { type: "string", value: "#fff" }
      }
    }
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should support selectors 'div + div'", t => {
  let compiler = new Compiler("test-hash", {
    "div + div": {
      margin: { type: "string", value: "30px" }
    }
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should support nested selectors", t => {
  let compiler = new Compiler("test-hash", {
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
    }
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should support multiple psuedo elements/selectors", t => {
  let compiler = new Compiler("test-hash", {
    ".icon[state|size=small]": {
      padding: { type: "string", value: "20px" },
      ":hover": {
        color: { type: "string", value: "red" }
      },
      "::before, ::after": {
        content: { type: "string", value: "''" }
      }
    }
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});

test("Compiler: should support @media rule", t => {
  let compiler = new Compiler("test-hash", {
    "@media screen and (min-width: 900px)": {
      color: { type: "string", value: "black" },

      ".something[state|inverse]": {
        color: { type: "string", value: "blue" }
      }
    }
  } as const);
  let rootScope = compiler.run();
  t.snapshot(JSON.stringify(rootScope, null, 2));
});
