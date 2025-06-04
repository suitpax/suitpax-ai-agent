"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Menu,
  Search,
  Filter,
  MapPin,
  ArrowUpDown,
  Star,
  Wifi,
  Coffee,
  Car,
  Dumbbell,
  Waves,
  Building2,
  Heart,
  Share,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import MobileNavigation from "@/components/mobile-navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import { hotels } from "@/lib/travel-data"

type SortOption = "price" | "rating" | "name" | "distance"

export default function Hotels() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    city: "",
    checkin: "",
    checkout: "",
    guests: "1",
    rooms: "1",
  })
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: [0, 600],
    rating: 0,
    amenities: [] as string[],
    hotelType: "any",
  })
  const [sortBy, setSortBy] = useState<SortOption>("price")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const allAmenities = [
    "WiFi",
    "Gym",
    "Restaurant",
    "Bar",
    "Spa",
    "Pool",
    "Parking",
    "Business Center",
    "Room Service",
    "Concierge",
  ]

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = hotels

    // Basic filters
    if (searchFilters.city) {
      filtered = filtered.filter(
        (hotel) =>
          hotel.city.toLowerCase().includes(searchFilters.city.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchFilters.city.toLowerCase()),
      )
    }

    // Advanced filters
    filtered = filtered.filter(
      (hotel) =>
        hotel.pricePerNight >= advancedFilters.priceRange[0] && hotel.pricePerNight <= advancedFilters.priceRange[1],
    )

    if (advancedFilters.rating > 0) {
      filtered = filtered.filter((hotel) => hotel.rating >= advancedFilters.rating)
    }

    if (advancedFilters.amenities.length > 0) {
      filtered = filtered.filter((hotel) =>
        advancedFilters.amenities.every((amenity) =>
          hotel.amenities.some((hotelAmenity) => hotelAmenity.toLowerCase().includes(amenity.toLowerCase())),
        ),
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "price":
          comparison = a.pricePerNight - b.pricePerNight
          break
        case "rating":
          comparison = a.rating - b.rating
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "distance":
          // Mock distance sorting
          comparison = a.name.localeCompare(b.name)
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

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, any> = {
      wifi: Wifi,
      gym: Dumbbell,
      restaurant: Coffee,
      bar: Coffee,
      spa: Waves,
      pool: Waves,
      parking: Car,
      "business center": Building2,
    }

    const IconComponent = iconMap[amenity.toLowerCase()] || Building2
    return <IconComponent className="h-3 w-3" />
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
            <h1 className="text-sm text-white font-light tracking-wide">Hotel Search</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Sidebar Filters - Desktop */}
            {!isMobile && (
              <div className="w-80 border-r border-white/10 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3">Search Hotels</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-white/70">Destination</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                          placeholder="London, Madrid, Paris..."
                          value={searchFilters.city}
                          onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
                          className="bg-black border-white/10 text-white text-xs h-9 pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-white/70">Check-in</Label>
                        <Input
                          type="date"
                          value={searchFilters.checkin}
                          onChange={(e) => setSearchFilters({ ...searchFilters, checkin: e.target.value })}
                          className="bg-black border-white/10 text-white text-xs h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-white/70">Check-out</Label>
                        <Input
                          type="date"
                          value={searchFilters.checkout}
                          onChange={(e) => setSearchFilters({ ...searchFilters, checkout: e.target.value })}
                          className="bg-black border-white/10 text-white text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-white/70">Guests</Label>
                        <Select
                          value={searchFilters.guests}
                          onValueChange={(value) => setSearchFilters({ ...searchFilters, guests: value })}
                        >
                          <SelectTrigger className="bg-black border-white/10 text-white h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Guest</SelectItem>
                            <SelectItem value="2">2 Guests</SelectItem>
                            <SelectItem value="3">3 Guests</SelectItem>
                            <SelectItem value="4">4+ Guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-white/70">Rooms</Label>
                        <Select
                          value={searchFilters.rooms}
                          onValueChange={(value) => setSearchFilters({ ...searchFilters, rooms: value })}
                        >
                          <SelectTrigger className="bg-black border-white/10 text-white h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Room</SelectItem>
                            <SelectItem value="2">2 Rooms</SelectItem>
                            <SelectItem value="3">3 Rooms</SelectItem>
                            <SelectItem value="4">4+ Rooms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleSearch} className="w-full bg-white text-black hover:bg-white/90 text-xs h-9">
                      <Search className="h-4 w-4 mr-2" />
                      Search Hotels
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Filters</h3>

                  <div className="space-y-2">
                    <Label className="text-xs text-white/70">Price Range (EUR per night)</Label>
                    <Slider
                      value={advancedFilters.priceRange}
                      onValueChange={(value) => setAdvancedFilters({ ...advancedFilters, priceRange: value })}
                      max={600}
                      step={20}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-white/50">
                      <span>{advancedFilters.priceRange[0]} EUR</span>
                      <span>{advancedFilters.priceRange[1]} EUR</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-white/70">Minimum Rating</Label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() =>
                            setAdvancedFilters({
                              ...advancedFilters,
                              rating: rating === advancedFilters.rating ? 0 : rating,
                            })
                          }
                          className={`p-1 rounded ${rating <= advancedFilters.rating ? "text-yellow-400" : "text-white/30"}`}
                        >
                          <Star className="h-4 w-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-white/70">Amenities</Label>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {allAmenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity}
                            checked={advancedFilters.amenities.includes(amenity)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAdvancedFilters({
                                  ...advancedFilters,
                                  amenities: [...advancedFilters.amenities, amenity],
                                })
                              } else {
                                setAdvancedFilters({
                                  ...advancedFilters,
                                  amenities: advancedFilters.amenities.filter((a) => a !== amenity),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={amenity} className="text-xs text-white/70 flex items-center space-x-1">
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Mobile Search */}
              {isMobile && (
                <div className="bg-black border border-white/10 rounded-xl p-4 mb-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Destination"
                      value={searchFilters.city}
                      onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
                      className="bg-black border-white/10 text-white text-xs h-9"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        placeholder="Check-in"
                        value={searchFilters.checkin}
                        onChange={(e) => setSearchFilters({ ...searchFilters, checkin: e.target.value })}
                        className="bg-black border-white/10 text-white text-xs h-9"
                      />
                      <Input
                        type="date"
                        placeholder="Check-out"
                        value={searchFilters.checkout}
                        onChange={(e) => setSearchFilters({ ...searchFilters, checkout: e.target.value })}
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
                </div>
              )}

              {/* Results Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-medium">{filteredAndSortedHotels.length} hotels found</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-white/70 text-xs">Sort by:</span>
                  <div className="flex space-x-1">
                    {[
                      { key: "price", label: "Price" },
                      { key: "rating", label: "Rating" },
                      { key: "name", label: "Name" },
                    ].map((option) => (
                      <Button
                        key={option.key}
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort(option.key as SortOption)}
                        className={`text-xs h-7 ${sortBy === option.key ? "text-white" : "text-white/70"}`}
                      >
                        {option.label}
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {filteredAndSortedHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-black border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
                  >
                    <div className="flex">
                      {/* Hotel Image Placeholder */}
                      <div className="w-48 h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-white/30" />
                      </div>

                      {/* Hotel Info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-white font-medium text-lg">{hotel.name}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < Math.floor(hotel.rating) ? "text-yellow-400 fill-current" : "text-white/30"}`}
                                  />
                                ))}
                                <span className="text-white/70 text-xs ml-1">{hotel.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-white/70 text-sm mb-2">
                              <MapPin className="h-3 w-3" />
                              <span>{hotel.location}</span>
                            </div>
                            <p className="text-white/60 text-sm mb-3">{hotel.description}</p>

                            {/* Amenities */}
                            <div className="flex items-center space-x-3">
                              {hotel.amenities.slice(0, 4).map((amenity, index) => (
                                <div key={index} className="flex items-center space-x-1 text-white/50 text-xs">
                                  {getAmenityIcon(amenity)}
                                  <span>{amenity}</span>
                                </div>
                              ))}
                              {hotel.amenities.length > 4 && (
                                <span className="text-white/50 text-xs">+{hotel.amenities.length - 4} more</span>
                              )}
                            </div>
                          </div>

                          {/* Price and Actions */}
                          <div className="text-right ml-4">
                            <div className="mb-3">
                              <div className="text-white font-bold text-xl">
                                {hotel.pricePerNight} {hotel.currency}
                              </div>
                              <div className="text-white/70 text-xs">per night</div>
                            </div>

                            <div className="flex items-center space-x-2 mb-3">
                              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white p-1">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white p-1">
                                <Share className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full border-white/10 text-white text-xs">
                                View Details
                              </Button>
                              <Button size="sm" className="w-full bg-white text-black hover:bg-white/90 text-xs">
                                Book Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredAndSortedHotels.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-white/30 mx-auto mb-4" />
                    <div className="text-white/70 text-lg mb-2">No hotels found</div>
                    <div className="text-white/50 text-sm">Try adjusting your search criteria</div>
                  </div>
                )}
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
