"use client"

import { Plane, Clock, MapPin } from "lucide-react"
import type { Flight } from "@/lib/travel-data"

interface FlightCardProps {
  flight: Flight
}

export default function FlightCard({ flight }: FlightCardProps) {
  return (
    <div className="bg-black border border-white/10 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Plane className="h-4 w-4 text-white/70" />
          <span className="text-white font-medium text-sm">{flight.airline}</span>
          <span className="text-white/70 text-xs">{flight.flightNumber}</span>
        </div>
        <div className="text-right">
          <div className="text-white font-medium text-sm">
            {flight.price} {flight.currency}
          </div>
          <div className="text-white/70 text-xs">{flight.stops === 0 ? "Direct" : `${flight.stops} stop(s)`}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-white font-medium text-sm">{flight.departure}</div>
            <div className="text-white/70 text-xs">{flight.from.split("(")[0].trim()}</div>
          </div>
          <div className="flex items-center space-x-2 text-white/70">
            <div className="w-8 h-px bg-white/30"></div>
            <Clock className="h-3 w-3" />
            <div className="text-xs">{flight.duration}</div>
            <div className="w-8 h-px bg-white/30"></div>
          </div>
          <div className="text-center">
            <div className="text-white font-medium text-sm">{flight.arrival}</div>
            <div className="text-white/70 text-xs">{flight.to.split("(")[0].trim()}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-white/70">
        <span>{flight.aircraft}</span>
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3" />
          <span>
            {flight.from.split("(")[1]?.replace(")", "")} → {flight.to.split("(")[1]?.replace(")", "")}
          </span>
        </div>
      </div>
    </div>
  )
}
