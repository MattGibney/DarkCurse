// {
//   "env": {
//     "es6": true,
//     "node": true,
//     "mocha": true
//   },
//   "parserOptions": {
//     "sourceType": "module",
//     "ecmaVersion": 9
//   },
//   "extends": ["eslint:recommended"],
//   "plugins": ["prettier"],
//   "rules": {
//     "no-console": "off",
//     "quotes": [2, "single"],
//     "prettier/prettier": "error"
//   }
// }

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ["prettier"],
  rules: {
    "no-console": "off",
    "quotes": [2, "single"],
    "prettier/prettier": "error"
  }
};