<script setup lang="ts">
import type { MonthSummary } from '../utils/summary'

defineProps<{
  summary: MonthSummary
}>()

const summaryItems: Array<{ key: keyof MonthSummary; label: string }> = [
  { key: 'headacheDays', label: '頭痛があった日数' },
  { key: 'medicineDays', label: '痛み止めを服用した日数' },
  { key: 'notRefreshingDays', label: 'スッキリしなかった日数' },
  { key: 'refreshingDays', label: 'スッキリしていた日数' },
]
</script>

<template>
  <section class="month-summary" aria-label="月次集計">
    <article v-for="item in summaryItems" :key="item.key" class="summary-card">
      <span>{{ item.label }}</span>
      <strong>{{ summary[item.key] }}</strong>
    </article>
  </section>
</template>
