"use client"

import { useState } from "react"
import { Sparkles, X, FileText, Mic, BarChart3, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProFeaturesBannerProps {
  isPro: boolean
  onUpgradeClick: () => void
  className?: string
}

export default function ProFeaturesBanner({ isPro, onUpgradeClick, className }: ProFeaturesBannerProps) {
  const [isVisible, setIsVisible] = useState(!isPro)

  if (isPro || !isVisible) return null

  const features = [
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Document OCR",
      description: "Auto-process receipts & invoices",
    },
    {
      icon: <Mic className="h-4 w-4" />,
      title: "Voice Commands",
      description: "Speak your travel requests",
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      title: "Advanced Analytics",
      description: "Travel insights & cost optimization",
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Priority Support",
      description: "24/7 dedicated assistance",
    },
  ]

  return (
    <Card className={cn("bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gray-700/50", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-gray-300" />
            <span className="text-white font-medium text-sm">Unlock Pro Features</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="text-gray-300 mt-0.5">{feature.icon}</div>
              <div>
                <div className="text-white text-xs font-medium">{feature.title}</div>
                <div className="text-gray-400 text-xs">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Starting at €20/month</div>
            <div className="text-gray-400 text-xs">7-day free trial</div>
          </div>
          <Button onClick={onUpgradeClick} size="sm" className="bg-gray-200 text-black hover:bg-gray-100 text-xs h-7">
            Try Free
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
