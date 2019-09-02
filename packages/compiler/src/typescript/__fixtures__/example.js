"use strict";
exports.__esModule = true;
var runtime_1 = require("@brickss/runtime");
var randomHeight = function () { return Math.random(); };
var myVar = {
    name: "my-font-size__84ff5",
    defaultValue: "13px"
};
var dynamicValueCssVar = {
    name: "height__84ff5",
    defaultValue: randomHeight() + "px"
};
exports.exportedCssVar = {
    name: "my-font-size-2__84ff5",
    defaultValue: "15px"
};
console.log(exports.exportedCssVar);
var styles = function brickss_1(state) {
    if (state === void 0) { state = {}; }
    runtime_1._i("example-d3733__15fc0", ".example-d3733 { background: green;" + ((myVar.defaultValue ? "font-size: " + myVar.defaultValue + ";" : "") + "font-size: " + "var(--" + myVar.name + ", " + (myVar.defaultValue || "") + ");" + ((exportedCssVar.defaultValue ? "line-height: " + exportedCssVar.defaultValue + ";" : "") + "line-height: " + "var(--" + exportedCssVar.name + ", " + (exportedCssVar.defaultValue || "") + ");" + ((dynamicValueCssVar.defaultValue ? "height: " + dynamicValueCssVar.defaultValue + ";" : "") + "height: " + "var(--" + dynamicValueCssVar.name + ", " + (dynamicValueCssVar.defaultValue || "") + ");" + ("} .example-d3733__something { color: red; padding: 10px; } .example-d3733--inverse .example-d3733__something { color: #fff; } .example-d3733--inverse .example-d3733__something::before, .example-d3733--inverse .example-d3733__something::after { content: \"\"; display: block; }" + "")))));
    brickss_1.scope = "example-d3733";
    brickss_1.something = "example-d3733__something";
    return runtime_1._os({
        "example-d3733": true,
        "example-d3733--inverse": state.inverse
    });
};
function render(inverse) {
    if (inverse === void 0) { inverse = false; }
    console.log("rendering");
    var root = document.getElementById("root");
    var className = styles({ inverse: inverse });
    root.innerHTML = "\n    <div class=\"" + className + "\">\n      <p class=\"" + styles.something + "\">Hello Sam</p>\n      <button id=\"update\">Toggle Inverse</button>\n    </div>\n  ";
}
var inverse = true;
document.addEventListener("click", function (e) {
    if (e.target.id === "update") {
        var className = styles({ inverse: inverse });
        document.querySelector("." + styles.scope).className = className;
        inverse = !inverse;
    }
});
render(inverse);
