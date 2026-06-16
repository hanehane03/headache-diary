import type { DiaryRecord } from '../types/diary'

const statusIconMap = {
  headache: '😖',
  notRefreshing: '😐',
  refreshing: '😊',
} as const

const headacheLevelMap = {
  軽度: '軽',
  中度: '中',
  重度: '重',
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

export const getShortHeadacheLevel = (record?: DiaryRecord) => {
  const level = getHeadacheLevel(record)

  return level ? headacheLevelMap[level] : ''
}

export const getListRecordLabel = (record?: DiaryRecord) => {
  const icons = getRecordIcons(record).join('')
  const level = getHeadacheLevel(record)

  if (!icons && !level) {
    return '未入力'
  }

  return [icons, level ? `[${level}]` : ''].filter(Boolean).join(' ')
}
