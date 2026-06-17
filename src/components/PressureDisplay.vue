<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PressureCoordinates } from '../utils/pressure'
import { fetchSurfacePressure } from '../utils/pressure'

const props = defineProps<{
  coordinates: PressureCoordinates | null
  date: string
}>()

const pressure = ref<number | null>(null)
const isLoading = ref(false)
const hasError = ref(false)

watch(
  () => [props.date, props.coordinates] as const,
  async ([date, coordinates]) => {
    hasError.value = false
    pressure.value = null

    if (!coordinates) {
      isLoading.value = false
      return
    }

    isLoading.value = true

    try {
      pressure.value = await fetchSurfacePressure(date, coordinates)
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
    <span v-if="!coordinates">気圧: 位置情報未設定</span>
    <span v-else-if="isLoading">気圧: 取得中...</span>
    <span v-else-if="hasError">気圧: 取得できませんでした</span>
    <span v-else>気圧: {{ pressure }} hPa</span>
  </p>
</template>
