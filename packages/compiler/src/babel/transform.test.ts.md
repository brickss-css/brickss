# Snapshot report for `packages/compiler/src/babel/transform.test.ts`

The actual snapshot is saved in `transform.test.ts.snap`.

Generated by [AVA](https://ava.li).

## Babel: test transform

> Snapshot 1

    `"use strict";␊
    ␊
    Object.defineProperty(exports, "__esModule", {␊
      value: true␊
    });␊
    exports.exportedCssVar = void 0;␊
    ␊
    var _runtime = _interopRequireDefault(require("@brickss/runtime"));␊
    ␊
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }␊
    ␊
    var randomHeight = function randomHeight() {␊
      return Math.random();␊
    };␊
    ␊
    var myVar = {␊
      name: "my-font-size__370bd",␊
      defaultValue: "13px"␊
    };␊
    var dynamicValueCssVar = {␊
      name: "height__8765d",␊
      defaultValue: "".concat(randomHeight() * 100, "px")␊
    };␊
    var exportedCssVar = {␊
      name: "my-font-size-2__878e3",␊
      defaultValue: "15px"␊
    };␊
    exports.exportedCssVar = exportedCssVar;␊
    ␊
    var styles = function brickss__ef117(state) {␊
      if (state === void 0) {␊
        state = {};␊
      }␊
    ␊
      _runtime["default"]._i("styles-a6952", ".styles-a6952 { background: green;" + ((myVar.defaultValue ? "font-size: " + myVar.defaultValue + ";" : "") + "font-size: " + "var(--" + myVar.name + ", " + (myVar.defaultValue || "") + ");" + ((exportedCssVar.defaultValue ? "line-height: " + exportedCssVar.defaultValue + ";" : "") + "font-size: " + "var(--" + exportedCssVar.name + ", " + (exportedCssVar.defaultValue || "") + ");" + ((dynamicValueCssVar.defaultValue ? "height: " + dynamicValueCssVar.defaultValue + ";" : "") + "font-size: " + "var(--" + dynamicValueCssVar.name + ", " + (dynamicValueCssVar.defaultValue || "") + ");" + ("} .styles-a6952__something { color: red; padding: 10px; } .styles-a6952--inverse .styles-a6952__something { color: #fff; } .styles-a6952--inverse .styles-a6952__something::before, .styles-a6952--inverse .styles-a6952__something::after { content: ; display: block; }  .styles-a6952--inverse .styles-a6952__icon { color: #000; }  .styles-a6952--size-small .styles-a6952__icon { color: #f00; }" + "")))));␊
    ␊
      brickss__ef117.scope = "styles-a6952";␊
      brickss__ef117.something = "styles-a6952__something";␊
      brickss__ef117.icon = "styles-a6952__icon";␊
      brickss__ef117.state = {};␊
      brickss__ef117.state.inverse = "styles-a6952--inverse";␊
      brickss__ef117.state.sizeSmall = "styles-a6952--size-small";␊
      return _runtime["default"]._os({␊
        "styles-a6952--inverse": state.inverse,␊
        "styles-a6952--size-small": state.size === "small",␊
        "styles-a6952": true␊
      });␊
    };␊
    ␊
    function render() {␊
      var inverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;␊
      console.log("rendering");␊
      var root = document.getElementById("root");␊
      var className = styles({␊
        inverse: inverse␊
      });␊
      root.innerHTML = "\\n    <div class=\\"".concat(className, "\\">\\n      <p class=\\"").concat(styles.something, "\\">Hello Sam</p>\\n      <button id=\\"update\\">Toggle Inverse</button>\\n    </div>\\n  ");␊
    }␊
    ␊
    var inverse = true;␊
    document.addEventListener("click", function (e) {␊
      if (e.target.id === "update") {␊
        var className = styles({␊
          inverse: inverse␊
        });␊
        document.querySelector("." + styles.scope).className = className;␊
        inverse = !inverse;␊
      }␊
    });␊
    render(inverse);`
