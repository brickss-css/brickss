import * as React from "react";
import * as ReactDOM from "react-dom";
import { css } from "@brickss/compiler";

let colors = [
  "#a6e22e",
  "#a1efe4",
  "#66d9ef",
  "#ae81ff",
  "#cc6633",
  "#4CAF50",
  "#00BCD4",
  "#5C6BC0"
];

let barChartStyles = css({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  marginTop: "100px",

  ".bar-wrapper": {
    marginRight: "5px"
  },

  ".bar-title": {
    textAlign: "center",
    fontFamily: "Helvetica Neue, Calibri Light, Roboto, sans-serif",
    fontSize: "0.7rem",
    marginBottom: "4px"
  },

  ".bar": {
    width: "38px",
    borderRadius: "3px 3px 0 0",
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
  }
});

function App() {
  let className = barChartStyles();
  return (
    <div className={className}>
      {colors.map((color, idx) => {
        var height = (idx / colors.length) * 140 + 60;
        return (
          <div className={barChartStyles.barWrapper}>
            <div className={barChartStyles.barTitle} style={{ color }}>
              {height}
            </div>
            <div
              className={barChartStyles.bar}
              style={{
                backgroundColor: color,
                height
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
