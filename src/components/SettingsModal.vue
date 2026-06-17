<script setup lang="ts">
import { ref } from 'vue'
import BackupRestore from './BackupRestore.vue'
import type { DiaryRecord } from '../types/diary'
import { fetchAddressFromCoordinates } from '../utils/geolocation'
import type { PressureCurrentLocation } from '../utils/settings'

defineProps<{
  pressureFeatureAvailable: boolean
  pressureEnabled: boolean
  pressureCurrentLocation: PressureCurrentLocation | null
  records: DiaryRecord[]
}>()

const emit = defineEmits<{
  close: []
  restore: [records: DiaryRecord[]]
  'update:pressureEnabled': [enabled: boolean]
  'update:pressureCurrentLocation': [location: PressureCurrentLocation]
}>()

const isLocating = ref(false)
const locationError = ref('')

const formatCoordinate = (value: number) => value.toFixed(3)

const formatUpdatedAt = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}`
}

const resolveAddress = async (lat: number, lon: number) => {
  try {
    return await fetchAddressFromCoordinates(lat, lon)
  } catch {
    return null
  }
}

const requestCurrentLocation = () => {
  locationError.value = ''

  if (!navigator.geolocation) {
    locationError.value = '位置情報を取得できませんでした'
    return
  }

  isLocating.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = Number(position.coords.latitude.toFixed(3))
      const lon = Number(position.coords.longitude.toFixed(3))
      const address = await resolveAddress(lat, lon)

      isLocating.value = false
      emit('update:pressureCurrentLocation', {
        lat,
        lon,
        address,
        updatedAt: new Date().toISOString(),
      })
    },
    (error) => {
      isLocating.value = false
      locationError.value =
        error.code === error.PERMISSION_DENIED
          ? '位置情報の取得が許可されませんでした'
          : '位置情報を取得できませんでした'
    },
  )
}
</script>

<template>
  <div class="settings-modal-backdrop" role="presentation" @click.self="emit('close')">
    <section class="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <header class="settings-modal-header">
        <h2 id="settings-title">設定</h2>
        <button type="button" aria-label="設定を閉じる" @click="emit('close')">×</button>
      </header>

      <BackupRestore :records="records" @restore="emit('restore', $event)" />

      <template v-if="pressureFeatureAvailable">
        <div class="settings-divider" role="presentation"></div>

        <label class="experimental-setting">
          <input
            type="checkbox"
            :checked="pressureEnabled"
            @change="
              emit('update:pressureEnabled', ($event.target as HTMLInputElement).checked)
            "
          />
          <span>気圧表示（実験機能）</span>
        </label>

        <section class="current-location-setting" aria-labelledby="current-location-title">
          <h3 id="current-location-title">現在地</h3>

          <div class="current-location-card">
            <p v-if="!pressureCurrentLocation" class="current-location-empty">未設定</p>
            <div v-else class="current-location-values">
              <p v-if="pressureCurrentLocation.address" class="current-location-address">
                {{ pressureCurrentLocation.address }}
              </p>
              <template v-else>
                <p>緯度: {{ formatCoordinate(pressureCurrentLocation.lat) }}</p>
                <p>経度: {{ formatCoordinate(pressureCurrentLocation.lon) }}</p>
              </template>
              <p>最終取得: {{ formatUpdatedAt(pressureCurrentLocation.updatedAt) }}</p>
            </div>
          </div>

          <p v-if="locationError" class="location-error">{{ locationError }}</p>

          <button
            type="button"
            class="location-button"
            :disabled="isLocating"
            @click="requestCurrentLocation"
          >
            {{ isLocating ? '取得中...' : '現在地を取得' }}
          </button>
        </section>
      </template>
    </section>
  </div>
</template>
