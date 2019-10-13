import { css, cssVar } from "@brickss/compiler";
const myVar = cssVar("my-font-size", "13px");
const myVar2 = cssVar("my-font-size-2", "15px");
const redColor = "red";

const styles = css({
  background: "green",
  fontSize: myVar,
  lineHeight: myVar2,
  ".something": {
    color: redColor,
    padding: "10px"
  },
  ".something[state|inverse]": {
    color: "#fff"
  }
});

function render(inverse = false) {
  console.log("rendering");
  const root = document.getElementById("root");
  const className = styles.scope({ inverse });
  root.innerHTML = `
    <div class="${className}">
      <p class="${styles.something()}">Hello Sam</p>
      <button id="update">Toggle Inverse</button>
    </div>
  `;
}

let inverse = true;
document.addEventListener("click", e => {
  if (e.target.id === "update") {
    inverse = !inverse;
    const className = styles.scope({ inverse });
    document.querySelector("." + styles.scope()).className = className;
  }
});

render(inverse);
