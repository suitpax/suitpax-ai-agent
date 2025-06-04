"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Menu, Search, Filter, MapPin, Clock, Plane, Wifi, Coffee, Briefcase, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import MobileNavigation from "@/components/mobile-navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import { flights } from "@/lib/travel-data"

type SortOption = "price" | "duration" | "departure" | "airline"

export default function Flights() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    from: "",
    to: "",
    departure: "",
    return: "",
    passengers: "1",
    class: "economy",
    tripType: "roundtrip",
  })
  const [advancedFilters, setAdvancedFilters] = useState({
    airlines: [] as string[],
    priceRange: [0, 500],
    stops: "any",
    departureTime: "any",
    duration: [0, 10],
  })
  const [sortBy, setSortBy] = useState<SortOption>("price")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const airlines = Array.from(new Set(flights.map((f) => f.airline)))

  const filteredAndSortedFlights = useMemo(() => {
    let filtered = flights

    // Basic filters
    if (searchFilters.from) {
      filtered = filtered.filter((flight) => flight.from.toLowerCase().includes(searchFilters.from.toLowerCase()))
    }

    if (searchFilters.to) {
      filtered = filtered.filter((flight) => flight.to.toLowerCase().includes(searchFilters.to.toLowerCase()))
    }

    // Advanced filters
    if (advancedFilters.airlines.length > 0) {
      filtered = filtered.filter((flight) => advancedFilters.airlines.includes(flight.airline))
    }

    filtered = filtered.filter(
      (flight) => flight.price >= advancedFilters.priceRange[0] && flight.price <= advancedFilters.priceRange[1],
    )

    if (advancedFilters.stops !== "any") {
      const maxStops = advancedFilters.stops === "direct" ? 0 : 1
      filtered = filtered.filter((flight) => flight.stops <= maxStops)
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "price":
          comparison = a.price - b.price
          break
        case "duration":
          comparison = Number.parseInt(a.duration) - Number.parseInt(b.duration)
          break
        case "departure":
          comparison = a.departure.localeCompare(b.departure)
          break
        case "airline":
          comparison = a.airline.localeCompare(b.airline)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [searchFilters, advancedFilters, sortBy, sortOrder])

  const handleSearch = () => {
    // Search is handled by the useMemo hook
  }

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(option)
      setSortOrder("asc")
    }
  }

  return (
    <div className="relative h-[100dvh] w-full">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-black bg-radial-gradient"></div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-white/10">
          <div className="flex items-center space-x-3">
            {isMobile && (
              <button onClick={() => setMobileMenuOpen(true)} className="text-white p-1 rounded-md hover:bg-white/10">
                <Menu className="h-4 w-4" />
              </button>
            )}
            <Link href="/" className="text-white p-1 rounded-md hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Image src="/images/suitpax-logo.png" alt="Suitpax Logo" width={120} height={30} className="h-6 w-auto" />
            <h1 className="text-sm text-white font-light tracking-wide">Flight Search</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Sidebar Filters - Desktop */}
            {!isMobile && (
              <div className="w-80 border-r border-white/10 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3">Search Flights</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={searchFilters.tripType === "roundtrip" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSearchFilters({ ...searchFilters, tripType: "roundtrip" })}
                        className="text-xs"
                      >
                        Round Trip
                      </Button>
                      <Button
                        variant={searchFilters.tripType === "oneway" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSearchFilters({ ...searchFilters, tripType: "oneway" })}
                        className="text-xs"
                      >
                        One Way
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-white/70">From</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                          placeholder="Madrid"
                          value={searchFilters.from}
                          onChange={(e) => setSearchFilters({ ...searchFilters, from: e.target.value })}
                          className="bg-black border-white/10 text-white text-xs h-9 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-white/70">To</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                          placeholder="London"
                          value={searchFilters.to}
                          onChange={(e) => setSearchFilters({ ...searchFilters, to: e.target.value })}
                          className="bg-black border-white/10 text-white text-xs h-9 pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-white/70">Departure</Label>
                        <Input
                          type="date"
                          value={searchFilters.departure}
                          onChange={(e) => setSearchFilters({ ...searchFilters, departure: e.target.value })}
                          className="bg-black border-white/10 text-white text-xs h-9"
                        />
                      </div>
                      {searchFilters.tripType === "roundtrip" && (
                        <div className="space-y-2">
                          <Label className="text-xs text-white/70">Return</Label>
                          <Input
                            type="date"
                            value={searchFilters.return}
                            onChange={(e) => setSearchFilters({ ...searchFilters, return: e.target.value })}
                            className="bg-black border-white/10 text-white text-xs h-9"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-white/70">Passengers</Label>
                        <Select
                          value={searchFilters.passengers}
                          onValueChange={(value) => setSearchFilters({ ...searchFilters, passengers: value })}
                        >
                          <SelectTrigger className="bg-black border-white/10 text-white h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Passenger</SelectItem>
                            <SelectItem value="2">2 Passengers</SelectItem>
                            <SelectItem value="3">3 Passengers</SelectItem>
                            <SelectItem value="4">4+ Passengers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-white/70">Class</Label>
                        <Select
                          value={searchFilters.class}
                          onValueChange={(value) => setSearchFilters({ ...searchFilters, class: value })}
                        >
                          <SelectTrigger className="bg-black border-white/10 text-white h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="premium">Premium Economy</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="first">First Class</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleSearch} className="w-full bg-white text-black hover:bg-white/90 text-xs h-9">
                      <Search className="h-4 w-4 mr-2" />
                      Search Flights
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Filters</h3>

                  <div className="space-y-2">
                    <Label className="text-xs text-white/70">Price Range (EUR)</Label>
                    <Slider
                      value={advancedFilters.priceRange}
                      onValueChange={(value) => setAdvancedFilters({ ...advancedFilters, priceRange: value })}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-white/50">
                      <span>{advancedFilters.priceRange[0]} EUR</span>
                      <span>{advancedFilters.priceRange[1]} EUR</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-white/70">Airlines</Label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {airlines.map((airline) => (
                        <div key={airline} className="flex items-center space-x-2">
                          <Checkbox
                            id={airline}
                            checked={advancedFilters.airlines.includes(airline)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAdvancedFilters({
                                  ...advancedFilters,
                                  airlines: [...advancedFilters.airlines, airline],
                                })
                              } else {
                                setAdvancedFilters({
                                  ...advancedFilters,
                                  airlines: advancedFilters.airlines.filter((a) => a !== airline),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={airline} className="text-xs text-white/70">
                            {airline}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-white/70">Stops</Label>
                    <Select
                      value={advancedFilters.stops}
                      onValueChange={(value) => setAdvancedFilters({ ...advancedFilters, stops: value })}
                    >
                      <SelectTrigger className="bg-black border-white/10 text-white h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="direct">Direct only</SelectItem>
                        <SelectItem value="1stop">1 stop max</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Mobile Search */}
              {isMobile && (
                <div className="bg-black border border-white/10 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Input
                      placeholder="From"
                      value={searchFilters.from}
                      onChange={(e) => setSearchFilters({ ...searchFilters, from: e.target.value })}
                      className="bg-black border-white/10 text-white text-xs h-9"
                    />
                    <Input
                      placeholder="To"
                      value={searchFilters.to}
                      onChange={(e) => setSearchFilters({ ...searchFilters, to: e.target.value })}
                      className="bg-black border-white/10 text-white text-xs h-9"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSearch} className="flex-1 bg-white text-black text-xs h-9">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="border-white/10 text-white h-9"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Flight Example */}
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-white text-2xl font-medium mb-2">Featured Flight</h2>
                  <p className="text-white/70 text-sm">Premium business travel option</p>
                </div>

                {/* Featured Flight Card */}
                <div className="bg-gradient-to-r from-black via-gray-900 to-black border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                        <Plane className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xl">British Airways</div>
                        <div className="text-white/70 text-sm">BA 456 • Airbus A320 • Premium Economy</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-3xl">245 EUR</div>
                      <div className="text-green-400 text-sm font-medium">✓ Direct Flight</div>
                    </div>
                  </div>

                  {/* Flight Route */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <div className="text-white font-bold text-2xl mb-1">08:30</div>
                        <div className="text-white/90 font-medium">Madrid</div>
                        <div className="text-white/60 text-sm">MAD • Barajas</div>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center space-x-3 text-white/70">
                          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                          <div className="text-center">
                            <Clock className="h-4 w-4 mx-auto mb-1" />
                            <div className="text-xs font-medium">2h 45m</div>
                          </div>
                          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                        </div>
                      </div>

                      <div className="text-center flex-1">
                        <div className="text-white font-bold text-2xl mb-1">10:15</div>
                        <div className="text-white/90 font-medium">London</div>
                        <div className="text-white/60 text-sm">LHR • Heathrow</div>
                      </div>
                    </div>
                  </div>

                  {/* Flight Features */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Wifi className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                      <div className="text-white text-xs font-medium">Free WiFi</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Coffee className="h-5 w-5 text-orange-400 mx-auto mb-2" />
                      <div className="text-white text-xs font-medium">Meal Included</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Briefcase className="h-5 w-5 text-green-400 mx-auto mb-2" />
                      <div className="text-white text-xs font-medium">Carry-on</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Star className="h-5 w-5 text-yellow-400 mx-auto mb-2" />
                      <div className="text-white text-xs font-medium">Priority</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                      View Details
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium">
                      Select Flight
                    </Button>
                  </div>
                </div>

                {/* Booking Widget */}
                <div className="bg-black border border-white/10 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-xl font-bold">Complete Your Booking</h3>
                    <div className="text-white/70 text-sm">Step 1 of 3</div>
                  </div>

                  {/* Passenger Information */}
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-4 flex items-center">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                          1
                        </div>
                        Passenger Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-white/70">First Name</Label>
                          <Input placeholder="John" className="bg-black border-white/10 text-white text-sm h-10" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-white/70">Last Name</Label>
                          <Input placeholder="Doe" className="bg-black border-white/10 text-white text-sm h-10" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-white/70">Email</Label>
                          <Input
                            type="email"
                            placeholder="john.doe@company.com"
                            className="bg-black border-white/10 text-white text-sm h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-white/70">Phone</Label>
                          <Input
                            placeholder="+34 600 000 000"
                            className="bg-black border-white/10 text-white text-sm h-10"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Seat Selection */}
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-4 flex items-center">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                          2
                        </div>
                        Seat Selection
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {["14A", "14B", "14C"].map((seat) => (
                          <Button
                            key={seat}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-blue-600 hover:border-blue-600 h-12"
                          >
                            {seat}
                          </Button>
                        ))}
                      </div>
                      <p className="text-white/60 text-xs mt-2">Window and aisle seats available</p>
                    </div>

                    {/* Extras */}
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-4 flex items-center">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                          3
                        </div>
                        Add Extras
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Briefcase className="h-5 w-5 text-white/70" />
                            <div>
                              <div className="text-white text-sm font-medium">Extra Baggage</div>
                              <div className="text-white/60 text-xs">Additional 23kg checked bag</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-white font-medium">+35 EUR</span>
                            <Checkbox className="border-white/30" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Coffee className="h-5 w-5 text-white/70" />
                            <div>
                              <div className="text-white text-sm font-medium">Premium Meal</div>
                              <div className="text-white/60 text-xs">Upgrade to business class meal</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-white font-medium">+15 EUR</span>
                            <Checkbox className="border-white/30" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-3">Price Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-white/70 text-sm">
                          <span>Flight (1 passenger)</span>
                          <span>245 EUR</span>
                        </div>
                        <div className="flex justify-between text-white/70 text-sm">
                          <span>Taxes & Fees</span>
                          <span>45 EUR</span>
                        </div>
                        <div className="border-t border-white/20 pt-2 mt-2">
                          <div className="flex justify-between text-white font-bold text-lg">
                            <span>Total</span>
                            <span>290 EUR</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book Button */}
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg h-12">
                      Complete Booking
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection="business"
        onSectionChange={() => {}}
      />
    </div>
  )
}
