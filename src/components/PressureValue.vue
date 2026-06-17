<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PressureCoordinates } from '../utils/pressure'
import { fetchSurfacePressure } from '../utils/pressure'

const props = defineProps<{
  coordinates: PressureCoordinates | null
  date: string
}>()

const pressure = ref<number | null>(null)
const hasError = ref(false)

watch(
  () => [props.date, props.coordinates] as const,
  async ([date, coordinates]) => {
    hasError.value = false
    pressure.value = null

    if (!coordinates) {
      return
    }

    try {
      pressure.value = await fetchSurfacePressure(date, coordinates)
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
