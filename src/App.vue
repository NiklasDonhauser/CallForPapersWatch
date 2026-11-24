<template>
  <div class="app">
    <header class="site-header">
      <div>
        <h1>{{ t('appTitle') }}</h1>
        <p class="tagline">{{ t('tagline') }}</p>
      </div>
      <div class="header-actions">
        <button type="button" class="primary-btn" @click="openAdd">+ {{ t('addEntry') }}</button>
        <DataButtons />
        <LanguageSwitcher />
      </div>
    </header>

    <p class="notice">{{ t('mockDataNote') }}</p>

    <main class="card-grid">
      <ConferenceCard
        v-for="c in conferences"
        :key="c.id ?? c.acronym"
        :conference="c"
        @edit="openEdit"
        @remove="askRemove"
      />
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
  [...allConferences.value].sort((a, b) => compareConferences(a, b)),
)
</script>
