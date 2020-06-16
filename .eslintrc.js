// OFF = 0;
// WARN = 1;
// ERROR = 2;

module.exports = exports = {
  extends: "eslint:recommended",
  env: {
    es6: true, // We are writing ES6 code
    node: true // for node.js
  },
  rules: {
    semi: [2, "always"],
    quotes: [2, "double"],
    "no-constant-condition": [
      2,
      {
        checkLoops: false
      }
    ]
  },
  parserOptions: {
    ecmaVersion: 11
  }
};
