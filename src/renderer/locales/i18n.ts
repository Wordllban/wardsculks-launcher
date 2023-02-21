import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './resources';

/**
 * Override declaration to fix not nullable values of HTML elements
 * For more information: https://github.com/i18next/react-i18next/issues/1587
 */
declare module 'i18next' {
  // eslint-disable-next-line no-unused-vars
  interface CustomTypeOptions {
    returnNull: false;
  }
}

i18n.use(initReactI18next).init({
  debug: process.env.NODE_ENV !== 'production',
  fallbackLng: 'ua',
  lng: 'ua',
  resources,

  returnNull: false,
});

export default i18n;
