// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsparser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { globalIgnores } from 'eslint/config';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  prettierConfig,
  globalIgnores([
    '.config/*',
    '*.config.js',
    '*.config.mjs',
    '*.config.cjs',
    '*.config.ts',
    'dist',
    'node_modules',
    '.eslintrc.*',
    '.prettierrc.*',
    'coverage',
    'src/database/prisma'
  ]),
  {
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 2020
      }
    },
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ]
    }
  }
);
