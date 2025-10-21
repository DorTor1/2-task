import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      },
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    plugins: {
      import: pluginImport
    },
    rules: {
      'import/no-default-export': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false }
      ]
    }
  }
);

