<template>
  <div class="lang-switcher" role="group">
    <button :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
    <button :class="{ active: locale === 'de' }" @click="setLocale('de')">DE</button>
  </div>
</template>

<script setup lang="ts">
import { locale, setLocale } from '../i18n'
</script>
