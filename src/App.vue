<template>
  <div class="app">
    <header class="site-header">
      <div>
        <h1>{{ t('appTitle') }}</h1>
        <p class="tagline">{{ t('tagline') }}</p>
      </div>
      <LanguageSwitcher />
    </header>

    <p class="notice">{{ t('mockDataNote') }}</p>

    <main class="card-grid">
      <ConferenceCard v-for="c in conferences" :key="c.acronym" :conference="c" />
    </main>

    <footer class="site-footer">
      <p>{{ t('footerNote') }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t } from './i18n'
import type { Conference } from './types'
import ConferenceCard from './components/ConferenceCard.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import defaultConferences from './data/conferences.json'

const conferences = computed(() => defaultConferences as Conference[])
</script>
