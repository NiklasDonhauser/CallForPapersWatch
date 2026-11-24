export type Category = 'nlp' | 'ml'

export interface ConferenceDates {
  /** ISO datetime with timezone offset; AoE (UTC-12) is the NLP convention */
  abstractDeadline?: string
  fullPaperDeadline?: string
  conferenceStart?: string
  conferenceEnd?: string
}

export interface Conference {
  /** stable id for user-created entries */
  id?: string
  acronym: string
  name: string
  location: string
  category: Category
  website: string
  dates: ConferenceDates
  /** Where the information was taken from (call for papers page etc.) */
  source?: string
  /** Date the information was last checked, as YYYY-MM-DD */
  infoAsOf: string
  /** Caveat shown under the title, e.g. "projected dates" */
  note?: string
  /** true for user-created entries (localStorage) */
  own?: boolean
  /** transient flag: default entry with a local override applied */
  edited?: boolean
}

/** Draft emitted by the entry form */
export interface ResultDraft {
  acronym: string
  name: string
  location: string
  category: Category
  dates: ConferenceDates
  website: string
  source: string | undefined
}
