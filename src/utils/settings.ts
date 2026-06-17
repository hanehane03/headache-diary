import { isPressureCoordinates, type PressureCoordinates } from './pressure'

const SETTINGS_KEY = 'headache-diary-settings'

export interface PressureCurrentLocation extends PressureCoordinates {
  address: string | null
  updatedAt: string
}

export interface AppSettings {
  pressureEnabled: boolean
  pressureCurrentLocation: PressureCurrentLocation | null
}

const defaultSettings: AppSettings = {
  pressureEnabled: false,
  pressureCurrentLocation: null,
}

const isPressureCurrentLocation = (value: unknown): value is PressureCurrentLocation => {
  if (!isPressureCoordinates(value)) {
    return false
  }

  const location = value as unknown as Record<string, unknown>

  return typeof location.updatedAt === 'string'
}

const normalizeSettings = (settings: Record<string, unknown>): AppSettings => {
  return {
    pressureEnabled:
      typeof settings.pressureEnabled === 'boolean'
        ? settings.pressureEnabled
        : defaultSettings.pressureEnabled,
    pressureCurrentLocation: isPressureCurrentLocation(settings.pressureCurrentLocation)
      ? {
          ...settings.pressureCurrentLocation,
          address:
            typeof settings.pressureCurrentLocation.address === 'string'
              ? settings.pressureCurrentLocation.address
              : null,
        }
      : null,
  }
}

export const loadAppSettings = (): AppSettings => {
  const storedSettings = localStorage.getItem(SETTINGS_KEY)

  if (!storedSettings) {
    return defaultSettings
  }

  try {
    const parsedSettings: unknown = JSON.parse(storedSettings)

    return parsedSettings && typeof parsedSettings === 'object'
      ? normalizeSettings(parsedSettings as Record<string, unknown>)
      : defaultSettings
  } catch {
    return defaultSettings
  }
}

export const saveAppSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
