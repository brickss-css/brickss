// import { before, beforeEach, afterEach } from "ava";
const { before, beforeEach, afterEach } = require("ava");

class HTMLElement {
  constructor() {
    this._attributes = {};
    this._inner = undefined;
  }

  setAttribute(key, value) {
    this._attributes[key] = value;
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
    global.doc = undefined;
    global.document = undefined;
  });

  beforeEach(() => {
    global.doc = [];
    global.document = {
      getElementById: id => {
        return global.doc.find(([attrs]) => {
          return attrs.id === id;
        });
      },
      createElement: () => {
        return new HTMLElement();
      },
      createTextNode: text => {
        return new TextNode(text);
      },
      head: {
        appendChild: child => {
          global.doc.push(child.__getValue());
        }
      }
    };
  });
};
