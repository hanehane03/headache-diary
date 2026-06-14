<script setup lang="ts">
import { computed, ref } from 'vue'
import CalendarMonth from './components/CalendarMonth.vue'
import DiaryForm from './components/DiaryForm.vue'
import type { DiaryRecord } from './types/diary'
import { formatDateLabel, formatMonthLabel, toDateKey } from './utils/date'

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const selectedDate = ref(toDateKey(today))
const records = ref<DiaryRecord[]>([])

const monthLabel = computed(() => formatMonthLabel(currentYear.value, currentMonth.value))
const selectedDateLabel = computed(() => formatDateLabel(selectedDate.value))

const selectedRecord = computed<DiaryRecord>(() => {
  const record = records.value.find((item) => item.date === selectedDate.value)

  return (
    record ?? {
      date: selectedDate.value,
      status: null,
      medicine: false,
      memo: '',
    }
  )
})

const moveMonth = (offset: number) => {
  const nextDate = new Date(currentYear.value, currentMonth.value + offset, 1)
  currentYear.value = nextDate.getFullYear()
  currentMonth.value = nextDate.getMonth()
}

const moveToToday = () => {
  const nextToday = new Date()
  currentYear.value = nextToday.getFullYear()
  currentMonth.value = nextToday.getMonth()
  selectedDate.value = toDateKey(nextToday)
}

const updateRecord = (record: DiaryRecord) => {
  const nextRecords = [...records.value]
  const recordIndex = nextRecords.findIndex((item) => item.date === record.date)

  if (recordIndex >= 0) {
    nextRecords[recordIndex] = record
  } else {
    nextRecords.push(record)
  }

  records.value = nextRecords
}
</script>

<template>
  <main class="app-shell">
    <header class="app-header">
      <div>
        <p class="app-kicker">頭痛日記</p>
        <h1>{{ monthLabel }}</h1>
      </div>

      <button class="today-button" type="button" @click="moveToToday">今日</button>
    </header>

    <section class="calendar-panel" aria-label="月表示カレンダー">
      <div class="month-controls" aria-label="月の切り替え">
        <button type="button" @click="moveMonth(-1)">前月</button>
        <p>{{ monthLabel }}</p>
        <button type="button" @click="moveMonth(1)">翌月</button>
      </div>

      <CalendarMonth
        v-model:selected-date="selectedDate"
        :records="records"
        :year="currentYear"
        :month="currentMonth"
      />
    </section>

    <DiaryForm
      class="diary-section"
      :date-label="selectedDateLabel"
      :record="selectedRecord"
      @update:record="updateRecord"
    />
  </main>
</template>
