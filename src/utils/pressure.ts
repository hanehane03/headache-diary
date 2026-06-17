const ICHIKAWA_LATITUDE = 35.72
const ICHIKAWA_LONGITUDE = 139.92

interface OpenMeteoPressureResponse {
  hourly?: {
    surface_pressure?: Array<number | null>
  }
}

export const fetchSurfacePressure = async (dateKey: string) => {
  const params = new URLSearchParams({
    latitude: String(ICHIKAWA_LATITUDE),
    longitude: String(ICHIKAWA_LONGITUDE),
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
