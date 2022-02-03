module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    // TODO
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'no-continue': 'off',
    'no-plusplus': 'off',
    'no-console': 'off',
    'no-eval': 'off',
    'no-underscore-dangle': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    // https://stackoverflow.com/questions/69928061/struggling-with-typescript-react-eslint-and-simple-arrow-functions-components
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    // https://stackoverflow.com/questions/55614983/jsx-not-allowed-in-files-with-extension-tsxeslintreact-jsx-filename-extensio
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts'] }],
    // https://stackoverflow.com/questions/59265981/typescript-eslint-missing-file-extension-ts-import-extensions
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never', jsx: 'never', ts: 'never', tsx: 'never',
    }],
    // no need
    'import/prefer-default-export': 'off',
    'no-restricted-exports': 'off',
    'no-nested-ternary': 'off',
    // https://redux-toolkit.js.org/usage/immer-reducers#linting-state-mutations
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    // ts enum rule
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
  settings: {
    // https://stackoverflow.com/questions/55198502/using-eslint-with-typescript-unable-to-resolve-path-to-module
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      // https://github.com/alexgorbatchev/eslint-import-resolver-typescript#configuration
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};
