import js from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import eslintReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules', 'dist', 'build'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      jsxA11y.flatConfigs.recommended,
      eslintPluginPrettier,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      react: eslintReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      boundaries,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': 'warn',
      'boundaries/entry-point': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              target: ['app', 'pages', 'features', 'entities'],
              allow: 'index.ts',
            },
            {
              target: ['kernel', 'shared'],
              allow: '**/*.*',
            },
          ],
        },
      ],
      'boundaries/element-types': [
        'error',
        {
          default: 'allow',
          rules: [
            {
              from: ['pages'],
              disallow: ['app'],
              message: 'Page must not import upper layers (${dependency.type})',
            },
            {
              from: ['features'],
              disallow: ['app', 'pages'],
              message:
                'Feature must not import upper layers (${dependency.type})',
            },
            {
              from: ['entities'],
              disallow: ['app', 'pages', 'features'],
              message:
                'Entity must not import upper layers (${dependency.type})',
            },
            {
              from: ['kernel'],
              disallow: ['app', 'pages', 'features', 'entities'],
              message:
                'Kernel must not import upper layers (${dependency.type})',
            },
            {
              from: ['shared'],
              disallow: ['app', 'pages', 'features', 'entities', 'kernel'],
              message:
                'Shared must not import upper layers (${dependency.type})',
            },

            {
              from: ['pages'],
              disallow: [
                [
                  'pages',
                  {
                    page: '!${page}',
                  },
                ],
              ],
              message: 'Page must not import other page',
            },
            {
              from: ['features'],
              disallow: [
                [
                  'features',
                  {
                    feature: '!${feature}',
                  },
                ],
              ],
              message: 'Feature must not import other feature',
            },
          ],
        },
      ],
    },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        {
          type: 'app',
          pattern: 'app/*',
        },
        {
          type: 'pages',
          pattern: 'pages/*',
          capture: ['page'],
        },
        {
          type: 'features',
          pattern: 'features/*',
          capture: ['feature'],
        },
        {
          type: 'entities',
          pattern: 'entities/*',
          capture: ['entity'],
        },
        {
          type: 'kernel',
          pattern: 'kernel/*',
        },
        {
          type: 'shared',
          pattern: 'shared/*',
        },
      ],
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
);
