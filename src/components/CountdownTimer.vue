<template>
  <div v-if="info.status === 'countdown'" class="countdown" :class="{ urgent: urgent }">
    <span class="cd-segment"><strong>{{ d }}</strong> {{ t('days') }}</span>
    <span class="cd-segment"><strong>{{ h }}</strong> {{ t('hours') }}</span>
    <span class="cd-segment"><strong>{{ m }}</strong> {{ t('minutes') }}</span>
    <span class="cd-segment"><strong>{{ s }}</strong> {{ t('seconds') }}</span>
  </div>
  <p v-else class="status-line" :class="statusClass">{{ statusText }}</p>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Conference } from '../types'
import { getDeadlineInfo, type DeadlineInfo } from '../utils/dates'
import { t, type StringKey } from '../i18n'

const props = defineProps<{ conference: Conference }>()

const nowMs = ref(Date.now())

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => {
    nowMs.value = Date.now()
  }, 1000)
})
onUnmounted(() => clearInterval(timer))

const targetMs = computed(() => (info.value.target ? new Date(info.value.target).getTime() : 0))

const remaining = computed(() => Math.max(0, targetMs.value - nowMs.value))

const d = computed(() => Math.floor(remaining.value / 86_400_000))
const h = computed(() => Math.floor((remaining.value % 86_400_000) / 3_600_000))
const m = computed(() => Math.floor((remaining.value % 3_600_000) / 60_000))
const s = computed(() => Math.floor((remaining.value % 60_000) / 1000))

const info = computed<DeadlineInfo>(() => getDeadlineInfo(props.conference, new Date(nowMs.value)))

/** Turn red below 14 days */
const urgent = computed(() => info.value.status === 'countdown' && remaining.value < 14 * 86_400_000)

const statusClass = computed(() => info.value.status)
const statusText = computed(() => {
  const map: Record<string, StringKey> = {
    passed: 'deadlinePassed',
    running: 'conferenceRunning',
    ended: 'conferenceEnded',
    tba: 'conferenceTba',
  }
  return t(map[info.value.status])
})
</script>
