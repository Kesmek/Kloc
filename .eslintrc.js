module.exports = {
  env: {
    "react-native/react-native": true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-native", "@typescript-eslint"],
  rules: {
    "no-unused-vars": [
      "off",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false,
        caughtErrors: "all",
      },
    ],
    "react/prop-types": "off",
    "react/destructuring-assignment": "error",
    "react/display-name": "off",
    "react/function-component-definition": [
      "warn",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/no-array-index-key": "error",
    "react/no-this-in-sfc": "error",
    "react/no-unstable-nested-components": ["warn", { allowAsProps: true }],
    "react/self-closing-comp": "warn",
    "react/jsx-fragments": "warn",
    "react/jsx-no-useless-fragment": "warn",
    "react/jsx-pascal-case": "error",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react-native/no-unused-styles": "warn",
    "react-native/no-single-element-style-arrays": "warn",
    "react-native/no-raw-text": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
  },
};
