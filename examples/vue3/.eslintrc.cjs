module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'no-debugger': 'warn',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        trailingComma: 'none',
        arrowParens: 'avoid',
        singleQuote: true,
        endOfLine: 'auto'
      }
    ],
    'vue/return-in-computed-property': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/ban-ts-comment': 'off'
  }
}
