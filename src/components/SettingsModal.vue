<script setup lang="ts">
import BackupRestore from './BackupRestore.vue'
import type { DiaryRecord } from '../types/diary'
import type { PressureLocationId } from '../utils/pressure'
import { PRESSURE_LOCATIONS } from '../utils/pressure'

defineProps<{
  pressureFeatureAvailable: boolean
  pressureEnabled: boolean
  pressureLocation: PressureLocationId
  records: DiaryRecord[]
}>()

const emit = defineEmits<{
  close: []
  restore: [records: DiaryRecord[]]
  'update:pressureEnabled': [enabled: boolean]
  'update:pressureLocation': [location: PressureLocationId]
}>()

const pressureLocationOptions = Object.entries(PRESSURE_LOCATIONS).map(([id, location]) => ({
  id: id as PressureLocationId,
  name: location.name,
}))
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

        <label class="pressure-location-setting">
          <span>地域</span>
          <select
            :value="pressureLocation"
            @change="
              emit(
                'update:pressureLocation',
                ($event.target as HTMLSelectElement).value as PressureLocationId,
              )
            "
          >
            <option v-for="location in pressureLocationOptions" :key="location.id" :value="location.id">
              {{ location.name }}
            </option>
          </select>
        </label>
      </template>
    </section>
  </div>
</template>
