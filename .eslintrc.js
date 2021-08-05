module.exports = {
  env: {
    es2021: true,
    "react-native/react-native": true,
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
  plugins: ["react", "react-native", "@typescript-eslint", "sort-keys-fix"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-unused-vars": [
      "off",
      {
        args: "after-used",
        caughtErrors: "all",
        ignoreRestSiblings: false,
        vars: "all",
      },
    ],
    "react-native/no-raw-text": "error",
    "react-native/no-single-element-style-arrays": "warn",
    "react-native/no-unused-styles": "warn",
    "react/destructuring-assignment": "error",
    "react/display-name": "off",
    "react/function-component-definition": [
      "warn",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/jsx-fragments": "warn",
    "react/jsx-no-useless-fragment": "warn",
    "react/jsx-pascal-case": "error",
    "react/jsx-sort-props": [
      "warn",
      {
        ignoreCase: true,
        reservedFirst: ["key"],
        shorthandFirst: true,
      },
    ],
    "react/jsx-uses-react": "off",
    "react/no-array-index-key": "error",
    "react/no-this-in-sfc": "error",
    "react/no-unstable-nested-components": ["warn", { allowAsProps: true }],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/self-closing-comp": "warn",
    "sort-keys-fix/sort-keys-fix": ["warn", "asc", { caseSensitive: false }],
  },
};
