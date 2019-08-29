"use strict";
exports.__esModule = true;
var runtime_1 = require("@brickss/runtime");
var myVar = {
  name: "my-font-size__84ff5",
  defaultValue: "13px"
};
var myVar2 = {
  name: "my-font-size-2__84ff5",
  defaultValue: "15px"
};
var styles = function brickss_1(state) {
  if (state === void 0) {
    state = {};
  }
  runtime_1._i(
    "example-84ff5",
    ".example-84ff5 { background: green;" +
      ((myVar.defaultValue ? "font-size: " + myVar.defaultValue + ";" : "") +
        "font-size: " +
        "var(--" +
        myVar.name +
        ", " +
        (myVar.defaultValue || "") +
        ");" +
        ((myVar2.defaultValue
          ? "line-height: " + myVar2.defaultValue + ";"
          : "") +
          "line-height: " +
          "var(--" +
          myVar2.name +
          ", " +
          (myVar2.defaultValue || "") +
          ");" +
          ("} .example-84ff5__something { color: red; padding: 10px; } .example-84ff5--inverse .example-84ff5__something { color: #fff; }" +
            "")))
  );
  brickss_1.scope = "example-84ff5";
  brickss_1.something = "example-84ff5__something";
  return runtime_1._os({
    "example-84ff5": true,
    "example-84ff5--inverse": state.inverse
  });
};
function render(inverse) {
  if (inverse === void 0) {
    inverse = false;
  }
  console.log("rendering");
  var root = document.getElementById("root");
  var className = styles({ inverse: inverse });
  root.innerHTML =
    '\n    <div class="' +
    className +
    '">\n      <p class="' +
    styles.something +
    '">Hello Sam</p>\n      <button id="update">Toggle Inverse</button>\n    </div>\n  ';
}
var inverse = true;
document.addEventListener("click", function(e) {
  if (e.target.id === "update") {
    var className = styles({ inverse: inverse });
    document.querySelector("." + styles.scope).className = className;
    inverse = !inverse;
  }
});
render(inverse);
