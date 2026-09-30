// @ts-check

import {createFolderStructure} from 'eslint-plugin-project-structure';

const withBarrelFile = (/** @type {any[]} */ rules) => [
  {name: 'index.ts'},
  ...rules,
];

// Entities folder, TBU
const SLICES = '(chat|message)';

const SEGMENTS = withBarrelFile([
  {ruleId: 'ui_segment'},
  {ruleId: 'api_segment'},
  {ruleId: 'model_segment'},
  {ruleId: 'lib_segment'},
  {ruleId: 'config_segment'},
  {
    name: '__tests__',
    children: [{name: '{PascalCase}*.test.(ts|tsx)'}],
  },
]);

export const projectStructureConfig = createFolderStructure({
  rules: {
    // Custom rules
    hook_folder: {
      name: 'use{PascalCase}',
      children: withBarrelFile([
        {ruleId: 'hooks_folder'},
        {name: '{folderName}(.(test|api|types|consts))?.ts'},
      ]),
    },

    hooks_folder: {
      name: 'hooks',
      folderRecursionLimit: 2,
      children: withBarrelFile([
        {ruleId: 'hook_folder'},
        {name: 'use{PascalCase}(.test)?.(ts|tsx)'},
      ]),
    },

    // TODO: store rule
    store_folder: {
      name: 'store',
      children: withBarrelFile([{name: '{camelCase}', children: []}]),
    },

    component_folder: {
      name: '{PascalCase}',
      folderRecursionLimit: 2, // Вложенность больше двух говорит об ошибке в проектировании - стоит выделить виджет или shared компоненты
      children: withBarrelFile([
        {name: 'assets', children: [{name: '*'}]},
        {ruleId: 'component_folder'}, // Подкомпоненты
        {ruleId: 'hook_folder'},
        {name: '{PascalCase}(.test)?.tsx'}, // Компонент
        {name: '(constants|helpers|types|validation).(ts|tsx)'}, // бывшая папка lib
        {name: '{FolderName}(.test)?.tsx'},
        {name: '__tests__', children: [{name: '{PascalCase}.test.tsx'}]},
      ]),
    },

    page: {
      name: '{camelCase}',
      children: withBarrelFile([
        {name: '{camelCase}', children: withBarrelFile([{ruleId: 'page'}])},
        {name: '{PascalCase}.tsx'},
        {name: '__tests__', children: [{name: '{PascalCase}.test.tsx'}]},
        {name: '__stories__', children: [{name: '{PascalCase}.stories.tsx'}]},
        {ruleId: 'page'},
      ]),
    },

    // Segments

    // UI
    ui_segment: {
      name: 'ui',
      children: withBarrelFile([
        {ruleId: 'component_folder'},
        {name: '{PascalCase}(.test)?.tsx'},
      ]),
    },

    // Api
    api_segment: {
      name: 'api',
      children: withBarrelFile([
        {name: 'fragments', children: withBarrelFile([{name: '*.ts'}])},
        {name: 'mutation', children: withBarrelFile([{name: '*.ts'}])},
        {name: 'query', children: withBarrelFile([{name: '*.ts'}])},
        {name: 'generated', children: []},
      ]),
    },

    // Model
    model_segment: {
      name: 'model',
      children: withBarrelFile([{name: '*.(ts)'}, {ruleId: 'store_folder'}]), // TODO: To be updated
    },

    // Lib
    // TODO: update
    lib_segment: {
      name: 'lib',
      children: withBarrelFile([
        {ruleId: 'store_folder'},
        {ruleId: 'hooks_folder'},
        {name: '{camelCase}.(ts|tsx)'},
        {name: 'i18n', children: []},
        {name: 'graphql', children: []},
        {name: '{camelCase}', children: [{name: '{camelCase}.(ts|tsx)'}]},
      ]),
    },

    // Config
    config_segment: {
      name: 'config',
      children: withBarrelFile([{name: '{camelCase}.ts'}]),
    },
  },
  structure: [
    // Любые папки и файлы в root директории.
    {name: '*'},
    {name: '*', children: []},

    // Папка `src` должна соответствовать данной структуре.
    {
      name: 'src',
      children: [
        {name: 'main.tsx'},
        {name: 'vite-env.d.ts'},
        {name: 'entry.client.tsx'},
        {name: 'catchall.tsx'},
        {name: 'routes.ts'},
        {name: 'root.tsx'},

        // Layers

        // App
        {
          name: 'app',
          children: [
            // TODO: refactor
            {name: 'router.tsx'},
            {name: 'App.tsx'},
            {
              name: 'providers',
              children: withBarrelFile([
                {
                  name: '{camelCase}',
                  children: [
                    {name: '{camelCase}.(tsx|ts)'},
                    {name: '{PascalCase}.tsx'},
                  ],
                },
              ]),
            },
            {
              name: 'config',
              children: withBarrelFile([
                {name: 'codegen.ts'},
                {name: 'links.ts'},
                {name: 'meta.ts'},
              ]),
            },
          ],
        },

        // Pages layer (PascalCase для компонентов)
        {
          name: 'pages',
          children: withBarrelFile([{ruleId: 'page'}]),
        },

        // Widgets
        {
          name: 'widgets',
          children: withBarrelFile([{name: '{camelCase}', children: SEGMENTS}]),
        },

        // Features
        {
          name: 'features',
          children: [
            {
              name: '{camelCase}',
              children: withBarrelFile([
                {ruleId: 'hooks_folder'},
                {ruleId: 'component_folder'},
                {name: '{PascalCase}.tsx'},
                {name: 'lib', children: [{name: '*.(ts|tsx)'}]},
              ]),
            },
          ],
        },

        // Entities
        {
          name: 'entities',
          children: withBarrelFile([{name: SLICES, children: SEGMENTS}]),
        },

        // Shared
        {
          name: 'shared',
          children: withBarrelFile([
            ...SEGMENTS,
            {ruleId: 'hooks_folder'},
            {name: 'utils', children: []},
            {name: 'assets', children: []},
            {name: 'types', children: []},
            {name: 'constants', children: []},
          ]),
        },

        // Mocks
        {
          name: 'mocks',
          children: [],
        },
      ],
    },
  ],
});
