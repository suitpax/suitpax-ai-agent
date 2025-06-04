"use client"

import type React from "react"
import Link from "next/link"
import { useEffect } from "react"
import {
  X,
  Briefcase,
  Receipt,
  CheckSquare,
  BarChart3,
  LifeBuoy,
  ExternalLink,
  Globe,
  LogIn,
  UserPlus,
  Plane,
  Building2,
  Crown,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { AISection } from "./suitpax-chat"
import { Button } from "@/components/ui/button"

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  activeSection: AISection
  onSectionChange: (section: AISection) => void
  isPro?: boolean
  onUpgradeClick?: () => void
}

export default function MobileNavigation({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
  isPro,
  onUpgradeClick,
}: MobileNavigationProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  if (!isOpen) return null

  const sections: Array<{ id: AISection; name: string; icon: React.ReactNode }> = [
    { id: "business", name: "Business Travel", icon: <Briefcase className="h-4 w-4" /> },
    { id: "expenses", name: "Expense Management", icon: <Receipt className="h-4 w-4" /> },
    { id: "tasks", name: "Task Management", icon: <CheckSquare className="h-4 w-4" /> },
    { id: "reporting", name: "Reporting", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "support", name: "Support", icon: <LifeBuoy className="h-4 w-4" /> },
  ]

  const handleUpgradeClick = () => {
    onClose()
    onUpgradeClick?.()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="h-full w-[80%] max-w-[280px] bg-black border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/suitpax-avatar.png"
              alt="Suitpax AI"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div>
              <h2 className="text-sm text-white font-medium">Zia</h2>
              <p className="text-[10px] text-white/70 font-light">The ultimate business travel AI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-2 py-1">
            <p className="text-[10px] text-white/50 uppercase font-light px-3 py-1">Travel Services</p>
            <nav className="space-y-0.5">
              <Link
                href="/flights"
                className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-left text-white/70 hover:bg-white/5 hover:text-white"
                onClick={onClose}
              >
                <span className="flex-shrink-0">
                  <Plane className="h-4 w-4" />
                </span>
                <span className="font-light text-xs">Flights</span>
              </Link>
              <Link
                href="/hotels"
                className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-left text-white/70 hover:bg-white/5 hover:text-white"
                onClick={onClose}
              >
                <span className="flex-shrink-0">
                  <Building2 className="h-4 w-4" />
                </span>
                <span className="font-light text-xs">Hotels</span>
              </Link>
            </nav>
          </div>

          <div className="px-2 py-1 mt-2">
            <p className="text-[10px] text-white/50 uppercase font-light px-3 py-1">AI Capabilities</p>
            <nav className="space-y-0.5">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={cn(
                    "w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-left",
                    activeSection === section.id
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span className="flex-shrink-0">{section.icon}</span>
                  <span className="font-light text-xs">{section.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="px-2 py-1 mt-2">
            <p className="text-[10px] text-white/50 uppercase font-light px-3 py-1">Account</p>
            <nav className="space-y-0.5">
              <Link
                href="/signin"
                className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-left text-white/70 hover:bg-white/5 hover:text-white"
                onClick={onClose}
              >
                <span className="flex-shrink-0">
                  <LogIn className="h-4 w-4" />
                </span>
                <span className="font-light text-xs">Sign in</span>
              </Link>
              <Link
                href="/register"
                className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-left text-white/70 hover:bg-white/5 hover:text-white"
                onClick={onClose}
              >
                <span className="flex-shrink-0">
                  <UserPlus className="h-4 w-4" />
                </span>
                <span className="font-light text-xs">Register</span>
              </Link>
            </nav>
          </div>

          <div className="px-2 py-1 mt-2">
            <p className="text-[10px] text-white/50 uppercase font-light px-3 py-1">Links</p>
            <nav className="space-y-0.5">
              <a
                href="https://suitpax.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-left text-white/70 hover:bg-white/5 hover:text-white"
              >
                <span className="flex-shrink-0">
                  <Globe className="h-4 w-4" />
                </span>
                <span className="font-light text-xs">Website</span>
                <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
              </a>
              <button
                onClick={handleUpgradeClick}
                className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-left text-white/70 hover:bg-white/5 hover:text-white"
              >
                <span className="flex-shrink-0">
                  <Crown className="h-4 w-4" />
                </span>
                <span className="font-light text-xs">Upgrade to Pro</span>
                <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
              </button>
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10">
          {/* Pro Upgrade Section */}
          {!isPro && (
            <div className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-white/5">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-1">
                  <Crown className="h-4 w-4 text-gray-300" />
                  <span className="text-white text-sm font-light">Upgrade to Pro</span>
                </div>
                <p className="text-gray-400 text-xs font-light">
                  Unlock document OCR, advanced AI, and unlimited features
                </p>
                <Button
                  onClick={handleUpgradeClick}
                  size="sm"
                  className="w-full bg-gray-200 text-black hover:bg-gray-100 text-xs h-7 font-light"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          )}

          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/suitpax-logo.png"
                  alt="Suitpax Logo"
                  width={80}
                  height={20}
                  className="h-4 w-auto"
                />
              </div>
              <p className="text-[10px] text-white/50 font-light">Enterprise v2.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
