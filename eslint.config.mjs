// eslint.config.js
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  {
    ignores: ['coverage/**/*', 'node_modules/*', 'eslint.config.mjs'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },

    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // allow unused 'next' or others prefixed with _
      'no-undef': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },

  // ✅ Override for test files
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.jest, // if you're using Jest
        // Or add manually:
        // test: 'readonly',
        // expect: 'readonly',
        // describe: 'readonly',
        // beforeAll: 'readonly',
        // afterAll: 'readonly',
      },
    },
  },
]);
