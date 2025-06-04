export interface Flight {
  id: string
  airline: string
  flightNumber: string
  from: string
  to: string
  departure: string
  arrival: string
  duration: string
  price: number
  currency: string
  stops: number
  aircraft: string
}

export interface Hotel {
  id: string
  name: string
  location: string
  city: string
  rating: number
  pricePerNight: number
  currency: string
  amenities: string[]
  description: string
}

export const flights: Flight[] = [
  {
    id: "BA456",
    airline: "British Airways",
    flightNumber: "BA 456",
    from: "Madrid (MAD)",
    to: "London Heathrow (LHR)",
    departure: "08:30",
    arrival: "10:15",
    duration: "2h 45m",
    price: 245,
    currency: "EUR",
    stops: 0,
    aircraft: "Airbus A320",
  },
  {
    id: "IB3170",
    airline: "Iberia",
    flightNumber: "IB 3170",
    from: "Madrid (MAD)",
    to: "London Heathrow (LHR)",
    departure: "14:20",
    arrival: "16:05",
    duration: "2h 45m",
    price: 198,
    currency: "EUR",
    stops: 0,
    aircraft: "Airbus A321",
  },
  {
    id: "AF1801",
    airline: "Air France",
    flightNumber: "AF 1801",
    from: "Madrid (MAD)",
    to: "Paris Charles de Gaulle (CDG)",
    departure: "11:15",
    arrival: "13:30",
    duration: "2h 15m",
    price: 156,
    currency: "EUR",
    stops: 0,
    aircraft: "Boeing 737",
  },
  {
    id: "LH1110",
    airline: "Lufthansa",
    flightNumber: "LH 1110",
    from: "Madrid (MAD)",
    to: "Frankfurt (FRA)",
    departure: "16:45",
    arrival: "19:20",
    duration: "2h 35m",
    price: 289,
    currency: "EUR",
    stops: 0,
    aircraft: "Airbus A319",
  },
  {
    id: "BA2570",
    airline: "British Airways",
    flightNumber: "BA 2570",
    from: "London Heathrow (LHR)",
    to: "Madrid (MAD)",
    departure: "12:30",
    arrival: "16:15",
    duration: "2h 45m",
    price: 267,
    currency: "EUR",
    stops: 0,
    aircraft: "Boeing 787",
  },
]

export const hotels: Hotel[] = [
  {
    id: "marriott-london",
    name: "London Marriott Hotel County Hall",
    location: "Westminster Bridge Road, London",
    city: "London",
    rating: 4.5,
    pricePerNight: 320,
    currency: "EUR",
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Room Service", "Concierge"],
    description: "Luxury hotel with Thames views in central London",
  },
  {
    id: "hilton-london",
    name: "Hilton London Park Lane",
    location: "Park Lane, Mayfair, London",
    city: "London",
    rating: 4.3,
    pricePerNight: 285,
    currency: "EUR",
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Spa", "Business Center"],
    description: "Elegant hotel in the heart of Mayfair",
  },
  {
    id: "ritz-madrid",
    name: "Hotel Ritz Madrid",
    location: "Plaza de la Lealtad, Madrid",
    city: "Madrid",
    rating: 5.0,
    pricePerNight: 450,
    currency: "EUR",
    amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Gym", "Concierge", "Valet Parking"],
    description: "Iconic luxury hotel in the Golden Triangle of Art",
  },
  {
    id: "westin-madrid",
    name: "The Westin Palace Madrid",
    location: "Plaza de las Cortes, Madrid",
    city: "Madrid",
    rating: 4.6,
    pricePerNight: 380,
    currency: "EUR",
    amenities: ["WiFi", "Restaurant", "Bar", "Gym", "Business Center", "Room Service"],
    description: "Historic palace hotel near the Prado Museum",
  },
  {
    id: "marriott-paris",
    name: "Paris Marriott Champs Elysees Hotel",
    location: "Champs-Élysées, Paris",
    city: "Paris",
    rating: 4.4,
    pricePerNight: 395,
    currency: "EUR",
    amenities: ["WiFi", "Restaurant", "Bar", "Gym", "Spa", "Concierge"],
    description: "Sophisticated hotel on the famous Champs-Élysées",
  },
]
