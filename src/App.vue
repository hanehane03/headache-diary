<script setup lang="ts">
import { computed, ref } from 'vue'
import CalendarMonth from './components/CalendarMonth.vue'
import DiaryForm from './components/DiaryForm.vue'
import DiaryListView from './components/DiaryListView.vue'
import PeriodSummary from './components/PeriodSummary.vue'
import SettingsModal from './components/SettingsModal.vue'
import type { DiaryRecord } from './types/diary'
import { summarizePeriod } from './utils/summary'
import { loadDiaryRecords, saveDiaryRecords } from './utils/storage'
import { formatDateLabel, formatMonthLabel, toDateKey } from './utils/date'

type DisplayMode = 'calendar' | 'list'

const today = new Date()
const initialStartDate = new Date(today)
initialStartDate.setDate(today.getDate() - 28)

const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const selectedDate = ref(toDateKey(today))
const displayMode = ref<DisplayMode>('calendar')
const isSettingsOpen = ref(false)
const summaryStartDate = ref(toDateKey(initialStartDate))
const summaryEndDate = ref(toDateKey(today))
const records = ref<DiaryRecord[]>(loadDiaryRecords())

const monthLabel = computed(() => formatMonthLabel(currentYear.value, currentMonth.value))
const selectedDateLabel = computed(() => formatDateLabel(selectedDate.value))
const periodSummary = computed(() =>
  summarizePeriod(records.value, summaryStartDate.value, summaryEndDate.value),
)

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
  saveDiaryRecords(nextRecords)
}

const restoreRecords = (restoredRecords: DiaryRecord[]) => {
  records.value = restoredRecords
  saveDiaryRecords(restoredRecords)
}
</script>

<template>
  <main class="app-shell">
    <header class="app-header">
      <div>
        <p class="app-kicker">頭痛日記</p>
        <h1>{{ monthLabel }}</h1>
      </div>

      <div class="header-actions">
        <button class="today-button" type="button" @click="moveToToday">今日</button>
        <button
          class="settings-button"
          type="button"
          aria-label="設定を開く"
          @click="isSettingsOpen = true"
        >
          ⚙️
        </button>
      </div>
    </header>

    <div class="view-switch" aria-label="表示切替">
      <button
        type="button"
        :class="{ 'is-active': displayMode === 'calendar' }"
        @click="displayMode = 'calendar'"
      >
        カレンダー
      </button>
      <button
        type="button"
        :class="{ 'is-active': displayMode === 'list' }"
        @click="displayMode = 'list'"
      >
        リスト
      </button>
    </div>

    <section class="calendar-panel" aria-label="記録表示">
      <PeriodSummary
        v-model:start-date="summaryStartDate"
        v-model:end-date="summaryEndDate"
        :summary="periodSummary"
      />

      <div class="month-controls" aria-label="月の切り替え">
        <button type="button" @click="moveMonth(-1)">前月</button>
        <p>{{ monthLabel }}</p>
        <button type="button" @click="moveMonth(1)">翌月</button>
      </div>

      <CalendarMonth
        v-if="displayMode === 'calendar'"
        v-model:selected-date="selectedDate"
        :records="records"
        :year="currentYear"
        :month="currentMonth"
      />

      <DiaryListView
        v-else
        v-model:selected-date="selectedDate"
        :records="records"
        :year="currentYear"
        :month="currentMonth"
      />
    </section>

    <DiaryForm
      class="diary-section"
      :date="selectedDate"
      :date-label="selectedDateLabel"
      :record="selectedRecord"
      @update:record="updateRecord"
    />

    <SettingsModal
      v-if="isSettingsOpen"
      :records="records"
      @close="isSettingsOpen = false"
      @restore="restoreRecords"
    />
  </main>
</template>
