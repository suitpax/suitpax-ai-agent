"use client"

import { MapPin, Star, Wifi, Dumbbell, Coffee } from "lucide-react"
import type { Hotel } from "@/lib/travel-data"

interface HotelCardProps {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-3 w-3" />
      case "gym":
        return <Dumbbell className="h-3 w-3" />
      case "restaurant":
        return <Coffee className="h-3 w-3" />
      default:
        return <div className="h-3 w-3 rounded-full bg-white/30" />
    }
  }

  return (
    <div className="bg-black border border-white/10 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm">{hotel.name}</h3>
          <div className="flex items-center space-x-1 mt-1">
            <MapPin className="h-3 w-3 text-white/70" />
            <span className="text-white/70 text-xs">{hotel.location}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-medium text-sm">
            {hotel.pricePerNight} {hotel.currency}
          </div>
          <div className="text-white/70 text-xs">per night</div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.floor(hotel.rating) ? "text-yellow-400 fill-current" : "text-white/30"}`}
            />
          ))}
        </div>
        <span className="text-white/70 text-xs">{hotel.rating}</span>
      </div>

      <p className="text-white/70 text-xs">{hotel.description}</p>

      <div className="flex items-center space-x-2">
        {hotel.amenities.slice(0, 3).map((amenity, index) => (
          <div key={index} className="flex items-center space-x-1 text-white/70">
            {getAmenityIcon(amenity)}
            <span className="text-xs">{amenity}</span>
          </div>
        ))}
        {hotel.amenities.length > 3 && (
          <span className="text-white/70 text-xs">+{hotel.amenities.length - 3} more</span>
        )}
      </div>
    </div>
  )
}
