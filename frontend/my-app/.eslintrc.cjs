module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    'cypress/globals': true, // Ajoute les globals de Cypress pour ESLint
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'cypress'], // Ajoute le plugin Cypress
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
