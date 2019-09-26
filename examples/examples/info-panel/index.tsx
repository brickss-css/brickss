import * as React from "react";
import * as ReactDOM from "react-dom";
import { css } from "@brickss/compiler";

let panelStyles = css({
  fontFamily: "Arial",
  fontSize: "12px",

  position: "absolute",
  zIndex: "10001 !important",
  top: "50%",

  marginLeft: "50%",
  padding: "9px",
  paddingBottom: "0",

  transform: "translateY(-50%) translateX(-50%)",

  color: "#555",
  border: "1px solid rgba(0, 0, 0, 0.02)",
  borderRadius: "2px",
  background: "rgba(250, 250, 250, 1)",
  boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.05)",

  minWidth: "300px",

  ".mute": {
    color: "#bbb"
  },

  ".badge-col": {
    width: "1%",
    padding: "0 4px 0 2px"
  },

  ".table": {
    fontSize: "13px",
    marginBottom: "6px",

    table: {
      width: "100%"
    },

    td: {
      paddingBottom: "3px",
      verticalAlign: "top",
      lineHeight: "18px"
    }
  },

  ".table-sep": {
    borderTop: "1px solid rgba(0, 0, 0, 0.07)"
  },

  ".files": {
    opacity: "0.9",
    color: "#282"
  },

  ".nobr": {
    whiteSpace: "nowrap"
  }
});

let badgeStyles = css({
  display: "inline-block",
  padding: "0 4px",
  color: "rgba(255, 255, 255, 0.8)",
  borderRadius: "2px",
  background: "rgba(248, 204, 50, 1)",

  "[state|color=cyan]": {
    background: "rgba(159, 194, 196, 1)"
  },

  "[state|color=purple]": {
    background: "rgba(164, 138, 212, 1)"
  },

  "[state|color=blue]": {
    background: "rgba(83, 183, 199, 1)"
  }
});

function App() {
  return (
    <div className={panelStyles()}>
      <div className={panelStyles.table}>
        <table>
          <tr>
            <td>
              <span className={panelStyles.mute}>Scope:</span>
            </td>
            <td className={panelStyles.badgeCol}>
              <span className={badgeStyles()}>fn</span>
            </td>
            <td>z-entity-gallery__thumbs</td>
          </tr>
          <tr>
            <td />
            <td className={panelStyles.badgeCol}>
              <span className={badgeStyles({ color: "purple" })}>bem</span>
            </td>
            <td>
              <span className={panelStyles.mute}>block:</span>
              z-entity-gallery
              <span className={panelStyles.mute}> | elem:</span>
              image
            </td>
          </tr>
          <tr>
            <td colspan="4" className={panelStyles.tableSep} />
          </tr>
          <tr>
            <td>
              <span className={panelStyles.mute}>Parent:</span>
            </td>
            <td className={panelStyles.badgeCol}>
              <span className={badgeStyles({ color: "blue" })}>P</span>
            </td>
            <td>z-entity-gallery</td>
          </tr>
          <tr>
            <td colspan="4" className={panelStyles.tableSep} />
          </tr>
          <tr>
            <td>
              <span className={panelStyles.mute}>File:</span>
            </td>
            <td colspan="2" className={panelStyles.files}>
              contribs/z-entity-search/blocks-deskpad/z-entity-gallery/__thumbs/z-entity-gallery__thumbs.priv.js:22
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
