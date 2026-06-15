<script setup lang="ts">
import { computed } from 'vue'
import type { PeriodSummary } from '../utils/summary'
import { formatDateLabel } from '../utils/date'

const props = defineProps<{
  summary: PeriodSummary
  startDate: string
  endDate: string
}>()

const emit = defineEmits<{
  'update:startDate': [date: string]
  'update:endDate': [date: string]
}>()

const periodLabel = computed(() => {
  return `${formatDateLabel(props.startDate)} ～ ${formatDateLabel(props.endDate)}`
})

const summaryItems: Array<{ key: keyof PeriodSummary; label: string }> = [
  { key: 'headacheDays', label: '頭痛があった日数' },
  { key: 'medicineDays', label: '痛み止めを服用した日数' },
  { key: 'notRefreshingDays', label: 'スッキリしなかった日数' },
  { key: 'refreshingDays', label: 'スッキリしていた日数' },
]
</script>

<template>
  <section class="period-summary" aria-label="期間集計">
    <div class="summary-period-header">
      <p>集計期間: {{ periodLabel }}</p>

      <div class="period-inputs">
        <label>
          <span>開始日</span>
          <input
            type="date"
            :value="startDate"
            @input="emit('update:startDate', ($event.target as HTMLInputElement).value)"
          />
        </label>

        <label>
          <span>終了日</span>
          <input
            type="date"
            :value="endDate"
            @input="emit('update:endDate', ($event.target as HTMLInputElement).value)"
          />
        </label>
      </div>
    </div>

    <div class="summary-cards">
      <article v-for="item in summaryItems" :key="item.key" class="summary-card">
        <span>{{ item.label }}</span>
        <strong>{{ summary[item.key] }}</strong>
      </article>
    </div>
  </section>
</template>
