export type Category = 'nlp' | 'ml'

export interface ConferenceDates {
  /** ISO datetime with timezone offset; AoE (UTC-12) is the NLP convention */
  abstractDeadline?: string
  fullPaperDeadline?: string
  conferenceStart?: string
  conferenceEnd?: string
}

export interface Conference {
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
  /** true for user-created entries (localStorage) */
  own?: boolean
}
