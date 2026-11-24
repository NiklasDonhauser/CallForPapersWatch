<template>
  <div class="data-buttons">
    <button type="button" :title="t('tooltipExport')" @click="onExport">{{ t('exportJson') }}</button>
    <button type="button" :title="t('tooltipImport')" @click="fileInput?.click()">{{ t('importJson') }}</button>
    <button type="button" :title="t('tooltipShare')" @click="onShare">{{ t('shareLink') }}</button>
    <input
      ref="fileInput"
      type="file"
      accept="application/json,.json"
      class="hidden-input"
      @change="onFile"
    />
    <transition name="toast">
      <span v-if="toast" class="toast" :class="{ error: toastError }">{{ toast }}</span>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { exportEntries, importEntries } from '../store/conferences'
import type { Conference } from '../types'
import { t } from '../i18n'
import { buildShareLink, decodeEntries, downloadEntries, parseEntries } from '../utils/transfer'

const fileInput = ref<HTMLInputElement | null>(null)
const toast = ref('')
const toastError = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | undefined

function showToast(message: string, isError = false): void {
  toast.value = message
  toastError.value = isError
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 4000)
}

function onExport(): void {
  downloadEntries(exportEntries())
}

async function onFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    const entries = parseEntries(await file.text()) as Conference[]
    importEntries(entries)
    showToast(t('importOk'))
  } catch {
    showToast(t('importInvalid'), true)
  }
}

async function onShare(): Promise<void> {
  if (!exportEntries().length) return
  const link = buildShareLink(exportEntries())
  try {
    await navigator.clipboard.writeText(link)
    showToast(t('copyOk'))
  } catch {
    window.prompt(t('copyFail'), link)
  }
}

/** Parse and import a '#e=' payload from a shared link; returns affected count or null */
function tryImportFromHash(): number | null {
  const hash = window.location.hash
  const match = /^#e=([A-Za-z0-9_-]+)$/.exec(hash)
  if (!match) return null
  try {
    const entries = decodeEntries(match[1])
    if (entries.length && !window.confirm(t('confirmShareImport'))) {
      window.history.replaceState(null, '', window.location.pathname)
      return null
    }
    const count = importEntries(entries)
    window.history.replaceState(null, '', window.location.pathname)
    return count
  } catch {
    window.history.replaceState(null, '', window.location.pathname)
    return null
  }
}

onMounted(() => {
  try {
    if (tryImportFromHash() !== null) showToast(t('importOk'))
  } catch {
    /* document not ready for history API — ignore */
  }
})
</script>
