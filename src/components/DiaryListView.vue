<script setup lang="ts">
import { computed } from 'vue'
import type { DiaryRecord } from '../types/diary'
import { buildCurrentMonthDays, formatListDateLabel } from '../utils/date'

const props = defineProps<{
  year: number
  month: number
  selectedDate: string
  records: DiaryRecord[]
}>()

const emit = defineEmits<{
  'update:selectedDate': [date: string]
}>()

const statusIconMap = {
  headache: '😖',
  notRefreshing: '😐',
  refreshing: '😊',
} as const

const days = computed(() => buildCurrentMonthDays(props.year, props.month))

const findRecord = (dateKey: string) => {
  return props.records.find((record) => record.date === dateKey)
}

const formatRecordLabel = (record?: DiaryRecord) => {
  const markers: string[] = []

  if (record?.status) {
    markers.push(statusIconMap[record.status])
  }

  if (record?.medicine) {
    markers.push('💊')
  }

  return markers.length > 0 ? markers.join('') : '未入力'
}
</script>

<template>
  <div class="diary-list" aria-label="月の日記リスト">
    <button
      v-for="day in days"
      :key="day.dateKey"
      class="diary-list-row"
      :class="{ 'is-selected': day.dateKey === selectedDate }"
      type="button"
      @click="emit('update:selectedDate', day.dateKey)"
    >
      <span class="diary-list-date">{{ formatListDateLabel(day.date) }}</span>
      <span
        class="diary-list-status"
        :class="{ 'is-empty': formatRecordLabel(findRecord(day.dateKey)) === '未入力' }"
      >
        {{ formatRecordLabel(findRecord(day.dateKey)) }}
      </span>
    </button>
  </div>
</template>
