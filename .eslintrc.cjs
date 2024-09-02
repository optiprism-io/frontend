/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint', 'import'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

        // use a glob pattern
        project: '**/tsconfig.json',
      },
      node: true,
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  rules: {
    /* JAVASCRIPT */
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    'no-console': ['error', { allow: ['error'] }],
    'no-debugger': 'error',

    /* TYPESCRIPT */
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/array-type': 'error',

    /* VUE */
    'vue/multi-word-component-names': 'off',
    'vue/component-name-in-template-casing': 'error',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 2,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/component-tags-order': ['error', { order: ['template', 'script', 'style'] }],
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/block-lang': [
      'error',
      {
        script: {
          lang: 'ts',
        },
      },
    ],
    'vue/no-v-html': 'off',
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    'vue/define-macros-order': 'error',
    'vue/define-props-declaration': 'error',
    'vue/define-emits-declaration': 'error',
    'vue/no-required-prop-with-default': 'error',
    'vue/no-undef-components': 'error',
    'vue/no-undef-properties': 'error',
    'vue/no-unsupported-features': 'error',
    'vue/no-unused-refs': 'error',
    'vue/no-useless-v-bind': 'error',
    'vue/prefer-separate-static-class': 'error',
    'vue/prefer-true-attribute-shorthand': ['error', 'never'],

    /* SORT IMPORTS */

    // * ## import sorting rules:
    // * https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    // * https://github.com/import-js/eslint-import-resolver-typescript#installation
    // turn on errors for missing imports
    // turned off for now bcoz of aliases in tsconfig paths
    // 'import/no-unresolved': 'error',

    'import/first': 'error',
    'import/newline-after-import': 'error',
    // 'import/no-duplicates': 'error',

    'import/order': [
      'error',
      {
        'newlines-between': 'always',

        alphabetize: {
          /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
          order: 'asc',
          caseInsensitive: true,
        },

        pathGroups: [
          {
            pattern: '*.vue',
            patternOptions: { matchBase: true },
            group: 'internal',
            position: 'before',
          },
          {
            pattern: 'vue',
            patternOptions: { matchBase: true },
            group: 'builtin',
            position: 'before',
          },
        ],
        distinctGroup: true,
        pathGroupsExcludedImportTypes: ['vue'],

        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'index',
          'sibling',
          'object',
          'unknown',
          'type',
        ],
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
      },
    ],
  },
}
