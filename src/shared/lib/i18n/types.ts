import type {resources} from './resources';

export enum ELanguage {
  EN = 'en',
}

// Типизация ключей: несуществующий ключ в t() станет ошибкой TS
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: (typeof resources)[ELanguage.EN];
  }
}

export type TranslationKey =
  keyof (typeof resources)[ELanguage.EN]['translation'];
