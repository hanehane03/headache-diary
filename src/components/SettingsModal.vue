<script setup lang="ts">
import BackupRestore from './BackupRestore.vue'
import type { DiaryRecord } from '../types/diary'

defineProps<{
  records: DiaryRecord[]
}>()

const emit = defineEmits<{
  close: []
  restore: [records: DiaryRecord[]]
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
    </section>
  </div>
</template>
