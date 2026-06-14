import type { DiaryRecord } from '../types/diary'

export interface MonthSummary {
  headacheDays: number
  medicineDays: number
  notRefreshingDays: number
  refreshingDays: number
}

const isRecordInMonth = (record: DiaryRecord, year: number, month: number) => {
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`

  return record.date.startsWith(monthPrefix)
}

export const summarizeMonth = (
  records: DiaryRecord[],
  year: number,
  month: number,
): MonthSummary => {
  const summary: MonthSummary = {
    headacheDays: 0,
    medicineDays: 0,
    notRefreshingDays: 0,
    refreshingDays: 0,
  }

  for (const record of records) {
    if (!isRecordInMonth(record, year, month)) {
      continue
    }

    if (record.status === 'headache') {
      summary.headacheDays += 1
    }

    if (record.medicine) {
      summary.medicineDays += 1
    }

    if (record.status === 'notRefreshing') {
      summary.notRefreshingDays += 1
    }

    if (record.status === 'refreshing') {
      summary.refreshingDays += 1
    }
  }

  return summary
}
