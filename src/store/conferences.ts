import { computed, ref } from 'vue'
import defaultConferences from '../data/conferences.json'
import type { Conference } from '../types'

const STORAGE_KEY = 'cfpw:ownEntries'

function loadOwnEntries(): Conference[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Conference[]) : []
  } catch {
    return []
  }
}

/** User-created entries, persisted in localStorage */
export const ownEntries = ref<Conference[]>(loadOwnEntries())

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ownEntries.value))
  } catch {
    /* localStorage unavailable */
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addOwnEntry(draft: Omit<Conference, 'own' | 'infoAsOf' | 'id'>): Conference {
  const entry: Conference = { ...draft, id: crypto.randomUUID(), own: true, infoAsOf: today() }
  ownEntries.value = [...ownEntries.value, entry]
  persist()
  return entry
}

export function updateOwnEntry(id: string, draft: Omit<Conference, 'own' | 'infoAsOf' | 'id'>): void {
  ownEntries.value = ownEntries.value.map((e) =>
    e.id === id ? { ...draft, id, own: true, infoAsOf: today() } : e,
  )
  persist()
}

export function removeOwnEntry(id: string): void {
  ownEntries.value = ownEntries.value.filter((e) => e.id !== id)
  persist()
}

/** All conferences shown: repo defaults merged with the user's own entries. */
export const allConferences = computed<Conference[]>(() => [
  ...(defaultConferences as Conference[]),
  ...ownEntries.value,
])
