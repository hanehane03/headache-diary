import type { PressureLocationId } from './pressure'
import { isPressureLocationId } from './pressure'

const SETTINGS_KEY = 'headache-diary-settings'

export interface AppSettings {
  pressureEnabled: boolean
  pressureLocation: PressureLocationId
}

const defaultSettings: AppSettings = {
  pressureEnabled: false,
  pressureLocation: 'ichikawa',
}

const isAppSettings = (value: unknown): value is AppSettings => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const settings = value as Record<string, unknown>

  return (
    typeof settings.pressureEnabled === 'boolean' &&
    (settings.pressureLocation === undefined || isPressureLocationId(settings.pressureLocation))
  )
}

const normalizeSettings = (settings: AppSettings | { pressureEnabled: boolean }) => {
  return {
    ...defaultSettings,
    ...settings,
  }
}

export const loadAppSettings = (): AppSettings => {
  const storedSettings = localStorage.getItem(SETTINGS_KEY)

  if (!storedSettings) {
    return defaultSettings
  }

  try {
    const parsedSettings: unknown = JSON.parse(storedSettings)

    return isAppSettings(parsedSettings) ? normalizeSettings(parsedSettings) : defaultSettings
  } catch {
    return defaultSettings
  }
}

export const saveAppSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
