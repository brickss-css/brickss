import * as React from "react";
import * as ReactDOM from "react-dom";
import { css } from "@brickss/compiler";

const FoldableImage = ({ width, height, alt, percentage, src }) => {
  const backgroundImage = `url(${src})`;

  return (
    <div
      className={foldableImageStyles.scope({ folded: percentage > 50 })}
      style={{
        transform: `translateY(${percentage / 4}%)`
      }}
    >
      <div
        className={foldableImageStyles.topHalf()}
        style={{
          width,
          height: height / 2
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width,
            height
          }}
        />
      </div>
      <div
        className={foldableImageStyles.bottomHalf()}
        style={{
          width,
          height: height / 2,
          backgroundImage,
          backgroundPosition: "0 100%",
          transform: `rotateX(${convertPercentageToRotation(percentage)}deg)`
        }}
      >
        <div
          className={foldableImageStyles.shadow()}
          style={{
            opacity: percentage * 0.015
          }}
        />
        <div className={foldableImageStyles.backside()} />
      </div>

      {/*
        Because the entire card is translating down during the fold, I'm
        seeing a flicker in the crook of the fold. Repeating our trick a third
        time, I can apply the image to a 2px-tall element positioned in the
        crook of the fold.
        If you aren't translating the card during folding, you shouldn't need
        this fix.
      */}
      <div
        className={foldableImageStyles.flickerFixer()}
        style={{
          top: height * 0.5,
          backgroundImage
        }}
      />
    </div>
  );
};

const convertPercentageToRotation = percentage => percentage * 1.8;

const foldableImageStyles = css({
  display: "inline-block",
  perspective: "1250px",
  transition: "transform 1s",

  ".top-half": {
    borderRadius: "10px 10px 0 0",
    overflow: "hidden",
    position: "relative",
    zIndex: 2,
    backgroundSize: "cover"
  },

  ".bottom-half": {
    transformOrigin: "top center",
    transformStyle: "preserve-3d",
    borderRadius: "0 0 10px 10px",
    position: "relative",
    zIndex: 2,
    backgroundSize: "cover",
    transition: "transform 1s"
  },

  ".backside": {
    position: "absolute",
    top: "-1px",
    left: "-1px",
    right: "-1px",
    bottom: "-1px",
    background: "rgba(255, 255, 255, 0.9)",
    transform: "rotateX(180deg) translateZ(2px)",
    backfaceVisibility: "hidden",
    borderRadius: "10px 10px 0 0"
  },

  ".shadow": {
    position: "absolute",
    zIndex: "3",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "#000",
    backfaceVisibility: "hidden",
    borderRadius: "0 0 10px 10px",
    transform: "translateZ(0.01px)",
    transition: "opacity 1s"
  },

  ".flicker-fixer": {
    position: "absolute",
    zIndex: "1",
    left: "0",
    width: "100%",
    height: "2px",
    backgroundPosition: "0% 50%",
    transition: "opacity 1s"
  },

  ".flicker-fixer[state|folded]": {
    opacity: 0
  }
});

const Demo = () => {
  const [state, setState] = React.useState(30);
  return (
    <>
      <div className={containerStyles.scope()} style={{ width: 460 }}>
        <FoldableImage
          width={460}
          height={460}
          src="https://avatars1.githubusercontent.com/u/200119?s=460&v=4"
          alt="Foldable Image"
          percentage={state}
        />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={state}
        onChange={e => setState(e.target.value)}
      />
    </>
  );
};

const containerStyles = css({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translateY(-50%) translateX(-50%)"
});

ReactDOM.render(<Demo />, document.getElementById("app"));
