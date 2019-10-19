// import { before, beforeEach, afterEach } from "ava";
const { before, beforeEach, afterEach } = require("ava");

class HTMLElement {
  constructor() {
    this._attributes = {};
    this._inner = undefined;
  }

  setAttribute(key, value) {
    this._attributes[key] = value;

    if (key === "id") {
      global.window[value] = true;
    }
  }

  appendChild(child) {
    this._inner = child.__getValue();
  }

  __getValue() {
    return [this._attributes, this._inner];
  }
}

class TextNode {
  constructor(text) {
    this.text = text;
  }

  __getValue() {
    return this.text;
  }
}

global.setup = () => {
  afterEach(() => {
    global.window = undefined;
    global.document = undefined;
  });

  beforeEach(() => {
    global.window = {
      doc: []
    };
    global.document = {
      createElement: () => {
        return new HTMLElement();
      },
      createTextNode: text => {
        return new TextNode(text);
      },
      head: {
        appendChild: child => {
          global.window.doc.push(child.__getValue());
        }
      }
    };
  });
};
