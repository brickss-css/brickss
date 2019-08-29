import { _i as injectCss, _os as objStr } from "@brickss/runtime";

function style() {
  injectCss(
    "basic-example-1234",
    `
    .basic-example-1234 {
      background: red;
    }
    .basic-example-1234 .basic-example-1234__something {
      color: #fff;
      padding: 10px;
    }
  `
  );

  const s = objStr({
    ["basic-example-1234"]: true
  });

  // @ts-ignore
  style.something = "basic-example-1234__something";

  return s;
}

function render() {
  console.log("rendering");
  const root = document.getElementById("root");
  const className = style();
  root.innerHTML = `
    <div class="${className}">
      <p class="${(style as any).something}">Hello Sam</p>
    </div>
  `;
}

for (var i = 0; i < 6; i++) {
  render();
}
