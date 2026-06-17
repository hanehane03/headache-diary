<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PressureLocationId } from '../utils/pressure'
import { fetchSurfacePressure } from '../utils/pressure'

const props = defineProps<{
  date: string
  location: PressureLocationId
}>()

const pressure = ref<number | null>(null)
const hasError = ref(false)

watch(
  () => [props.date, props.location] as const,
  async ([date, location]) => {
    hasError.value = false
    pressure.value = null

    try {
      pressure.value = await fetchSurfacePressure(date, location)
    } catch {
      hasError.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
  <span class="diary-list-pressure">{{ hasError || pressure === null ? '--' : `${pressure} hPa` }}</span>
</template>
