"use client"

import type React from "react"
import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { Form as UIForm } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import AutoResizeTextarea from "./auto-resize-textarea"
import { formSchema } from "@/lib/form-schema"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface FormProps {
  isLoading: boolean
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
}

export default function ChatForm({ isLoading, onSubmit }: FormProps) {
  const [isFocused, setIsFocused] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  })

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (!isMobile && !e.shiftKey) {
        e.preventDefault()
        formRef.current?.requestSubmit()
      }
    }
  }

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values)
      form.reset({ prompt: "" })
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <UIForm {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleFormSubmit)} className="relative">
        <div
          className={cn(
            "relative bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all shadow-lg",
            isFocused ? "ring-1 ring-white/20" : "",
            isLoading && "pointer-events-none opacity-70",
          )}
        >
          <div className="px-4 py-3">
            <div className="flex items-end space-x-3">
              <AutoResizeTextarea
                placeholder="Ask Zia about business travel, expenses, or tasks..."
                className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder:text-gray-400 py-2 px-0 resize-none text-sm tracking-normal min-h-[24px]"
                {...form.register("prompt")}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />

              <Button
                type="submit"
                className="bg-white text-black hover:bg-gray-100 rounded-full h-8 w-8 p-0 flex items-center justify-center flex-shrink-0"
                disabled={isLoading || !form.watch("prompt")?.trim()}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </UIForm>
  )
}
