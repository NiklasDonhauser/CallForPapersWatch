<template>
  <button type="button" class="theme-btn" :title="t('tooltipTheme')" @click="toggleTheme">
    {{ theme === 'dark' ? '☀️' : '🌙' }}
  </button>
</template>

<script setup lang="ts">
import { theme, toggleTheme } from '../theme'
import { t } from '../i18n'
</script>
