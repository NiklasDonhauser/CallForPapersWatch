<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <form class="modal" @submit.prevent="save">
      <h2>{{ editing ? t('editEntry') : t('addEntry') }}</h2>

      <label>
        {{ t('entryAcronym') }}
        <input v-model="draft.acronym" required />
      </label>
      <label>
        {{ t('entryName') }}
        <input v-model="draft.name" />
      </label>
      <label>
        {{ t('location') }}
        <input v-model="draft.location" />
      </label>

      <fieldset>
        <legend>
          {{ t('filterNlp') }} / {{ t('filterMl') }}
        </legend>
        <select v-model="draft.category">
          <option value="nlp">NLP</option>
          <option value="ml">ML</option>
        </select>
      </fieldset>

      <label>
        {{ t('abstractDeadline') }}
        <input v-model="draft.abstractDeadline" type="datetime-local" />
      </label>
      <label>
        {{ t('fullPaperDeadline') }}
        <input v-model="draft.fullPaperDeadline" type="datetime-local" />
      </label>
      <label>
        {{ t('conferenceDates') }}
        <div class="date-pair">
          <input v-model="draft.conferenceStart" type="date" />
          <input v-model="draft.conferenceEnd" type="date" />
        </div>
      </label>

      <label>
        {{ t('entryWebsite') }}
        <input v-model="draft.website" type="url" />
      </label>
      <label>
        {{ t('entrySource') }}
        <input v-model="draft.source" type="url" />
      </label>
      <label>
        {{ t('entryNote') }}
        <textarea v-model="draft.userNote" rows="3" maxlength="2000"></textarea>
        <span class="word-counter" :class="{ over: words > 200 }">{{ counterText }}</span>
      </label>

      <p v-if="error" class="form-error">{{ error }}</p>
      <p class="form-note">{{ t('localTimeNote') }}</p>

      <div class="form-actions">
        <button type="submit" class="primary">{{ t('save') }}</button>
        <button type="button" @click="$emit('close')">{{ t('cancel') }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Conference, ConferenceDates, ResultDraft } from '../types'
import { t } from '../i18n'

const props = defineProps<{ editing: Conference | null }>()
const emit = defineEmits<{ close: []; save: [draft: ResultDraft, id?: string] }>()

interface FormDraft {
  acronym: string
  name: string
  location: string
  category: 'nlp' | 'ml'
  abstractDeadline: string
  fullPaperDeadline: string
  conferenceStart: string
  conferenceEnd: string
  website: string
  source: string
  userNote: string
}

function blank(): FormDraft {
  return {
    acronym: '',
    name: '',
    location: '',
    category: 'nlp',
    abstractDeadline: '',
    fullPaperDeadline: '',
    conferenceStart: '',
    conferenceEnd: '',
    website: '',
    source: '',
    userNote: '',
  }
}

const draft = reactive<FormDraft>(props.editing ? fromEntry(props.editing) : blank())

function fromEntry(c: Conference): FormDraft {
  const d = c.dates
  return {
    acronym: c.acronym,
    name: c.name,
    location: c.location,
    category: c.category,
    abstractDeadline: toLocalInput(d.abstractDeadline),
    fullPaperDeadline: toLocalInput(d.fullPaperDeadline),
    conferenceStart: d.conferenceStart ?? '',
    conferenceEnd: d.conferenceEnd ?? '',
    website: c.website,
    source: c.source ?? '',
    userNote: c.userNote ?? '',
  }
}

/** ISO string → value for datetime-local inputs (local time) */
function toLocalInput(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toISOString().slice(0, 16)
}

const error = ref('')

const words = computed(() => countWords(draft.userNote))

const counterText = computed(() => t('wordCounter').replace('{n}', String(words.value)))

function countWords(text: string | undefined): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

function save(): void {
  if (!draft.acronym.trim()) {
    error.value = t('requiredHint')
    return
  }
  if (!draft.abstractDeadline && !draft.fullPaperDeadline && !draft.conferenceStart) {
    error.value = t('requiredHint')
    return
  }
  if (words.value > 200) {
    error.value = t('noteTooLong')
    return
  }
  const dates: ConferenceDates = {
    abstractDeadline: draft.abstractDeadline
      ? new Date(draft.abstractDeadline).toISOString()
      : undefined,
    fullPaperDeadline: draft.fullPaperDeadline
      ? new Date(draft.fullPaperDeadline).toISOString()
      : undefined,
    conferenceStart: draft.conferenceStart || undefined,
    conferenceEnd: draft.conferenceEnd || undefined,
  }
  emit(
    'save',
    {
      acronym: draft.acronym.trim(),
      name: draft.name.trim() || draft.acronym.trim(),
      location: draft.location.trim(),
      category: draft.category,
      dates,
      website: draft.website.trim(),
      source: draft.source.trim() || undefined,
      userNote: draft.userNote.trim() || undefined,
    },
    props.editing?.id,
  )
}
</script>
