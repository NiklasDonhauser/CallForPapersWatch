import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'cfpw:theme'

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* localStorage unavailable */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const theme = ref<Theme>(initialTheme())

applyTheme()

export function setTheme(t: Theme): void {
  theme.value = t
  applyTheme()
  try {
    localStorage.setItem(STORAGE_KEY, t)
  } catch {
    /* localStorage unavailable */
  }
}

export function toggleTheme(): void {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

function applyTheme(): void {
  document.documentElement.dataset.theme = theme.value
}
