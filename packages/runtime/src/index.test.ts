import test from "ava";
import { injectCss, objStr } from "./index";

const window = global as any;

// @ts-ignore
setup();

test("injectCss: injects basic style tag", t => {
  injectCss(
    `
  .file__hash {
    font-size: default;
    font-size: var(--my-font-size);
  }
`,
    "file__hash"
  );

  t.deepEqual(window.doc, [
    [
      { id: "brickss_file__hash" },
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
      `
    .file__hash {
      font-size: default;
      font-size: var(--my-font-size);
    }
  `,
      "file__hash"
    );
  }

  t.deepEqual(window.doc, [
    [
      { id: "brickss_file__hash" },
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

  t.deepEqual(classNames, 'inverse');
});
