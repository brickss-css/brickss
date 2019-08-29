import test from "ava";
import { _i as injectCss, _os as objStr } from "./index";

const window = global;

// @ts-ignore
setup();

test("injectCss: injects basic style tag", t => {
  injectCss(
    "file__hash",
    `
  .file__hash {
    font-size: default;
    font-size: var(--my-font-size);
  }
`
  );

  t.deepEqual(window.doc, [
    [
      { id: "bss_file__hash" },
      `
  .file__hash {
    font-size: default;
    font-size: var(--my-font-size);
  }
`
    ]
  ]);
});

test("injectCss: injects only one style tag for the same block", t => {
  for (let i = 0; i < 4; i++) {
    injectCss(
      "file__hash",
      `
    .file__hash {
      font-size: default;
      font-size: var(--my-font-size);
    }
  `
    );
  }

  t.deepEqual(window.doc, [
    [
      { id: "bss_file__hash" },
      `
  .file__hash {
    font-size: default;
    font-size: var(--my-font-size);
  }
`
    ]
  ]);
});

test("style: returns the correct class names and inserts the style tag", t => {
  const classNames = objStr({ inverse: true, dark: false });

  t.deepEqual(classNames, "inverse");
});
