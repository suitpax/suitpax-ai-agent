"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowUp, Sparkles, Upload, Mic, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AutoResizeTextarea from "./auto-resize-textarea"
import { cn } from "@/lib/utils"

interface ProChatInputProps {
  onSubmit: (message: string, attachments?: File[]) => void
  isLoading: boolean
  isPro: boolean
  onUpgradeClick: () => void
}

export default function ProChatInput({ onSubmit, isLoading, isPro, onUpgradeClick }: ProChatInputProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() || attachments.length > 0) {
      onSubmit(message.trim(), attachments)
      setMessage("")
      setAttachments([])
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...files])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVoiceRecord = () => {
    if (!isPro) {
      onUpgradeClick()
      return
    }
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  return (
    <div className="space-y-3">
      {/* Pro Badge */}
      {isPro && (
        <div className="flex items-center justify-center">
          <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Suitpax AI Pro Active
          </Badge>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1">
              <span className="text-white text-xs truncate max-w-32">{file.name}</span>
              <button onClick={() => removeAttachment(index)} className="text-white/50 hover:text-white">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "relative bg-black border rounded-2xl overflow-hidden transition-all shadow-lg",
            isPro
              ? "border-gradient-to-r from-yellow-500/30 to-orange-500/30 ring-1 ring-yellow-500/20"
              : "border-white/10",
            isLoading && "pointer-events-none opacity-70",
          )}
        >
          <div className="px-4 py-3">
            <div className="flex items-end space-x-2">
              {/* Advanced Controls - Pro Only */}
              <div className="flex flex-col space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => (isPro ? fileInputRef.current?.click() : onUpgradeClick())}
                  className={cn(
                    "text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0",
                    !isPro && "opacity-50",
                  )}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceRecord}
                  className={cn(
                    "text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0",
                    !isPro && "opacity-50",
                    isRecording && "text-red-400",
                  )}
                  disabled={isLoading}
                >
                  <Mic className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => (isPro ? null : onUpgradeClick())}
                  className={cn(
                    "text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0",
                    !isPro && "opacity-50",
                  )}
                  disabled={isLoading}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* Text Input */}
              <AutoResizeTextarea
                placeholder={
                  isPro
                    ? "Ask Zia Pro anything about your business travel... (voice, documents, advanced AI)"
                    : "Ask Zia about business travel... (upgrade for advanced features)"
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder:text-gray-400 py-1 px-2 resize-none text-sm tracking-normal min-h-[40px]"
                disabled={isLoading}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className={cn(
                  "rounded-full h-10 w-10 p-0 flex items-center justify-center",
                  isPro
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black"
                    : "bg-white text-black hover:bg-white/90",
                )}
                disabled={isLoading || (!message.trim() && attachments.length === 0)}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Pro Features Hint */}
          {!isPro && (
            <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-t border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-xs font-medium">
                    Unlock Pro features: Document OCR, Voice input, Advanced AI
                  </span>
                </div>
                <Button
                  onClick={onUpgradeClick}
                  size="sm"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600 text-xs h-6"
                >
                  Upgrade
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Pro Features Showcase */}
      {isPro && (
        <div className="text-center">
          <p className="text-white/50 text-xs">
            Pro features active: Document processing • Voice commands • Advanced AI • Priority support
          </p>
        </div>
      )}
    </div>
  )
}
