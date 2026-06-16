import type { DiaryRecord } from '../types/diary'

const statusIconMap = {
  headache: '😖',
  notRefreshing: '😐',
  refreshing: '😊',
} as const

const levelMap = {
  '1': {
    shortLabel: '1',
    listLabel: '頭痛度1',
    tone: 'mild',
  },
  '2': {
    shortLabel: '2',
    listLabel: '頭痛度2',
    tone: 'moderate',
  },
  '3': {
    shortLabel: '3',
    listLabel: '頭痛度3',
    tone: 'severe',
  },
} as const

const legacyLevelMap = {
  軽度: '1',
  中度: '2',
  重度: '3',
  頭痛度1: '1',
  頭痛度2: '2',
  頭痛度3: '3',
} as const

type Level = keyof typeof levelMap
type LegacyLevel = keyof typeof legacyLevelMap

const levelPattern = /\[(1|2|3|軽度|中度|重度|頭痛度1|頭痛度2|頭痛度3)\]/

const canShowLevel = (record?: DiaryRecord) => {
  return record?.status === 'headache' || record?.status === 'notRefreshing'
}

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

export const getSymptomLevel = (record?: DiaryRecord): Level | null => {
  if (!record || !canShowLevel(record)) {
    return null
  }

  const match = record.memo.match(levelPattern)

  if (!match) {
    return null
  }

  const level = match[1]

  return level in legacyLevelMap ? legacyLevelMap[level as LegacyLevel] : (level as Level)
}

export const getHeadacheLevel = getSymptomLevel

export const getHeadacheLevelBadge = (record?: DiaryRecord) => {
  const level = getSymptomLevel(record)

  return level ? levelMap[level] : null
}

export const getListRecordLabel = (record?: DiaryRecord) => {
  const icons = getRecordIcons(record).join('')
  const level = getSymptomLevel(record)
  const levelLabel = level ? levelMap[level].listLabel : ''

  if (!icons && !levelLabel) {
    return '未入力'
  }

  return [icons, levelLabel].filter(Boolean).join(' ')
}
