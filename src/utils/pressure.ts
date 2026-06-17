export const PRESSURE_LOCATIONS = {
  ichikawa: {
    name: '市川市',
    lat: 35.72,
    lon: 139.92,
  },
  tokyo23: {
    name: '東京23区',
    lat: 35.68,
    lon: 139.76,
  },
  yokohama: {
    name: '横浜市',
    lat: 35.44,
    lon: 139.64,
  },
  saitama: {
    name: 'さいたま市',
    lat: 35.86,
    lon: 139.65,
  },
  chiba: {
    name: '千葉市',
    lat: 35.61,
    lon: 140.11,
  },
} as const

export type PressureLocationId = keyof typeof PRESSURE_LOCATIONS

interface OpenMeteoPressureResponse {
  hourly?: {
    surface_pressure?: Array<number | null>
  }
}

export const isPressureLocationId = (value: unknown): value is PressureLocationId => {
  return typeof value === 'string' && value in PRESSURE_LOCATIONS
}

export const fetchSurfacePressure = async (dateKey: string, locationId: PressureLocationId) => {
  const location = PRESSURE_LOCATIONS[locationId]
  const params = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lon),
    hourly: 'surface_pressure',
    start_date: dateKey,
    end_date: dateKey,
    timezone: 'Asia/Tokyo',
  })

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch pressure')
  }

  const data = (await response.json()) as OpenMeteoPressureResponse
  const values = data.hourly?.surface_pressure?.filter((value): value is number => {
    return typeof value === 'number'
  })

  if (!values || values.length === 0) {
    throw new Error('Pressure data is empty')
  }

  const average = values.reduce((total, value) => total + value, 0) / values.length

  return Math.round(average)
}
