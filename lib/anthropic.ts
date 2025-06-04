import { flights, hotels } from "@/lib/travel-data"

// Remove Anthropic import and client-side usage
// This file now only contains helper functions for data processing

export function detectCityMention(message: string): string | null {
  return extractSingleCity(message)
}

export function getRelevantFlights(city: string) {
  const lowerCity = city.toLowerCase()
  return flights
    .filter((flight) => flight.from.toLowerCase().includes(lowerCity) || flight.to.toLowerCase().includes(lowerCity))
    .slice(0, 3)
}

function extractSingleCity(message: string) {
  const cities = [
    "madrid",
    "london",
    "paris",
    "frankfurt",
    "barcelona",
    "rome",
    "amsterdam",
    "berlin",
    "milan",
    "zurich",
    "vienna",
    "brussels",
    "lisbon",
    "dublin",
    "copenhagen",
    "stockholm",
    "oslo",
    "helsinki",
  ]
  const lowerMessage = message.toLowerCase()

  for (const city of cities) {
    if (lowerMessage.includes(city)) {
      return city.charAt(0).toUpperCase() + city.slice(1)
    }
  }

  return null
}

// Enhanced context builder for better AI responses
export function buildTravelContext(): string {
  const flightContext = flights
    .slice(0, 5)
    .map(
      (f) =>
        `${f.airline} ${f.flightNumber}: ${f.from} to ${f.to}, ${f.departure}-${f.arrival} (${f.duration}), ${f.price} ${f.currency}, ${f.stops === 0 ? "Direct" : f.stops + " stop(s)"}, ${f.aircraft}`,
    )
    .join("; ")

  const hotelContext = hotels
    .slice(0, 5)
    .map(
      (h) =>
        `${h.name} in ${h.city}: ${h.pricePerNight} ${h.currency}/night, ${h.rating}★, amenities: ${h.amenities.join(", ")}, location: ${h.location}`,
    )
    .join("; ")

  return `Available flights: ${flightContext}. Available hotels: ${hotelContext}.`
}
