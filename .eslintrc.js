module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    '@vue/airbnb',
    'plugin:vue/vue3-essential',
    'plugin:vue/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
    '@vue/typescript/recommended',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src']
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue']
      },
      // Add node resolver as fallback
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        paths: ['src']
      }
    }
  },
  rules: {
    'import/extensions': 0,
    'import/no-unresolved': 0, // Temporarily disable unresolved imports
    'import/no-extraneous-dependencies': 0, // Temporarily disable extraneous deps
    semi: 0,
    'max-len': [
      'off',
      {
        code: 120,
      },
    ],
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 6 },
        multiline: { max: 1 },
      },
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/require-default-prop': 'off',
    'import/no-cycle': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': [
      'error',
      {
        object: true,
        array: false,
      },
    ],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    camelcase: 'off',
    'arrow-body-style': ['off', 'never'],
    'object-curly-newline': 0,
    'import/order': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 'off',
    'consistent-return': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'global-require': 'off',
    'no-use-before-define': 'off', // Disable this rule
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'import/no-dynamic-require': 'off',
    'import/newline-after-import': 'off', // Disable newline requirement
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  ignorePatterns: ['dist', '/public/ekuiper'],
}