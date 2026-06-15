import type { DiaryRecord } from '../types/diary'

export interface PeriodSummary {
  headacheDays: number
  medicineDays: number
  notRefreshingDays: number
  refreshingDays: number
}

const isRecordInPeriod = (record: DiaryRecord, startDate: string, endDate: string) => {
  return record.date >= startDate && record.date <= endDate
}

export const summarizePeriod = (
  records: DiaryRecord[],
  startDate: string,
  endDate: string,
): PeriodSummary => {
  const summary: PeriodSummary = {
    headacheDays: 0,
    medicineDays: 0,
    notRefreshingDays: 0,
    refreshingDays: 0,
  }

  for (const record of records) {
    if (!isRecordInPeriod(record, startDate, endDate)) {
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
