import type { Conference } from '../types'

/** Base64url encode, unicode-safe */
export function encodeEntries(entries: Conference[]): string {
  const json = JSON.stringify(entries)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
}

/** Base64url decode; throws when the payload is not a valid entries array */
export function decodeEntries(encoded: string): Conference[] {
  const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(normalized)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  const json = new TextDecoder().decode(bytes)
  return parseEntries(json)
}

/** Shared parsing/normalizing used by import file and share link */
export function parseEntries(raw: string): Conference[] {
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('not an array')
  const today = new Date().toISOString().slice(0, 10)
  const valid = parsed.filter(
    (e: unknown): e is Record<string, unknown> =>
      !!e && typeof e === 'object' && typeof (e as Conference).acronym === 'string',
  )
  if (valid.length !== parsed.length) throw new Error('invalid entries')
  return valid.map((e, i) => ({
    acronym: e.acronym as string,
    name: typeof e.name === 'string' ? e.name : (e.acronym as string),
    location: typeof e.location === 'string' ? e.location : '',
    category: e.category === 'ml' ? 'ml' : 'nlp',
    website: typeof e.website === 'string' ? e.website : '',
    dates: typeof e.dates === 'object' && e.dates ? e.dates : {},
    source: typeof e.source === 'string' ? e.source : undefined,
    infoAsOf: typeof e.infoAsOf === 'string' ? e.infoAsOf : today,
    id: typeof e.id === 'string' ? e.id : `${Date.now()}-${i}`,
    own: true,
  }))
}

export function downloadEntries(entries: Conference[]): void {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cfpw-entries.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function buildShareLink(entries: Conference[]): string {
  const base = window.location.origin + window.location.pathname
  return `${base}#e=${encodeEntries(entries)}`
}
