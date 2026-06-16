<script setup lang="ts">
import type { DayStatus, DiaryRecord } from '../types/diary'

const props = defineProps<{
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

const headacheLevelOptions = ['軽度', '中度', '重度'] as const
const headacheLevelPattern = /\[(軽度|中度|重度)\]/
const headacheLevelPatternGlobal = /\[(軽度|中度|重度)\]\s*/g

const updateRecord = (updates: Partial<DiaryRecord>) => {
  emit('update:record', {
    ...props.record,
    ...updates,
  })
}

const removeHeadacheLevelFromMemo = (memo: string) => {
  return memo.replace(headacheLevelPatternGlobal, '').trimStart()
}

const updateStatus = (status: DayStatus) => {
  updateRecord({
    status,
    memo: status === 'headache' ? props.record.memo : removeHeadacheLevelFromMemo(props.record.memo),
  })
}

const applyHeadacheLevel = (level: (typeof headacheLevelOptions)[number]) => {
  const levelText = `[${level}]`
  const currentMemo = props.record.memo

  if (currentMemo.includes(levelText)) {
    return
  }

  const nextMemo = headacheLevelPattern.test(currentMemo)
    ? currentMemo.replace(headacheLevelPattern, levelText)
    : `${levelText}${currentMemo ? ` ${currentMemo}` : ''}`

  updateRecord({ memo: nextMemo })
}
</script>

<template>
  <section class="diary-form" aria-label="日ごとの記録">
    <div class="diary-form-header">
      <p>選択中の日付</p>
      <h2>{{ dateLabel }}</h2>
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

    <div v-if="record.status === 'headache'" class="headache-level">
      <span>頭痛レベル</span>
      <div class="headache-level-actions">
        <button
          v-for="level in headacheLevelOptions"
          :key="level"
          type="button"
          @click="applyHeadacheLevel(level)"
        >
          {{ level }}
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
