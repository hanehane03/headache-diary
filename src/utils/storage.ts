import type { DayStatus, DiaryRecord } from '../types/diary'

const STORAGE_KEY = 'headache-diary-records'
const dayStatuses: DayStatus[] = ['headache', 'notRefreshing', 'refreshing', null]

const isDayStatus = (value: unknown): value is DayStatus => {
  return dayStatuses.includes(value as DayStatus)
}

const isDiaryRecord = (value: unknown): value is DiaryRecord => {
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
