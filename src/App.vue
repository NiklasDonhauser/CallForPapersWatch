<template>
  <div class="app">
    <header class="site-header">
      <div>
        <h1>{{ t('appTitle') }}</h1>
        <p class="tagline">{{ t('tagline') }}</p>
      </div>
      <div class="header-actions">
        <button type="button" class="primary-btn" :title="t('tooltipAdd')" @click="openAdd">+ {{ t('addEntry') }}</button>
        <DataButtons />
        <LanguageSwitcher />
      </div>
    </header>

    <div class="toolbar">
      <div class="filters" role="group">
        <button
          v-for="f in ['all', 'nlp', 'ml', 'own'] as const"
          :key="f"
          type="button"
          :class="{ active: filter === f }"
          @click="filter = f"
        >
          {{ filterLabel(f) }}
        </button>
      </div>
      <input v-model="search" class="search" type="search" :placeholder="t('searchPlaceholder')" :title="t('tooltipSearch')" />
    </div>

    <main class="card-grid">
      <ConferenceCard
        v-for="c in conferences"
        :key="c.id ?? c.acronym"
        :conference="c"
        @edit="openEdit"
        @remove="askRemove"
      />
      <p v-if="!conferences.length" class="empty">{{ t('searchPlaceholder') }}</p>
    </main>

    <footer class="site-footer">
      <p>{{ t('footerNote') }}</p>
    </footer>

    <EntryForm v-if="showForm" :editing="editing" @close="showForm = false" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from './i18n'
import type { Conference } from './types'
import { addOwnEntry, updateOwnEntry, removeOwnEntry, allConferences } from './store/conferences'
import { compareConferences } from './utils/dates'
import ConferenceCard from './components/ConferenceCard.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import DataButtons from './components/DataButtons.vue'
import EntryForm from './components/EntryForm.vue'
import type { ResultDraft } from './types'

const editing = ref<Conference | null>(null)
const showForm = ref(false)

function openAdd(): void {
  editing.value = null
  showForm.value = true
}

function openEdit(conference: Conference): void {
  editing.value = conference
  showForm.value = true
}

function handleSave(draft: ResultDraft, id?: string): void {
  if (id) updateOwnEntry(id, draft)
  else addOwnEntry(draft)
  showForm.value = false
}

function askRemove(conference: Conference): void {
  if (conference.id && window.confirm(t('deleteConfirm'))) removeOwnEntry(conference.id)
}

const conferences = computed(() =>
  [...allConferences.value]
    .sort((a, b) => compareConferences(a, b))
    .filter((c) => {
      if (filter.value === 'own' && !c.own) return false
      if ((filter.value === 'nlp' || filter.value === 'ml') && c.category !== filter.value) return false
      const q = search.value.trim().toLowerCase()
      if (!q) return true
      return [c.acronym, c.name, c.location].some((s) => s.toLowerCase().includes(q))
    }),
)

type Filter = 'all' | 'nlp' | 'ml' | 'own'
const filter = ref<Filter>('all')
const search = ref('')

function filterLabel(f: Filter): string {
  if (f === 'all') return t('filterAll')
  if (f === 'nlp') return t('filterNlp')
  if (f === 'ml') return t('filterMl')
  return t('filterOwn')
}
</script>
