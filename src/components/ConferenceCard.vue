<template>
  <article class="card" :class="{ own: conference.own }">
    <header class="card-header">
      <h2>{{ conference.acronym }}</h2>
      <span class="badge" :class="conference.category">
        {{ conference.category === 'nlp' ? 'NLP' : 'ML' }}
      </span>
      <span v-if="conference.own" class="badge own-badge">{{ t('ownEntry') }}</span>
    </header>
    <p class="full-name">{{ conference.name }}</p>
    <p class="meta"><strong>{{ t('location') }}:</strong> {{ conference.location }}</p>
    <p v-if="conference.dates.abstractDeadline" class="meta">
      <strong>{{ t('abstractDeadline') }}:</strong> {{ fmt(conference.dates.abstractDeadline!) }}
    </p>
    <p v-if="conference.dates.fullPaperDeadline" class="meta">
      <strong>{{ t('fullPaperDeadline') }}:</strong> {{ fmt(conference.dates.fullPaperDeadline!) }}
    </p>
    <p v-if="dateRange" class="meta"><strong>{{ t('conferenceDates') }}:</strong> {{ dateRange }}</p>
    <p class="meta info-as-of">
      <strong>{{ t('infoAsOf') }}:</strong> {{ conference.infoAsOf }}
    </p>
    <footer class="card-footer">
      <a :href="conference.website" target="_blank" rel="noopener">{{ t('website') }}</a>
      <a v-if="conference.source" :href="conference.source" target="_blank" rel="noopener">CFP ↗</a>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Conference } from '../types'
import { t, locale } from '../i18n'

const props = defineProps<{ conference: Conference }>()

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
</script>
