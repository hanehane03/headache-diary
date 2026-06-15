import type { DayStatus, DiaryRecord } from '../types/diary'

const STORAGE_KEY = 'headache-diary-records'
const BACKUP_VERSION = 1
const dayStatuses: DayStatus[] = ['headache', 'notRefreshing', 'refreshing', null]

export interface DiaryBackup {
  version: typeof BACKUP_VERSION
  exportedAt: string
  records: DiaryRecord[]
}

const isDayStatus = (value: unknown): value is DayStatus => {
  return dayStatuses.includes(value as DayStatus)
}

export const isDiaryRecord = (value: unknown): value is DiaryRecord => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.date === 'string' &&
    isDayStatus(record.status) &&
    typeof record.medicine === 'boolean' &&
    typeof record.memo === 'string'
  )
}

export const loadDiaryRecords = (): DiaryRecord[] => {
  const storedRecords = localStorage.getItem(STORAGE_KEY)

  if (!storedRecords) {
    return []
  }

  try {
    const parsedRecords: unknown = JSON.parse(storedRecords)

    if (!Array.isArray(parsedRecords)) {
      return []
    }

    return parsedRecords.filter(isDiaryRecord)
  } catch {
    return []
  }
}

export const saveDiaryRecords = (records: DiaryRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

const isDiaryBackup = (value: unknown): value is DiaryBackup => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const backup = value as Record<string, unknown>

  return (
    backup.version === BACKUP_VERSION &&
    typeof backup.exportedAt === 'string' &&
    Array.isArray(backup.records) &&
    backup.records.every(isDiaryRecord)
  )
}

export const createDiaryBackup = (records: DiaryRecord[]): DiaryBackup => {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    records,
  }
}

export const createBackupFileName = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `headache-diary-backup-${year}-${month}-${day}.json`
}

export const downloadDiaryBackup = (records: DiaryRecord[]) => {
  const backup = createDiaryBackup(records)
  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = createBackupFileName()
  link.click()
  URL.revokeObjectURL(url)
}

export const parseDiaryBackupFile = async (file: File): Promise<DiaryRecord[]> => {
  try {
    const text = await file.text()
    const parsedBackup: unknown = JSON.parse(text)

    if (!isDiaryBackup(parsedBackup)) {
      throw new Error('Invalid backup format')
    }

    return parsedBackup.records
  } catch {
    throw new Error('Invalid backup format')
  }
}
