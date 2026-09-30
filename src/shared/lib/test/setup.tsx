import '@testing-library/jest-dom/vitest';

import {render} from '@testing-library/react';
import {initReactI18next} from 'react-i18next';
import {vi} from 'vitest';

import {i18n} from '../i18n';

import {testTranslations} from './testTranslations';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: testTranslations,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock getComputedStyle to suppress warnings
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = function (element, pseudoElement) {
  if (pseudoElement) {
    return {
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration;
  }
  return originalGetComputedStyle(element);
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    ...options,
  });

export {customRender as render};
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
