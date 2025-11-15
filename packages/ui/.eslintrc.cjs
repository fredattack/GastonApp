module.exports = {
  root: true,
  extends: ['@gastonapp/eslint-config/react.js'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Disable node/no-unsupported-features/es-syntax for ES modules
    'node/no-unsupported-features/es-syntax': 'off',
  },
};