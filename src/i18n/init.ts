import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './locales/de.json';
import en from './locales/en.json';
import tr from './locales/tr.json';
import ru from './locales/ru.json';

export const SUPPORTED_LANGUAGES = ['de', 'en', 'tr', 'ru'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  de: 'Deutsch',
  en: 'English',
  tr: 'Türkçe',
  ru: 'Русский',
};

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
    tr: { translation: tr },
    ru: { translation: ru },
  },
  lng: 'de',
  fallbackLng: 'de',
  interpolation: { escapeValue: false },
});

export default i18n;
