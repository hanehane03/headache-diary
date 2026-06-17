interface ReverseGeocodeResponse {
  address?: {
    state?: string
    province?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    ward?: string
    county?: string
  }
}

const compactAddressPart = (value: string | undefined) => value?.trim() || ''

const buildAddressLabel = (address: ReverseGeocodeResponse['address']) => {
  if (!address) {
    return null
  }

  const prefecture = compactAddressPart(address.state || address.province)
  const municipality = compactAddressPart(
    address.city || address.town || address.village || address.municipality || address.ward || address.county,
  )

  if (!prefecture && !municipality) {
    return null
  }

  if (!prefecture || !municipality) {
    return prefecture || municipality
  }

  return municipality.startsWith(prefecture) ? municipality : `${prefecture}${municipality}`
}

export const fetchAddressFromCoordinates = async (lat: number, lon: number) => {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lon),
    zoom: '10',
    'accept-language': 'ja',
  })

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`)

  if (!response.ok) {
    return null
  }

  const result = (await response.json()) as ReverseGeocodeResponse

  return buildAddressLabel(result.address)
}
