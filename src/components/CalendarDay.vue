<script setup lang="ts">
import type { CalendarDay } from '../utils/date'
import type { DiaryRecord } from '../types/diary'
import { isToday } from '../utils/date'

const props = defineProps<{
  day: CalendarDay
  selectedDate: string
  record?: DiaryRecord
}>()

const emit = defineEmits<{
  select: [dateKey: string]
}>()

const statusIconMap = {
  headache: '😖',
  notRefreshing: '😐',
  refreshing: '😊',
} as const
</script>

<template>
  <button
    class="day-cell"
    :class="{
      'is-muted': !day.isCurrentMonth,
      'is-today': isToday(day.date),
      'is-selected': day.dateKey === selectedDate,
      'has-record': record?.status !== null || record?.medicine,
    }"
    type="button"
    @click="emit('select', day.dateKey)"
  >
    <span class="day-number">{{ day.date.getDate() }}</span>
    <span v-if="record?.status || record?.medicine" class="day-markers" aria-label="記録あり">
      <span v-if="record.status">{{ statusIconMap[record.status] }}</span>
      <span v-if="record.medicine">💊</span>
    </span>
  </button>
</template>
