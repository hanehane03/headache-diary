<script setup lang="ts">
import { computed } from 'vue'
import CalendarDay from './CalendarDay.vue'
import type { DiaryRecord } from '../types/diary'
import { buildMonthDays } from '../utils/date'

const props = defineProps<{
  year: number
  month: number
  selectedDate: string
  records: DiaryRecord[]
}>()

const emit = defineEmits<{
  'update:selectedDate': [date: string]
}>()

const weekLabels = ['日', '月', '火', '水', '木', '金', '土']

const days = computed(() => buildMonthDays(props.year, props.month))

const findRecord = (dateKey: string) => {
  return props.records.find((record) => record.date === dateKey)
}
</script>

<template>
  <div class="calendar-grid">
    <div v-for="label in weekLabels" :key="label" class="weekday">
      {{ label }}
    </div>

    <CalendarDay
      v-for="day in days"
      :key="day.dateKey"
      :day="day"
      :record="findRecord(day.dateKey)"
      :selected-date="selectedDate"
      @select="emit('update:selectedDate', $event)"
    />
  </div>
</template>
