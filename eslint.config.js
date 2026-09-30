import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import stylistic from '@stylistic/eslint-plugin';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

import simpleImportSort from 'eslint-plugin-simple-import-sort';
import {projectStructurePlugin} from 'eslint-plugin-project-structure';
import {projectStructureConfig} from './projectStructure.mjs';

const FSDDirs = [
  'app',
  'api',
  'pages',
  'widgets',
  'features',
  'entities',
  'shared',
];

const NotFSDAlias = `^@?(?!(${FSDDirs.map((dir) => `${dir}\/`).join('|')}))\\w`;

export default tseslint.config({
  extends: [
    tseslint.configs.recommended,
    {
      ignores: [
        '.react-router/*',
        'build/*',
        'src/shared/lib/i18n/i18n-*',
        'projectStructure.cache.json',
      ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
  ],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    globals: globals.browser,
  },
  plugins: {
    react: react,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    'simple-import-sort': simpleImportSort,
    '@stylistic': stylistic,
    'project-structure': projectStructurePlugin,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react/jsx-key': 'error',
    'react-refresh/only-export-components': ['error', {extraHOCs: ['styled']}],
    'react/jsx-curly-brace-presence': [
      'error',
      {
        props: 'never',
        children: 'never',
      },
    ],
    'project-structure/folder-structure': ['error', projectStructureConfig],
    'react-refresh/only-export-components': [
      'warn',
      {allowConstantExport: true},
    ],
    'no-duplicate-imports': ['error', {includeExports: true}],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // 1. Side effect imports at the start. For me this is important because I want to import reset.css and global styles at the top of my main file.
          ['^\\u0000'],
          // 2. `react` and packages: Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^react$', NotFSDAlias],
          // 3. Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group. (also relative imports starting with "../")
          ['^@', '^'],
          // 4. relative imports from same folder "./" (I like to have them grouped together)
          ['^\\./'],
          // 5. style module imports always come last, this helps to avoid CSS order issues
          ['^.+\\.(module.css|module.scss)$'],
          // 6. media imports
          ['^.+\\.(gif|png|svg|jpg)$'],
        ],
      },
    ],
    '@stylistic/object-curly-spacing': ['error', 'never'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
});
