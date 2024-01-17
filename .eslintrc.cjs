module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
        'vue/setup-compiler-macros': true
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/typescript/recommended',
        'prettier', /* Turns off all rules that are unnecessary or might conflict with Prettier. */
    ],
    parserOptions: {
        ecmaVersion: 2021
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-duplicate-case': 'off',
        'no-fallthrough': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
        'vue/no-v-html': 0,
        'vue/script-setup-uses-vars': 'error',
        'vue/require-default-prop': 'off',
        'vue/multi-word-component-names': 'off'
    }
};