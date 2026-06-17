<script setup lang="ts">
import { ref, watch } from 'vue'
import { fetchSurfacePressure } from '../utils/pressure'

const props = defineProps<{
  date: string
}>()

const pressure = ref<number | null>(null)
const isLoading = ref(false)
const hasError = ref(false)

watch(
  () => props.date,
  async (date) => {
    isLoading.value = true
    hasError.value = false
    pressure.value = null

    try {
      pressure.value = await fetchSurfacePressure(date)
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <p class="pressure-display">
    <span v-if="isLoading">気圧: 取得中...</span>
    <span v-else-if="hasError">気圧: 取得できませんでした</span>
    <span v-else>気圧: {{ pressure }} hPa</span>
  </p>
</template>
