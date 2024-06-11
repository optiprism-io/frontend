module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', '@vue/typescript/recommended'],
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  rules: {
    'vue/no-undef-components': 'error',
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
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
  },
}
