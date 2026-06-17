<script setup lang="ts">
import BackupRestore from './BackupRestore.vue'
import type { DiaryRecord } from '../types/diary'

defineProps<{
  pressureFeatureAvailable: boolean
  pressureEnabled: boolean
  records: DiaryRecord[]
}>()

const emit = defineEmits<{
  close: []
  restore: [records: DiaryRecord[]]
  'update:pressureEnabled': [enabled: boolean]
}>()
</script>

<template>
  <div class="settings-modal-backdrop" role="presentation" @click.self="emit('close')">
    <section class="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <header class="settings-modal-header">
        <h2 id="settings-title">設定</h2>
        <button type="button" aria-label="設定を閉じる" @click="emit('close')">×</button>
      </header>

      <BackupRestore :records="records" @restore="emit('restore', $event)" />

      <div v-if="pressureFeatureAvailable" class="settings-divider" role="presentation"></div>

      <label v-if="pressureFeatureAvailable" class="experimental-setting">
        <input
          type="checkbox"
          :checked="pressureEnabled"
          @change="
            emit('update:pressureEnabled', ($event.target as HTMLInputElement).checked)
          "
        />
        <span>気圧表示（実験機能）</span>
      </label>
    </section>
  </div>
</template>
