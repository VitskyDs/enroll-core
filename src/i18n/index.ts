import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import he from './he.json'

export const LANG_STORAGE_KEY = 'enroll-lang'
export const LANG_EXPLICIT_STORAGE_KEY = 'enroll-lang-explicit'
export type Lang = 'en' | 'he'

const stored = localStorage.getItem(LANG_STORAGE_KEY)
const initialLang: Lang = stored === 'he' ? 'he' : 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    he: { translation: he },
  },
  lng: initialLang,
  fallbackLng: 'en',
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
})

function applyDirection(lng: string) {
  const isRtl = lng === 'he'
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
  document.documentElement.lang = isRtl ? 'he' : 'en'
}

applyDirection(initialLang)
i18n.on('languageChanged', applyDirection)

// Called when the user explicitly picks a language (e.g. the Profile
// switcher). Sticky — once set, applyBusinessDefaultLanguage below never
// overrides it, regardless of which business the user later visits.
export function setExplicitLanguage(lng: Lang) {
  i18n.changeLanguage(lng)
  localStorage.setItem(LANG_STORAGE_KEY, lng)
  localStorage.setItem(LANG_EXPLICIT_STORAGE_KEY, '1')
}

// Called when a business loads, to default the UI to that business's
// language. No-ops once the user has made an explicit choice via
// setExplicitLanguage — a business's default only applies until then.
export function applyBusinessDefaultLanguage(defaultLanguage: string | null | undefined) {
  if (localStorage.getItem(LANG_EXPLICIT_STORAGE_KEY) === '1') return
  const lng: Lang = defaultLanguage === 'he' ? 'he' : 'en'
  i18n.changeLanguage(lng)
  localStorage.setItem(LANG_STORAGE_KEY, lng)
}

export default i18n
