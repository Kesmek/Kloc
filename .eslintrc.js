module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    'react/jsx-no-useless-fragment': 1,
    'react-native/no-unused-styles': 1,
    'prettier/prettier': 0,
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    curly: 0,
  },
};
