import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import zh from '../locales/zh.json'

export const SUPPORTED_LOCALES = ['en', 'zh']
export const DEFAULT_LOCALE = 'en'

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
    zh
  }
})

export default i18n
