"use client"

import { useState } from "react"
import { ExternalLink, Menu, Crown } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import ChatMessage from "./chat-message"
import MobileNavigation from "./mobile-navigation"
import DocumentUpload from "./document-upload"
import SubscriptionPlans from "./subscription-plans"
import { detectCityMention, getRelevantFlights } from "@/lib/anthropic"
import FlightBookingWidget from "./flight-booking-widget"
import { Button } from "@/components/ui/button"
import ChatForm from "./chat-form"
import ProFeaturesBanner from "./pro-features-banner"
import SmartSuggestions from "./smart-suggestions"
import QuickActions from "./quick-actions"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type AISection = "business" | "expenses" | "tasks" | "reporting" | "support"

export default function SuitpaxChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<AISection>("business")
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<"free" | "starter" | "business" | "enterprise">("free")
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showFlightWidget, setShowFlightWidget] = useState(false)
  const [widgetFlights, setWidgetFlights] = useState<any[]>([])
  const [widgetCity, setWidgetCity] = useState("")

  const isPro = currentPlan !== "free"

  async function handleSubmit(message: string) {
    if (!message) return

    // Detect city mention for flight widget
    const mentionedCity = detectCityMention(message)
    if (mentionedCity) {
      const relevantFlights = getRelevantFlights(mentionedCity)
      if (relevantFlights.length > 0) {
        setWidgetCity(mentionedCity)
        setWidgetFlights(relevantFlights)
        setShowFlightWidget(true)
      }
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      console.log("Sending message to API:", message)

      // Enhanced prompt for Pro users
      const enhancedMessage = isPro ? `[PRO USER - ${currentPlan.toUpperCase()}] ${message}` : message

      // Call the API route to get Anthropic response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: enhancedMessage,
          isPro,
          plan: currentPlan,
        }),
      })

      console.log("API response status:", response.status)

      // Parse response
      let data
      try {
        data = await response.json()
        console.log("API response data:", data)
      } catch (parseError) {
        console.error("Failed to parse response JSON:", parseError)
        throw new Error("Invalid response from server")
      }

      // Check if response is ok
      if (!response.ok) {
        console.error("API response error:", response.status, data)
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response || "I apologize, but I didn't receive a proper response.",
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Enhanced fallback response
      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `I apologize, but I'm having trouble connecting to my AI services right now. 

However, I can still help you with:
✈️ Flight information for popular routes
🏨 Hotel recommendations in major cities
💰 Basic expense tracking guidance

${!isPro ? "\n**Upgrade to Suitpax AI Pro for:**\n• Advanced AI capabilities\n• Document processing\n• Priority support\n• Unlimited features" : ""}

Please try asking about flights from Madrid to London, or hotels in your destination city!`,
      }

      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSectionChange = (section: AISection) => {
    setActiveSection(section)
    setMobileMenuOpen(false)

    // Add a welcome message for the new section
    const welcomeMessages: Record<AISection, string> = {
      business:
        "✈️ **Business Travel Assistant**\n\nI can help optimize your business travel arrangements. What trip are you planning?",
      expenses:
        "💰 **Expense Management**\n\nLet me help you manage your expenses efficiently. What would you like to do?",
      tasks:
        "📋 **Task Management**\n\nI'll help you stay organized with your travel-related tasks. What do you need to accomplish?",
      reporting:
        "📊 **Reporting & Analytics**\n\nI can generate insightful reports on your travel and expense data. What metrics are you interested in?",
      support:
        "🆘 **Travel Support**\n\nNeed assistance with your business travel or expenses? I'm here to help resolve any issues.",
    }

    setMessages([
      {
        id: `section-${Date.now()}`,
        role: "assistant",
        content: welcomeMessages[section],
      },
    ])
  }

  const handlePlanSelect = (planId: string) => {
    setCurrentPlan(planId as any)
    // Here you would integrate with payment processing
    console.log("Selected plan:", planId)
  }

  const handleDocumentProcessed = (documentData: any) => {
    console.log("Document processed:", documentData)
    // Add processed document to messages or handle as needed
  }

  const ExternalLinks = () => (
    <div className="flex items-center space-x-6">
      <a
        href="https://suitpax.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
      >
        <span className="mr-1 text-[10px] font-light">Website</span>
        <ExternalLink className="h-2.5 w-2.5" />
      </a>
      <a
        href="https://suitpax.com/upgrade"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
      >
        <span className="mr-1 text-[10px] font-light">Upgrade</span>
        <ExternalLink className="h-2.5 w-2.5" />
      </a>
    </div>
  )

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
            <Image src="/images/suitpax-logo.png" alt="Suitpax Logo" width={120} height={30} className="h-6 w-auto" />
            <h1 className="text-sm text-white font-light tracking-wide hidden sm:block">
              The next-gen of business travel & expense management
            </h1>
            {isPro && (
              <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-2 py-1 rounded-full border border-yellow-500/30">
                <Crown className="h-3 w-3 text-yellow-400" />
                <span className="text-yellow-400 text-xs font-medium">Pro</span>
              </div>
            )}
          </div>

          {/* Links and Upgrade Button */}
          <div className="flex items-center space-x-4">
            {!isMobile && <ExternalLinks />}
            {!isPro && (
              <Button
                onClick={() => setShowSubscriptionPlans(true)}
                size="sm"
                className="bg-gray-200 text-black hover:bg-gray-100 text-xs h-6 px-2"
              >
                <Crown className="h-2.5 w-2.5 mr-1" />
                Pro
              </Button>
            )}
          </div>
        </div>

        {/* Section indicator - mobile only */}
        {isMobile && (
          <div className="px-3 py-1 bg-black/50 border-b border-white/5">
            <p className="text-[10px] font-light text-white/70">
              <span className="text-white">Zia</span> • {getSectionDisplayName(activeSection)}
              {isPro && <span className="text-yellow-400 ml-2">• Pro Active</span>}
            </p>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-white text-2xl font-medium tracking-tight">
                  {isPro ? "Welcome to Suitpax AI Pro" : "Where would you like to travel today?"}
                </h2>
                <p className="text-white/70 text-sm">
                  {isPro
                    ? "Advanced AI, document processing, and unlimited features at your service"
                    : "Search for flights and hotels for your business travel"}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="w-full max-w-md">
                <QuickActions onActionClick={(query) => handleSubmit(query)} isPro={isPro} />
              </div>

              {/* Smart Suggestions */}
              <div className="w-full max-w-md">
                <SmartSuggestions
                  isPro={isPro}
                  onSuggestionClick={(query) => handleSubmit(query)}
                  userLocation="Madrid"
                />
              </div>

              {/* Pro Features Banner */}
              <div className="w-full max-w-md">
                <ProFeaturesBanner isPro={isPro} onUpgradeClick={() => setShowSubscriptionPlans(true)} />
              </div>

              {/* Document Upload for Pro Users */}
              {isPro && (
                <div className="w-full max-w-2xl">
                  <DocumentUpload onDocumentProcessed={handleDocumentProcessed} isPro={isPro} />
                </div>
              )}
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                <Image
                  src="/images/suitpax-avatar.png"
                  alt="Suitpax AI"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-cover"
                />
              </div>
              <div className="bg-black border border-white/10 p-2 rounded-xl max-w-[70%]">
                <div className="flex space-x-1.5">
                  <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
                  <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse delay-100"></div>
                  <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input field at bottom */}
        <div className="p-4 relative">
          <div className="absolute bottom-6 left-0 right-0 mx-4 rounded-xl overflow-hidden shadow-lg">
            <ChatForm isLoading={isLoading} onSubmit={(values) => handleSubmit(values.prompt)} />
            {showFlightWidget && (
              <FlightBookingWidget
                flights={widgetFlights}
                city={widgetCity}
                onClose={() => setShowFlightWidget(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isPro={isPro}
        onUpgradeClick={() => setShowSubscriptionPlans(true)}
      />

      {/* Subscription Plans Modal */}
      <SubscriptionPlans
        open={showSubscriptionPlans}
        onOpenChange={setShowSubscriptionPlans}
        currentPlan={currentPlan}
        onPlanSelect={handlePlanSelect}
      />
    </div>
  )
}

function getSectionDisplayName(section: AISection): string {
  switch (section) {
    case "business":
      return "Business Travel"
    case "expenses":
      return "Expense Management"
    case "tasks":
      return "Task Management"
    case "reporting":
      return "Reporting & Analytics"
    case "support":
      return "Support"
    default:
      return "Business Assistant"
  }
}
