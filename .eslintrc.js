module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    '@vue/typescript/recommended',
    'plugin:vue/vue3-essential',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/newline-after-import': 'off',
  },
}