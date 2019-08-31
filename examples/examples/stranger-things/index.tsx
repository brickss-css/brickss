import * as React from "react";
import * as ReactDOM from "react-dom";
import { css, cssVar } from "@brickss/compiler";

let appStyles = css({
  a: {
    textDecoration: "none"
  },
  h1: {
    fontWeight: "300"
  },
  ".row": {
    padding: "50px"
  }
});

let cardStyles = css({
  padding: "0 1.7rem",
  width: "380px",
  margin: "0 auto",
  ".wrapper": {
    "background-color": "#fff",
    "min-height": "540px",
    position: "relative",
    overflow: "hidden",
    "box-shadow":
      "0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.2)",
    background:
      "url(https://tvseriescritic.files.wordpress.com/2016/10/stranger-things-bicycle-lights-children.jpg) center / cover no-repeat",

    ":hover": {
      ".data": {
        transform: "translateY(0)"
      }
    }
  },

  ".header": {
    color: "#fff",
    padding: "1em",
    "::before, ::after": {
      content: "",
      display: "table"
    },
    "::after": {
      clear: "both"
    }
    // TODO: support nesting like that
    // ".date": {
    //   float: "left",
    //   fontSize: "12px"
    // }
  },

  ".date": {
    float: "left",
    fontSize: "12px"
  },

  ".data": {
    position: "absolute",
    bottom: "0",
    width: "100%",
    transition: "transform 0.3s",
    color: "#fff",
    transform: "translateY(calc(70px + 4em))"
  },

  ".content": {
    padding: "1em",
    position: "relative",
    // TODO: support numbers
    zIndex: 1
  },

  ".author": {
    fontSize: "12px"
  },

  ".title": {
    marginTop: "10px",
    a: {
      color: "#fff"
    }
  },

  ".text": {
    height: "70px",
    margin: 0
  },

  ".button": {
    display: "block",
    width: "100px",
    margin: "2em auto 1em",
    textAlign: "center",
    fontSize: "12px",
    color: "#fff",
    lineHeight: "1",
    position: "relative",
    fontWeight: "700",

    "::after": {
      content: "'\2192'",
      opacity: "0",
      position: "absolute",
      right: "0",
      top: "50%",
      transform: "translate(0, -50%)",
      transition: "all 0.3s"
    },

    ":hover::after": {
      transform: "translate(5px, -50%)",
      opacity: 1
    }
  }
});

function DateCmp(props) {
  return <div className={cardStyles.date}>{props.children}</div>;
}

function Button(props) {
  return (
    <a href="#" className={cardStyles.button}>
      {props.children}
    </a>
  );
}

function Title(props) {
  return <h1 className={cardStyles.title}>{props.children}</h1>;
}

function Link({ href, children }) {
  return <a href={href || "#"}>{children}</a>;
}

function App() {
  let classNames = appStyles({});
  let cardClassNames = cardStyles({});
  return (
    <div className={classNames}>
      <div className={appStyles.row}>
        <div className={cardClassNames}>
          <div className={cardStyles.wrapper}>
            <div className={cardStyles.header}>
              <DateCmp>12 Aug 2016</DateCmp>
            </div>
            <div className={cardStyles.data}>
              <div className={cardStyles.content}>
                <span className={cardStyles.author}>Jane Doe</span>
                <Title>
                  <Link href="#">
                    Stranger Things: The sound of the Upside Down
                  </Link>
                </Title>
                <p className={cardStyles.text}>
                  The antsy bingers of Netflix will eagerly anticipate the
                  digital release of the Survive soundtrack, out today.
                </p>
                <Button>Read more</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
