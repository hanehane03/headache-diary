<script setup lang="ts">
import type { CalendarDay } from '../utils/date'
import type { DiaryRecord } from '../types/diary'
import { isToday } from '../utils/date'
import { getRecordIcons, getShortHeadacheLevel, hasRecordContent } from '../utils/recordDisplay'

defineProps<{
  day: CalendarDay
  selectedDate: string
  record?: DiaryRecord
}>()

const emit = defineEmits<{
  select: [dateKey: string]
}>()
</script>

<template>
  <button
    class="day-cell"
    :class="{
      'is-muted': !day.isCurrentMonth,
      'is-today': isToday(day.date),
      'is-selected': day.dateKey === selectedDate,
      'has-record': hasRecordContent(record),
    }"
    type="button"
    @click="emit('select', day.dateKey)"
  >
    <span class="day-number">{{ day.date.getDate() }}</span>
    <span v-if="getRecordIcons(record).length > 0" class="day-markers" aria-label="記録あり">
      <span v-for="icon in getRecordIcons(record)" :key="icon">{{ icon }}</span>
      <span v-if="getShortHeadacheLevel(record)" class="day-level">
        {{ getShortHeadacheLevel(record) }}
      </span>
    </span>
  </button>
</template>
