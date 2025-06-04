"use client"

import { Plane, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Flight } from "@/lib/travel-data"

interface FlightBookingWidgetProps {
  flights: Flight[]
  city: string
  onClose: () => void
}

export default function FlightBookingWidget({ flights, city, onClose }: FlightBookingWidgetProps) {
  if (flights.length === 0) return null

  return (
    <div className="bg-black border border-white/10 rounded-xl p-4 space-y-3 mt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Plane className="h-4 w-4 text-white/70" />
          <span className="text-white font-medium text-sm">Flights for {city}</span>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white text-xs">
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {flights.slice(0, 2).map((flight) => (
          <div key={flight.id} className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-white text-xs font-medium">{flight.airline}</span>
                <span className="text-white/70 text-xs">{flight.flightNumber}</span>
              </div>
              <div className="text-white font-medium text-sm">
                {flight.price} {flight.currency}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-white text-xs font-medium">{flight.departure}</div>
                  <div className="text-white/70 text-[10px]">{flight.from.split("(")[0].trim()}</div>
                </div>

                <div className="flex items-center space-x-1 text-white/50">
                  <div className="w-4 h-px bg-white/30"></div>
                  <Clock className="h-2 w-2" />
                  <div className="text-[10px]">{flight.duration}</div>
                  <div className="w-4 h-px bg-white/30"></div>
                </div>

                <div className="text-center">
                  <div className="text-white text-xs font-medium">{flight.arrival}</div>
                  <div className="text-white/70 text-[10px]">{flight.to.split("(")[0].trim()}</div>
                </div>
              </div>

              <Button size="sm" className="bg-white text-black hover:bg-white/90 text-xs h-6 px-2">
                Book
              </Button>
            </div>
          </div>
        ))}
      </div>

      {flights.length > 2 && (
        <div className="text-center">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white text-xs">
            View all {flights.length} flights <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
