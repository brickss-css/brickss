import { css, cssVar } from "@brickss/compiler";

const randomHeight = () => Math.random();
const myVar = cssVar("my-font-size", "13px");
const dynamicValueCssVar = cssVar("height", `${randomHeight()}px`);

export const exportedCssVar = cssVar("my-font-size-2", "15px");

console.log(exportedCssVar);

const styles = css({
  background: "green",
  fontSize: myVar,
  lineHeight: exportedCssVar,
  height: dynamicValueCssVar,
  ".something": {
    color: "red",
    padding: "10px"
  },
  ".something[state|inverse]": {
    color: "#fff",
    "::before, ::after": {
      content: "",
      display: "block"
    }
  }
});

function render(inverse = false) {
  console.log("rendering");
  const root = document.getElementById("root");
  const className = styles({ inverse });
  root!.innerHTML = `
    <div class="${className}">
      <p class="${styles.something}">Hello Sam</p>
      <button id="update">Toggle Inverse</button>
    </div>
  `;
}

let inverse = true;
document.addEventListener("click", e => {
  if ((e.target as HTMLElement).id === "update") {
    const className = styles({ inverse });
    document.querySelector("." + styles.scope)!.className = className;
    inverse = !inverse;
  }
});

render(inverse);
