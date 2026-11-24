<template>
  <div class="note-editor">
    <textarea
      v-model="text"
      rows="2"
      maxlength="2000"
      :placeholder="t('notePlaceholder')"
      @input="onInput"
      @paste="onPaste"
    ></textarea>
    <span class="word-counter" :class="{ over: over }">{{ counterText }}</span>
    <transition name="toast">
      <span v-if="saved" class="note-saved">{{ t('noteSaved') }}</span>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Conference } from '../types'
import { setUserNote } from '../store/conferences'
import { t } from '../i18n'

const props = defineProps<{ conference: Conference }>()

const MAX_WORDS = 200

const text = ref(props.conference.userNote ?? '')
const saved = ref(false)
let debounce: ReturnType<typeof setTimeout> | undefined
let savedTimer: ReturnType<typeof setTimeout> | undefined

// Reset text when the entry is reset/edited elsewhere (as long as not being typed on dirty state)
watch(
  () => props.conference.userNote,
  (v) => {
    if (text.value !== (v ?? '') && !text.value) text.value = v ?? ''
  },
)

function countWords(s: string): number {
  if (!s.trim()) return 0
  return s.trim().split(/\s+/).filter(Boolean).length
}

const words = computed(() => countWords(text.value))
const over = computed(() => words.value > MAX_WORDS)
const counterText = computed(() => t('wordCounter').replace('{n}', String(words.value)))

/** Hard limit: drop words beyond 200 */
function enforceLimit(s: string): string {
  const parts = s.trim().split(/\s+/).filter(Boolean)
  return parts.length <= MAX_WORDS ? s : parts.slice(0, MAX_WORDS).join(' ')
}

function onInput(): void {
  if (countWords(text.value) > MAX_WORDS) text.value = enforceLimit(text.value)
  scheduleSave()
}

// Pasted content can overshoot the limit in one chunk
function onPaste(event: ClipboardEvent): void {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text') ?? ''
  const target = event.target as HTMLTextAreaElement
  const next = enforceLimit(text.value.slice(0, target.selectionStart) + pasted + text.value.slice(target.selectionEnd))
  text.value = next.trim()
  scheduleSave()
}

function scheduleSave(): void {
  clearTimeout(debounce)
  debounce = setTimeout(save, 800)
}

function save(): void {
  setUserNote(props.conference, text.value.trim() || undefined)
  saved.value = true
  clearTimeout(savedTimer)
  savedTimer = setTimeout(() => (saved.value = false), 2000)
}
</script>
