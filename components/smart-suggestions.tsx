"use client"

import { useState, useEffect } from "react"
import { Lightbulb, TrendingUp, MapPin, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPopularDestinations } from "@/lib/cities-data"

interface SmartSuggestionsProps {
  isPro: boolean
  onSuggestionClick: (suggestion: string) => void
  userLocation?: string
}

export default function SmartSuggestions({ isPro, onSuggestionClick, userLocation = "Madrid" }: SmartSuggestionsProps) {
  const [currentSuggestions, setCurrentSuggestions] = useState<any[]>([])

  useEffect(() => {
    const generateSuggestions = () => {
      const hour = new Date().getHours()
      const isWeekend = [0, 6].includes(new Date().getDay())
      const popularDestinations = getPopularDestinations(userLocation)

      const suggestions = []

      // Time-based suggestions
      if (hour >= 9 && hour <= 17 && !isWeekend) {
        suggestions.push({
          icon: <Calendar className="h-3 w-3" />,
          title: "Book next week's trip",
          description: "Best rates Tue-Thu",
          query: "Find flights for next Tuesday to London",
          type: "business",
          priority: "high",
        })
      }

      // Location-based suggestions with real city data
      if (popularDestinations.length > 0) {
        const topDestination = popularDestinations[0]
        suggestions.push({
          icon: <MapPin className="h-3 w-3" />,
          title: `${userLocation} → ${topDestination.name}`,
          description: `From €${Math.round(topDestination.averageHotelPrice * 0.3)}`,
          query: `Find flights from ${userLocation} to ${topDestination.name}`,
          type: "travel",
          priority: "medium",
          image: topDestination.imageUrl,
        })
      }

      // Cost optimization for Pro users
      if (isPro) {
        suggestions.push({
          icon: <DollarSign className="h-3 w-3" />,
          title: "Cost optimization",
          description: "Save 15% next booking",
          query: "Analyze my travel spending and suggest optimizations",
          type: "pro",
          priority: "high",
        })
      }

      // Trending destinations
      suggestions.push({
        icon: <TrendingUp className="h-3 w-3" />,
        title: "Trending destinations",
        description: "Milan, Amsterdam, Zurich",
        query: "What are the trending business travel destinations this month?",
        type: "insights",
        priority: "low",
      })

      setCurrentSuggestions(suggestions.slice(0, isPro ? 3 : 2))
    }

    generateSuggestions()
    const interval = setInterval(generateSuggestions, 30000)

    return () => clearInterval(interval)
  }, [isPro, userLocation])

  if (currentSuggestions.length === 0) return null

  return (
    <Card className="bg-black/30 border-white/5">
      <CardContent className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="h-3 w-3 text-yellow-400" />
          <span className="text-white font-medium text-xs">Smart Suggestions</span>
          {isPro && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px] px-1 py-0">AI</Badge>
          )}
        </div>

        <div className="space-y-1.5">
          {currentSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => onSuggestionClick(suggestion.query)}
              className="w-full justify-start h-auto p-2 text-left hover:bg-white/5 rounded-lg"
            >
              <div className="flex items-start space-x-2 w-full">
                {suggestion.image ? (
                  <div
                    className="w-8 h-6 rounded bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${suggestion.image})` }}
                  />
                ) : (
                  <div className="text-gray-400 mt-0.5 flex-shrink-0">{suggestion.icon}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium truncate">{suggestion.title}</div>
                  <div className="text-gray-400 text-[10px] truncate">{suggestion.description}</div>
                </div>
                {suggestion.priority === "high" && (
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1 flex-shrink-0"></div>
                )}
              </div>
            </Button>
          ))}
        </div>

        {!isPro && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <div className="text-center">
              <p className="text-gray-400 text-[10px] mb-1">More personalized with Pro</p>
              <Badge className="bg-gray-200 text-black text-[10px] px-1 py-0">Upgrade</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
