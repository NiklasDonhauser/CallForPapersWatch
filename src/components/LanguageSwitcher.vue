<template>
  <div class="lang-switcher" role="group" :title="t('tooltipLang')">
    <button :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
    <button :class="{ active: locale === 'de' }" @click="setLocale('de')">DE</button>
  </div>
</template>

<script setup lang="ts">
import { locale, setLocale, t } from '../i18n'
</script>
