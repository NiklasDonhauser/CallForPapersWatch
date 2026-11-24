import type { Conference } from '../types'

export type DeadlineStatus = 'countdown' | 'passed' | 'running' | 'ended'

export interface DeadlineInfo {
  /** ISO datetime of the next relevant date (abstract → paper → conference start) */
  target?: string
  status: DeadlineStatus
}

export function getDeadlineInfo(conference: Conference, now: Date = new Date()): DeadlineInfo {
  const dates = conference.dates
  const target = dates.abstractDeadline ?? dates.fullPaperDeadline ?? dates.conferenceStart

  if (target) {
    const targetMs = new Date(target).getTime()
    if (now.getTime() < targetMs) return { target, status: 'countdown' }
  }

  const end = dates.conferenceEnd ? new Date(`${dates.conferenceEnd}T23:59:59`).getTime() : undefined
  const start = dates.conferenceStart ? new Date(dates.conferenceStart).getTime() : undefined

  if (start !== undefined && end !== undefined) {
    if (now.getTime() >= start && now.getTime() <= end) return { status: 'running' }
    if (now.getTime() > end) return { status: 'ended' }
  }
  return { status: 'passed' }
}

/** Sort key order: upcoming first, then running conferences, then past ones. */
export function compareConferences(a: Conference, b: Conference, now: Date = new Date()): number {
  const infoA = getDeadlineInfo(a, now)
  const infoB = getDeadlineInfo(b, now)
  const rank: Record<DeadlineStatus, number> = { countdown: 0, running: 1, passed: 2, ended: 2 }
  const diff = rank[infoA.status] - rank[infoB.status]
  if (diff !== 0) return diff

  const timeA = infoA.target ? new Date(infoA.target).getTime() : Number.MAX_SAFE_INTEGER
  const timeB = infoB.target ? new Date(infoB.target).getTime() : Number.MAX_SAFE_INTEGER
  // Countdowns and running conferences: earliest first; ended: most recent first
  const targetA = infoA.status === 'ended' ? -timeA : timeA
  const targetB = infoB.status === 'ended' ? -timeB : timeB
  return targetA - targetB
}

/** true when the infoAsOf date is older than ~6 months */
export function isStale(conference: Conference, now: Date = new Date()): boolean {
  if (!conference.infoAsOf) return false
  const sixMonthsMs = 183 * 24 * 60 * 60 * 1000
  return now.getTime() - new Date(conference.infoAsOf).getTime() > sixMonthsMs
}
