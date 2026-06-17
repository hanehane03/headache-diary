<script setup lang="ts">
import PressureDisplay from './PressureDisplay.vue'
import { FEATURES } from '../config/features'
import type { DayStatus, DiaryRecord } from '../types/diary'

const props = defineProps<{
  date: string
  dateLabel: string
  record: DiaryRecord
}>()

const emit = defineEmits<{
  'update:record': [record: DiaryRecord]
}>()

const statusOptions: Array<{ value: DayStatus; label: string }> = [
  { value: null, label: '未入力' },
  { value: 'headache', label: '頭痛あり' },
  { value: 'notRefreshing', label: 'スッキリしなかった' },
  { value: 'refreshing', label: 'スッキリしていた' },
]

const symptomLevelOptions = [
  { value: '1', label: '頭痛度1' },
  { value: '2', label: '頭痛度2' },
  { value: '3', label: '頭痛度3' },
] as const
const levelPattern = /\[(1|2|3|軽度|中度|重度|頭痛度1|頭痛度2|頭痛度3)\]/
const levelPatternGlobal = /\[(1|2|3|軽度|中度|重度|頭痛度1|頭痛度2|頭痛度3)\]\s*/g

const canUseSymptomLevel = (status: DayStatus) => {
  return status === 'headache' || status === 'notRefreshing'
}

const updateRecord = (updates: Partial<DiaryRecord>) => {
  emit('update:record', {
    ...props.record,
    ...updates,
  })
}

const removeLevelFromMemo = (memo: string) => {
  return memo.replace(levelPatternGlobal, '').trimStart()
}

const updateStatus = (status: DayStatus) => {
  updateRecord({
    status,
    memo: canUseSymptomLevel(status) ? props.record.memo : removeLevelFromMemo(props.record.memo),
  })
}

const applySymptomLevel = (level: (typeof symptomLevelOptions)[number]) => {
  const levelText = `[${level.label}]`
  const currentMemo = props.record.memo

  if (currentMemo.includes(levelText)) {
    return
  }

  const nextMemo = levelPattern.test(currentMemo)
    ? currentMemo.replace(levelPattern, levelText)
    : `${levelText}${currentMemo ? ` ${currentMemo}` : ''}`

  updateRecord({ memo: nextMemo })
}
</script>

<template>
  <section class="diary-form" aria-label="日ごとの記録">
    <div class="diary-form-header">
      <p>選択中の日付</p>
      <h2>{{ dateLabel }}</h2>
      <PressureDisplay v-if="FEATURES.pressure" :date="date" />
    </div>

    <fieldset class="status-field">
      <legend>体調</legend>

      <div class="status-options">
        <label
          v-for="option in statusOptions"
          :key="option.label"
          class="status-option"
          :class="{ 'is-active': record.status === option.value }"
        >
          <input
            type="radio"
            name="day-status"
            :checked="record.status === option.value"
            @change="updateStatus(option.value)"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>
    </fieldset>

    <label class="medicine-option">
      <input
        type="checkbox"
        :checked="record.medicine"
        @change="updateRecord({ medicine: ($event.target as HTMLInputElement).checked })"
      />
      <span>痛み止め服用</span>
    </label>

    <div v-if="canUseSymptomLevel(record.status)" class="headache-level">
      <span>頭痛度</span>
      <div class="headache-level-actions">
        <button
          v-for="level in symptomLevelOptions"
          :key="level.value"
          type="button"
          @click="applySymptomLevel(level)"
        >
          {{ level.label }}
        </button>
      </div>
    </div>

    <label class="memo-field">
      <span>メモ</span>
      <textarea
        :value="record.memo"
        rows="4"
        placeholder="症状、きっかけ、睡眠など"
        @input="updateRecord({ memo: ($event.target as HTMLTextAreaElement).value })"
      ></textarea>
    </label>
  </section>
</template>
