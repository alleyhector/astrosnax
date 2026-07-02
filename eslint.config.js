const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const globals = require('globals')

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    files: ['**/__tests__/**/*', '**/*.test.{js,ts,tsx}'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    ignores: ['dist/*'],
    rules: {
      'prettier/prettier': 'warn',
    },
  },
])
