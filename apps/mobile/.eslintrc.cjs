module.exports = {
  root: true,
  extends: ['@gastonapp/eslint-config/react-native.js'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    // Disable node/no-unsupported-features/es-syntax for ES modules
    'node/no-unsupported-features/es-syntax': 'off',
    // Allow React Native pattern of defining styles after component
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
  },
};