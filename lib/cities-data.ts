export interface CityData {
  name: string
  country: string
  continent: string
  businessHub: boolean
  imageUrl: string
  description: string
  popularRoutes: string[]
  averageHotelPrice: number
  currency: string
  timezone: string
  businessDistricts: string[]
}

export const citiesData: CityData[] = [
  {
    name: "London",
    country: "United Kingdom",
    continent: "Europe",
    businessHub: true,
    imageUrl: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg",
    description: "Global financial center with world-class business infrastructure",
    popularRoutes: ["Madrid", "Paris", "Frankfurt", "Amsterdam", "Dublin"],
    averageHotelPrice: 320,
    currency: "GBP",
    timezone: "GMT",
    businessDistricts: ["City of London", "Canary Wharf", "Westminster"],
  },
  {
    name: "Paris",
    country: "France",
    continent: "Europe",
    businessHub: true,
    imageUrl: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
    description: "European business capital with luxury and sophistication",
    popularRoutes: ["London", "Madrid", "Frankfurt", "Milan", "Brussels"],
    averageHotelPrice: 280,
    currency: "EUR",
    timezone: "CET",
    businessDistricts: ["La Défense", "8th Arrondissement", "1st Arrondissement"],
  },
  {
    name: "Frankfurt",
    country: "Germany",
    continent: "Europe",
    businessHub: true,
    imageUrl: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg",
    description: "European financial hub and major business center",
    popularRoutes: ["London", "Paris", "Madrid", "Zurich", "Amsterdam"],
    averageHotelPrice: 250,
    currency: "EUR",
    timezone: "CET",
    businessDistricts: ["Bankenviertel", "Westend", "Niederrad"],
  },
  {
    name: "Madrid",
    country: "Spain",
    continent: "Europe",
    businessHub: true,
    imageUrl: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg",
    description: "Spain's business capital with growing international presence",
    popularRoutes: ["London", "Paris", "Frankfurt", "Barcelona", "Lisbon"],
    averageHotelPrice: 180,
    currency: "EUR",
    timezone: "CET",
    businessDistricts: ["Salamanca", "Chamberí", "AZCA"],
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    continent: "Europe",
    businessHub: true,
    imageUrl: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg",
    description: "European tech hub with innovative business ecosystem",
    popularRoutes: ["London", "Frankfurt", "Paris", "Brussels", "Copenhagen"],
    averageHotelPrice: 220,
    currency: "EUR",
    timezone: "CET",
    businessDistricts: ["Zuidas", "City Center", "Noord"],
  },
  {
    name: "Milan",
    country: "Italy",
    continent: "Europe",
    businessHub: true,
    imageUrl: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg",
    description: "Italy's economic powerhouse and fashion capital",
    popularRoutes: ["Paris", "Frankfurt", "London", "Zurich", "Barcelona"],
    averageHotelPrice: 200,
    currency: "EUR",
    timezone: "CET",
    businessDistricts: ["Porta Nuova", "Brera", "Quadrilatero"],
  },
  {
    name: "Zurich",
    country: "Switzerland",
    continent: "Europe",
    businessHub: true,
    imageUrl: "https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg",
    description: "Global financial center with premium business services",
    popularRoutes: ["Frankfurt", "London", "Paris", "Milan", "Vienna"],
    averageHotelPrice: 380,
    currency: "CHF",
    timezone: "CET",
    businessDistricts: ["Paradeplatz", "Oerlikon", "Altstetten"],
  },
  {
    name: "Barcelona",
    country: "Spain",
    continent: "Europe",
    businessHub: true,
    imageUrl: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg",
    description: "Mediterranean business hub with vibrant startup scene",
    popularRoutes: ["Madrid", "Paris", "Milan", "London", "Frankfurt"],
    averageHotelPrice: 160,
    currency: "EUR",
    timezone: "CET",
    businessDistricts: ["22@", "Eixample", "Diagonal"],
  },
  {
    name: "Dublin",
    country: "Ireland",
    continent: "Europe",
    businessHub: true,
    imageUrl: "https://images.pexels.com/photos/2416653/pexels-photo-2416653.jpeg",
    description: "European tech capital with favorable business environment",
    popularRoutes: ["London", "Frankfurt", "Paris", "Amsterdam", "Brussels"],
    averageHotelPrice: 200,
    currency: "EUR",
    timezone: "GMT",
    businessDistricts: ["IFSC", "Grand Canal Dock", "City Centre"],
  },
  {
    name: "Brussels",
    country: "Belgium",
    continent: "Europe",
    businessHub: true,
    imageUrl: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg",
    description: "European Union capital and international business center",
    popularRoutes: ["London", "Paris", "Frankfurt", "Amsterdam", "Luxembourg"],
    averageHotelPrice: 180,
    currency: "EUR",
    timezone: "CET",
    businessDistricts: ["European Quarter", "Louise", "City Center"],
  },
]

export function getCityByName(name: string): CityData | undefined {
  return citiesData.find((city) => city.name.toLowerCase() === name.toLowerCase())
}

export function getPopularDestinations(fromCity: string): CityData[] {
  const city = getCityByName(fromCity)
  if (!city) return citiesData.slice(0, 3)

  return city.popularRoutes
    .map((routeCity) => getCityByName(routeCity))
    .filter((city): city is CityData => city !== undefined)
    .slice(0, 3)
}

export function getBusinessHubs(): CityData[] {
  return citiesData.filter((city) => city.businessHub)
}
