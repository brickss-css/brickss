// Source: https://codepen.io/liamj/pen/vYYLGZj

import { css, cssVar } from "@brickss/compiler";

const rad = cssVar("rad", ".7rem");
const dur = cssVar("dur", ".3s");
const colorDark = cssVar("colorDark", "#2f2f2f");
const colorLight = cssVar("colorLight", "#fff");
const colorBrand = cssVar("colorBrand", "#57bd84");
const fontFamily = cssVar("fontFamily", "'Lato', sans-serif");
const height = cssVar("height", "5rem");
const btnWidth = cssVar("btnWidth", "6rem");
const bezCurve = cssVar("bezCurve", "cubic-bezier(0, 0, 0.43, 1.49)");

const bodyStyles = css({
  background: colorDark,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh"
});

const styles = css({
  position: "relative",
  width: "30rem",
  background: colorBrand,
  borderRadius: rad,

  "input, button": {
    height,
    fontFamily: fontFamily,
    border: 0,
    color: colorDark,
    fontSize: "1.8rem"
  },

  "input[type='search']": {
    outline: 0,
    width: "100%",
    background: colorLight,
    padding: "0 1.6rem",
    borderRadius: rad,
    appearance: "none",
    transition: `all ${dur} ${bezCurve}`,
    transitionProperty: "width, border-radius",
    zIndex: 1,
    position: "relative"
  },

  button: {
    display: "none",
    position: "absolute",
    top: 0,
    right: 0,
    width: btnWidth,
    fontWeight: "bold",
    background: colorBrand,
    borderRadius: `0 ${rad} ${rad} 0`
  },

  "input:not(:placeholder-shown)": {
    borderRadius: `${rad} 0 0 ${rad}`,
    width: `calc(100% - ${btnWidth})`,

    "+ button": {
      display: `block`
    }
  },

  label: {
    position: "absolute",
    clip: "rect(1px, 1px, 1px, 1px)",
    padding: 0,
    border: 0,
    height: "1px",
    width: "1px",
    overflow: "hidden"
  }
});

function render() {
  const body = document.body;
  body.className = bodyStyles.scope();

  const root = document.getElementById("app");
  root.innerHTML = `
  <form onsubmit="event.preventDefault();" class="${styles.scope()}" role="search">
    <label for="search">Search for stuff</label>
    <input id="search" type="search" placeholder="Search..." autofocus required />
    <button type="submit">Go</button>
  </form>
  `;
}

render();
