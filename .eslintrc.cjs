module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', '@vue/typescript/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: {
          max: 2,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1 }],
    'no-console': ['warn', { allow: ['error'] }],
    'no-debugger': 'error',
    'no-fallthrough': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
    'vue/no-v-html': 0,
    'vue/html-indent': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/require-default-prop': 'off',
    'vue/html-self-closing': 'warn',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/multi-word-component-names': 'off',
  },
}
