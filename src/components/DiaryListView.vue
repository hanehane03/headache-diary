<script setup lang="ts">
import { computed } from 'vue'
import PressureValue from './PressureValue.vue'
import type { DiaryRecord } from '../types/diary'
import type { PressureCoordinates } from '../utils/pressure'
import { buildCurrentMonthDays, formatListDateLabel } from '../utils/date'
import { getHeadacheLevelBadge, getListRecordLabel, getRecordIcons } from '../utils/recordDisplay'

const props = defineProps<{
  year: number
  month: number
  selectedDate: string
  pressureCoordinates: PressureCoordinates | null
  pressureEnabled: boolean
  records: DiaryRecord[]
}>()

const emit = defineEmits<{
  'update:selectedDate': [date: string]
}>()

const days = computed(() => buildCurrentMonthDays(props.year, props.month))

const findRecord = (dateKey: string) => {
  return props.records.find((record) => record.date === dateKey)
}
</script>

<template>
  <div class="diary-list" aria-label="月の日記リスト">
    <button
      v-for="day in days"
      :key="day.dateKey"
      class="diary-list-row"
      :class="{
        'is-selected': day.dateKey === selectedDate,
        'has-record': getListRecordLabel(findRecord(day.dateKey)) !== '未入力',
      }"
      type="button"
      @click="emit('update:selectedDate', day.dateKey)"
    >
      <span class="diary-list-date">{{ formatListDateLabel(day.date) }}</span>
      <span class="diary-list-detail">
        <span
          class="diary-list-status"
          :class="{ 'is-empty': getListRecordLabel(findRecord(day.dateKey)) === '未入力' }"
        >
          <template v-if="getListRecordLabel(findRecord(day.dateKey)) !== '未入力'">
            <span>{{ getRecordIcons(findRecord(day.dateKey)).join('') }}</span>
            <span
              v-if="getHeadacheLevelBadge(findRecord(day.dateKey))"
              class="level-badge list-level-badge"
              :class="`is-${getHeadacheLevelBadge(findRecord(day.dateKey))?.tone}`"
            >
              <span class="level-badge-text">
                {{ getHeadacheLevelBadge(findRecord(day.dateKey))?.listLabel }}
              </span>
            </span>
          </template>
          <template v-else>未入力</template>
        </span>
        <PressureValue
          v-if="pressureEnabled"
          :coordinates="pressureCoordinates"
          :date="day.dateKey"
        />
      </span>
    </button>
  </div>
</template>
