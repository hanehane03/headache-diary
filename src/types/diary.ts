export type DayStatus = 'headache' | 'notRefreshing' | 'refreshing' | null

export interface DiaryRecord {
  date: string
  status: DayStatus
  medicine: boolean
  memo: string
}
