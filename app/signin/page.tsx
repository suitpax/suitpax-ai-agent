"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import MobileNavigation from "@/components/mobile-navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect would happen here
    }, 1500)
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
            <h1 className="text-sm text-white font-light tracking-wide">Sign in to your account</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-black border border-white/10 rounded-xl p-6 shadow-lg">
              <div className="mb-6 text-center">
                <h2 className="text-xl text-white font-medium">Welcome back</h2>
                <p className="text-xs text-white/70 font-light mt-1">Sign in to access your Suitpax account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-white/70">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    className="bg-black border-white/10 text-white text-xs h-9 focus:ring-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs text-white/70">
                      Password
                    </Label>
                    <Link href="#" className="text-[10px] text-white/70 hover:text-white">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-black border-white/10 text-white text-xs h-9 focus:ring-white/30"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                  />
                  <Label htmlFor="remember" className="text-[10px] text-white/70 font-light">
                    Remember me for 30 days
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-white/90 text-xs h-9"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                <div className="text-center">
                  <p className="text-[10px] text-white/70 font-light">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-white hover:underline">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
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
