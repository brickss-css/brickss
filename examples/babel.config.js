module.exports = {
  presets: [["@babel/env", { modules: false }]],
  plugins: [
    "@brickss/compiler/dist/babel/transform",
    "@babel/plugin-transform-react-jsx"
  ]
};
