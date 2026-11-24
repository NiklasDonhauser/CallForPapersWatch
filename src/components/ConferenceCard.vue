<template>
  <article class="card" :class="{ own: conference.own }">
    <header class="card-header">
      <h2>{{ conference.acronym }}</h2>
      <span class="badge" :class="conference.category" :title="t('tooltipCategory')">
        {{ conference.category === 'nlp' ? 'NLP' : 'ML' }}
      </span>
      <span v-if="conference.own" class="badge own-badge" :title="t('tooltipOwn')">{{ t('ownEntry') }}</span>
      <span v-else-if="conference.edited" class="badge own-badge" :title="t('tooltipEdited')">{{ t('editedEntry') }}</span>
    </header>
    <p class="full-name">{{ conference.name }}</p>
    <p v-if="conference.note" class="note">{{ conference.note }}</p>

    <CountdownTimer v-if="conference.dates" :conference="conference" />

    <p class="meta"><strong>{{ t('location') }}:</strong> {{ conference.location }}</p>
    <p v-if="conference.dates.abstractDeadline" class="meta">
      <strong>{{ t('abstractDeadline') }}:</strong> {{ fmt(conference.dates.abstractDeadline!) }}
    </p>
    <p v-if="conference.dates.fullPaperDeadline" class="meta">
      <strong>{{ t('fullPaperDeadline') }}:</strong> {{ fmt(conference.dates.fullPaperDeadline!) }}
    </p>
    <p v-if="dateRange" class="meta"><strong>{{ t('conferenceDates') }}:</strong> {{ dateRange }}</p>
    <p class="meta info-as-of" :class="{ stale: stale }" :title="stale ? t('tooltipStale') : t('tooltipInfoAsOf')">
      <strong>{{ t('infoAsOf') }}:</strong> {{ conference.infoAsOf }}<template v-if="stale"> ⚠</template>
    </p>
    <footer class="card-footer">
      <a :href="conference.website" target="_blank" rel="noopener" :title="t('tooltipWebsite')">{{ t('website') }}</a>
      <a v-if="conference.source" :href="conference.source" target="_blank" rel="noopener" :title="t('tooltipCfp')">CFP ↗</a>
      <span class="card-actions">
        <button
          v-if="conference.edited"
          type="button"
          :title="t('tooltipEdited')"
          @click="$emit('reset', conference)"
        >↺</button>
        <button type="button" @click="$emit('edit', conference)">{{ t('edit') }}</button>
        <button v-if="conference.own" type="button" class="danger" @click="$emit('remove', conference)">{{ t('remove') }}</button>
      </span>
    </footer>
    <NoteEditor :conference="conference" />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Conference } from '../types'
import { t, locale } from '../i18n'
import { isStale } from '../utils/dates'
import CountdownTimer from './CountdownTimer.vue'
import NoteEditor from './NoteEditor.vue'

const props = defineProps<{ conference: Conference }>()
defineEmits<{ edit: [conference: Conference]; remove: [conference: Conference]; reset: [conference: Conference] }>()

const dateFmt = computed(
  () =>
    new Intl.DateTimeFormat(locale.value === 'de' ? 'de-DE' : 'en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
)

function fmt(iso: string): string {
  return dateFmt.value.format(new Date(iso))
}

const dateRange = computed(() => {
  const { conferenceStart, conferenceEnd } = props.conference.dates
  if (conferenceStart && conferenceEnd) {
    return `${fmt(conferenceStart)} – ${fmt(conferenceEnd)}`
  }
  return conferenceStart ? fmt(conferenceStart) : null
})

const stale = computed(() => isStale(props.conference))
</script>
