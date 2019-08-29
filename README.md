## CSS-in-JS library for libraries.

[![CircleCI](https://circleci.com/gh/brickss-css/brickss.svg?style=svg)](https://circleci.com/gh/brickss-css/brickss)

### Basic example: 

`yarn workspace @brickss-examples/basic start`


- Small runtime < 300b min + gzip
  - Ahead of time compilation
    - Babel + TypeScript
- Dynamic values:
  - CSS variables based
  - Nothing complex
  - Per component dynamic values, not instance based
- Object styles
  - Nested scss style nesting
  - All css media, keyframe, etc...
- Interoperability with emotion and styled-components themes
- Async-loadable by default
- More deterministic class names
  - Using filename + file hash
- Minifiable by default
  - Not a string
- PostCSS + plugins
- CSS-Blocks like state

### Example API:

```javascript
import React from "react";
import { createStyle, setTheme, cssVar } from "brickss";

// const myVar = cssVar('my-font-size');
const myVar = "my-font-size__hash";

// const style = createStyle({
//   color: 'red',
//   "& .something[state|inverse]": {
//     color: 'green',
//     fontSize: myVar
//   }
// }, {
//   [myVar]: `13px`
// });
const style = state => {
  injectCss('file__hash', `
    .file__hash {
      font-size: default;
      font-size: var(--my-font-size);
    }
  `);

  return classNames;
};

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
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
      </button>
    </ThemeProvider>
  );
}
```
