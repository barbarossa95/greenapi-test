import en from './locales/en.json';

// i18next ждёт строки внутри неймспейса: {язык: {неймспейс: {ключ: текст}}}
export const resources = {
  en: {translation: en},
} as const;
