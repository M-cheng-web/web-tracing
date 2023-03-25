module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
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
    'vue/multi-word-component-names': 'off'
  }
}
