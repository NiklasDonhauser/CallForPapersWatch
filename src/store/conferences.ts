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

/** Merge imported entries by id (update existing, append new); returns affected count */
export function importOwnEntries(entries: Conference[]): number {
  const byId = new Map(ownEntries.value.map((e) => [e.id as string, e]))
  for (const entry of entries) {
    const key = entry.id ?? crypto.randomUUID()
    byId.set(key, { ...entry, id: key })
  }
  ownEntries.value = [...byId.values()]
  persist()
  return entries.length
}

const OVERRIDES_KEY = 'cfpw:overrides'

/** Local, persisted corrections/edits of the repo default entries, keyed by acronym */
export const overrides = ref<Record<string, Conference>>(loadOverrides())

function loadOverrides(): Record<string, Conference> {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, Conference>) : {}
  } catch {
    return {}
  }
}

function persistOverrides(): void {
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides.value))
  } catch {
    /* localStorage unavailable */
  }
}

/** Persist a user's manual correction of a default entry */
export function saveOverride(acronym: string, draft: Omit<Conference, 'own' | 'infoAsOf' | 'id'>): void {
  overrides.value = { ...overrides.value, [acronym]: { ...draft, infoAsOf: today() } }
  persistOverrides()
}

export function hasOverride(acronym: string): boolean {
  return overrides.value[acronym] !== undefined
}

export function removeOverride(acronym: string): void {
  const next = { ...overrides.value }
  delete next[acronym]
  overrides.value = next
  persistOverrides()
}

/** All conferences shown: repo defaults (with local overrides) merged with the user's own entries. */
export const allConferences = computed<Conference[]>(() => [
  ...(defaultConferences as Conference[]).map((c) =>
    overrides.value[c.acronym] ? { ...c, ...overrides.value[c.acronym], edited: true } : c,
  ),
  ...ownEntries.value,
])
