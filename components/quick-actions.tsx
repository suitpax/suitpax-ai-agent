"use client"

import { Plane, Building2, Receipt, BarChart3, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface QuickActionsProps {
  onActionClick: (action: string) => void
  isPro: boolean
}

export default function QuickActions({ onActionClick, isPro }: QuickActionsProps) {
  const actions = [
    {
      icon: <Plane className="h-4 w-4" />,
      title: "Find Flights",
      description: "Search & compare",
      query: "Find flights from Madrid to London",
      color: "text-blue-400",
    },
    {
      icon: <Building2 className="h-4 w-4" />,
      title: "Book Hotels",
      description: "Business stays",
      query: "Find business hotels in London",
      color: "text-green-400",
    },
    {
      icon: <Receipt className="h-4 w-4" />,
      title: "Track Expenses",
      description: "Manage receipts",
      query: "Help me track my travel expenses",
      color: "text-orange-400",
      pro: true,
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      title: "Analytics",
      description: "Travel insights",
      query: "Show me my travel analytics and spending patterns",
      color: "text-purple-400",
      pro: true,
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      title: "Plan Trip",
      description: "Full itinerary",
      query: "Help me plan a 3-day business trip to Paris",
      color: "text-pink-400",
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      title: "Destinations",
      description: "Business spots",
      query: "What are the best business travel destinations in Europe?",
      color: "text-cyan-400",
    },
  ]

  return (
    <Card className="bg-black/30 border-white/5">
      <CardContent className="p-3">
        <h3 className="text-white font-medium text-xs mb-2">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => onActionClick(action.query)}
              disabled={action.pro && !isPro}
              className="h-auto p-2 flex flex-col items-center space-y-1 hover:bg-white/5 disabled:opacity-50 rounded-lg"
            >
              <div className={action.color}>{action.icon}</div>
              <div className="text-center">
                <div className="text-white text-[10px] font-medium leading-tight">{action.title}</div>
                <div className="text-gray-400 text-[9px] leading-tight">{action.description}</div>
                {action.pro && !isPro && <div className="text-yellow-400 text-[9px] mt-0.5">Pro</div>}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
