## CSS-in-JS library for libraries.

[![CircleCI](https://circleci.com/gh/brickss-css/brickss.svg?style=svg)](https://circleci.com/gh/brickss-css/brickss)

### Basic example:

`yarn build:example` or
`yarn build:example basic`

- Small runtime < 300b min + gzip
  - Ahead of time compilation
    - Babel + TypeScript
- Dynamic values:
  - CSS variables based theming
  - CSS-Blocks like state
- Object styles
  - Nested scss style nesting
  - All css media, keyframe, etc...
- Interoperability with emotion and styled-components themes
- More deterministic class names
  - Using filename + file hash
- PostCSS + plugins
- SSR – TBD

### Example API:

```javascript
import React from "react";
import { css, setTheme, cssVar } from "brickss";

// const myVar = cssVar('my-font-size');
const myVar = "var(--my-font-size__hash)";

// const style = css({
//   color: 'red',
//   '[state|inverse]': {
//      backgroundColor: 'yellow'
//   }.
//   ':hover': {
//      color: 'green',
//   },
//   ".something[state|inverse]": {
//     color: 'green',
//     fontSize: myVar
//   },
//   ".something[state|inverse], .something_else": {
//     color: 'green',
//     fontSize: myVar
//   },
//   "@media screen and (min-width: 900px)": {
//      color: 'black'
//   }
// }, {
//   [myVar]: `13px`
// });

const style = state => {
  injectCss(
    "file__hash",
    `
    .file__hash {
      font-size: default;
      font-size: var(--my-font-size);
    }
  `
  );

  return classNames;
};
style.something = ".something__hash";

export function ThemeProvider({ theme }) {
  let className = setTheme(theme);
  return <div className={className}>{children}</div>;
}

export default function Button({ size, inverse, icon, children }) {
  const classNames = style({
    inverse
  });

  return (
    <ThemeProvider theme={{ [myVar]: "20px" }}>
      <button className={classNames}>
        {icon && <span className={style.something}>{icon}</span>}
        {children}
      </button>
    </ThemeProvider>
  );
}
```
