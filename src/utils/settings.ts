const SETTINGS_KEY = 'headache-diary-settings'

export interface AppSettings {
  pressureEnabled: boolean
}

const defaultSettings: AppSettings = {
  pressureEnabled: false,
}

const isAppSettings = (value: unknown): value is AppSettings => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const settings = value as Record<string, unknown>

  return typeof settings.pressureEnabled === 'boolean'
}

export const loadAppSettings = (): AppSettings => {
  const storedSettings = localStorage.getItem(SETTINGS_KEY)

  if (!storedSettings) {
    return defaultSettings
  }

  try {
    const parsedSettings: unknown = JSON.parse(storedSettings)

    return isAppSettings(parsedSettings) ? parsedSettings : defaultSettings
  } catch {
    return defaultSettings
  }
}

export const saveAppSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
