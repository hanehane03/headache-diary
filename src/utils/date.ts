export interface CalendarDay {
  date: Date
  dateKey: string
  isCurrentMonth: boolean
}

const padDatePart = (value: number) => String(value).padStart(2, '0')

export const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())

  return `${year}-${month}-${day}`
}

export const formatMonthLabel = (year: number, month: number) => {
  return `${year}年${month + 1}月`
}

export const formatDateLabel = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number)

  return `${year}年${month}月${day}日`
}

export const isToday = (date: Date) => {
  return toDateKey(date) === toDateKey(new Date())
}

export const buildMonthDays = (year: number, month: number): CalendarDay[] => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(year, month, 1 - firstDay.getDay())
  const days: CalendarDay[] = []
  const weekCount = Math.ceil((firstDay.getDay() + lastDay.getDate()) / 7)
  const visibleDayCount = weekCount * 7

  for (let index = 0; index < visibleDayCount; index += 1) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)

    days.push({
      date,
      dateKey: toDateKey(date),
      isCurrentMonth: date.getMonth() === month,
    })
  }

  return days
}
