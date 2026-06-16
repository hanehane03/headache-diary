import type { DiaryRecord } from '../types/diary'

const statusIconMap = {
  headache: '😖',
  notRefreshing: '😐',
  refreshing: '😊',
} as const

const headacheLevelMap = {
  軽度: {
    shortLabel: '軽',
    tone: 'mild',
  },
  中度: {
    shortLabel: '中',
    tone: 'moderate',
  },
  重度: {
    shortLabel: '重',
    tone: 'severe',
  },
} as const

type HeadacheLevel = keyof typeof headacheLevelMap

const headacheLevelPattern = /\[(軽度|中度|重度)\]/

export const hasRecordContent = (record?: DiaryRecord) => {
  return Boolean(record?.status || record?.medicine || record?.memo.trim())
}

export const getRecordIcons = (record?: DiaryRecord) => {
  const icons: string[] = []

  if (record?.status) {
    icons.push(statusIconMap[record.status])
  }

  if (record?.medicine) {
    icons.push('💊')
  }

  return icons
}

export const getHeadacheLevel = (record?: DiaryRecord): HeadacheLevel | null => {
  const match = record?.memo.match(headacheLevelPattern)

  return match ? (match[1] as HeadacheLevel) : null
}

export const getHeadacheLevelBadge = (record?: DiaryRecord) => {
  const level = getHeadacheLevel(record)

  return level ? headacheLevelMap[level] : null
}

export const getListRecordLabel = (record?: DiaryRecord) => {
  const icons = getRecordIcons(record).join('')
  const level = getHeadacheLevel(record)

  if (!icons && !level) {
    return '未入力'
  }

  return [icons, level ? `[${level}]` : ''].filter(Boolean).join(' ')
}
