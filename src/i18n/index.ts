import { ref } from 'vue'
import { en } from './en'
import { de } from './de'

export type Locale = 'en' | 'de'

const dictionaries: Record<Locale, typeof en> = { en, de }

const STORAGE_KEY = 'cfpw:locale'

document.documentElement.lang = initialLocale()

function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'de') return saved
  } catch {
    /* localStorage unavailable */
  }
  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en'
}

export const locale = ref<Locale>(initialLocale())

export function setLocale(l: Locale): void {
  locale.value = l
  document.documentElement.lang = l
  try {
    localStorage.setItem(STORAGE_KEY, l)
  } catch {
    /* localStorage unavailable */
  }
}

export function t(key: keyof typeof en): string {
  return dictionaries[locale.value][key]
}

export type StringKey = keyof typeof en
