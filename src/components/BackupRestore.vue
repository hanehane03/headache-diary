<script setup lang="ts">
import { ref } from 'vue'
import type { DiaryRecord } from '../types/diary'
import { downloadDiaryBackup, parseDiaryBackupFile } from '../utils/storage'

const props = defineProps<{
  records: DiaryRecord[]
}>()

const emit = defineEmits<{
  restore: [records: DiaryRecord[]]
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const backupRecords = () => {
  downloadDiaryBackup(props.records)
}

const openRestoreFilePicker = () => {
  fileInput.value?.click()
}

const restoreRecords = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) {
    return
  }

  if (!window.confirm('現在のデータを上書きします。よろしいですか？')) {
    return
  }

  try {
    const records = await parseDiaryBackupFile(file)
    emit('restore', records)
    window.alert('バックアップを復元しました')
  } catch {
    window.alert('バックアップファイルの形式が正しくありません')
  }
}
</script>

<template>
  <section class="backup-panel" aria-label="バックアップと復元">
    <div class="backup-panel-header">
      <h2>設定</h2>
    </div>

    <div class="backup-actions">
      <button type="button" @click="backupRecords">バックアップ</button>
      <button type="button" @click="openRestoreFilePicker">復元</button>
    </div>

    <input
      ref="fileInput"
      class="backup-file-input"
      type="file"
      accept="application/json,.json"
      @change="restoreRecords"
    />
  </section>
</template>
