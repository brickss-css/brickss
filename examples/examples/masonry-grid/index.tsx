import * as React from "react";
import * as ReactDOM from "react-dom";
import { css } from "@brickss/compiler";

const data = [
  {
    css:
      "url(https://images.pexels.com/photos/416430/pexels-photo-416430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 150
  },
  {
    css:
      "url(https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 300
  },
  {
    css:
      "url(https://images.pexels.com/photos/911738/pexels-photo-911738.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 300
  },
  {
    css:
      "url(https://images.pexels.com/photos/358574/pexels-photo-358574.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 300
  },
  {
    css:
      "url(https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 300
  },
  {
    css:
      "url(https://images.pexels.com/photos/96381/pexels-photo-96381.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 300
  },
  {
    css:
      "url(https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 200
  },
  {
    css:
      "url(https://images.pexels.com/photos/227675/pexels-photo-227675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 300
  },
  {
    css:
      "url(https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 200
  },
  {
    css:
      "url(https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 400
  },
  {
    css:
      "url(https://images.pexels.com/photos/988872/pexels-photo-988872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 200
  },
  {
    css:
      "url(https://images.pexels.com/photos/249074/pexels-photo-249074.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 150
  },
  {
    css:
      "url(https://images.pexels.com/photos/310452/pexels-photo-310452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 400
  },
  {
    css:
      "url(https://images.pexels.com/photos/380337/pexels-photo-380337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
    height: 200
  }
].sort(() => Math.random() - Math.random());

const appStyles = css({
  position: "relative",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif",
  width: "100%",
  height: "100%",

  "> div": {
    position: "absolute",
    willChange: "transform, width, height, opacity",
    padding: "15px",

    "> div": {
      position: "relative",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      textTransform: "uppercase",
      fontSize: "10px",
      lineHeight: "10px",
      borderRadius: "4px",
      boxShadow: "0px 10px 50px -10px rgba(0, 0, 0, 0.2)"
    }
  }
});

function App() {
  const columns = useMedia(
    ["(min-width: 1500px)", "(min-width: 1000px)", "(min-width: 600px)"],
    [5, 4, 3],
    2
  );
  const [bind, { width }] = useMeasure();
  const className = appStyles();

  let heights = new Array(columns).fill(0);
  const displayItems = data.map((child, i) => {
    const column = heights.indexOf(Math.min(...heights));
    const xy = [
      (width / columns) * column,
      (heights[column] += child.height) - child.height
    ];
    return { ...child, xy, width: width / columns, height: child.height };
  });

  return (
    <div
      ref={bind.ref}
      class={className}
      style={{ height: Math.max(...heights) }}
    >
      {displayItems.map(({ css, xy, width, height }) => (
        <div
          key={css}
          style={{
            transform: `translate3d(${xy[0]}px,${xy[1]}px,0)`,
            width,
            height
          }}
        >
          <div style={{ backgroundImage: css }} />
        </div>
      ))}
    </div>
  );
}

function useMedia(queries, values, defaultValue) {
  const match = () =>
    values[queries.findIndex(q => matchMedia(q).matches)] || defaultValue;
  const [value, set] = React.useState(match);
  React.useEffect(() => {
    const handler = () => set(match);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return value;
}

function useMeasure() {
  const ref = React.useRef();
  const [bounds, set] = React.useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });
  const [ro] = React.useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  );
  React.useEffect(() => (ro.observe(ref.current), ro.disconnect), []);
  return [{ ref }, bounds];
}

ReactDOM.render(<App />, document.getElementById("app"));
