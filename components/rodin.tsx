"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import type { FormValues } from "@/lib/form-schema"
import Form from "./form"
import OptionsDialog from "./options-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Rodin() {
  const [isLoading, setIsLoading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [options, setOptions] = useState({
    condition_mode: "concat" as const,
    quality: "medium" as const,
    geometry_file_format: "glb" as const,
    use_hyper: false,
    tier: "Regular" as const,
    TAPose: false,
    material: "PBR" as const,
  })

  const handleOptionsChange = (newOptions: any) => {
    setOptions(newOptions)
  }

  async function handleSubmit(values: FormValues) {
    setIsLoading(true)

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store the prompt and images for display
      setGeneratedPrompt(values.prompt || "")

      if (values.images && values.images.length > 0) {
        const imageUrls = Array.from(values.images).map((image) => URL.createObjectURL(image))
        setUploadedImages(imageUrls)
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error in form submission:", error)
      setIsLoading(false)
    }
  }

  const ExternalLinks = () => (
    <div className="flex items-center space-x-6">
      <a
        href="https://hyper3d.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
      >
        <span className="mr-1">Website</span>
        <ExternalLink className="h-4 w-4" />
      </a>
      <a
        href="https://developer.hyper3d.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
      >
        <span className="mr-1">API Docs</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  )

  return (
    <div className="relative h-[100dvh] w-full">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-black bg-radial-gradient">
        {/* Display uploaded images in a grid if available */}
        {uploadedImages.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 max-w-3xl">
              {uploadedImages.map((url, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg border border-white/20">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display generated prompt if available */}
        {generatedPrompt && (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg max-w-lg">
              <h3 className="text-white text-xl mb-2">Generated Prompt:</h3>
              <p className="text-gray-300">{generatedPrompt}</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Logo in top left */}
        <div className="absolute top-6 left-6 pointer-events-auto">
          <h1 className="text-3xl text-white font-normal tracking-normal">3D Model Generator</h1>
          <p className="text-gray-400 text-sm mt-1 tracking-normal">Powered by Hyper3D Rodin</p>
        </div>

        {/* Links in top right - desktop only */}
        {!isMobile && (
          <div className="absolute top-6 right-6 pointer-events-auto">
            <ExternalLinks />
          </div>
        )}

        {/* Input field at bottom */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 sm:px-0 pointer-events-auto">
          <Form isLoading={isLoading} onSubmit={handleSubmit} onOpenOptions={() => setShowOptions(true)} />

          {/* Links below prompt on mobile */}
          {isMobile && (
            <div className="mt-4 flex justify-center pointer-events-auto">
              <ExternalLinks />
            </div>
          )}
        </div>
      </div>

      {/* Options Dialog/Drawer */}
      <OptionsDialog
        open={showOptions}
        onOpenChange={setShowOptions}
        options={options}
        onOptionsChange={handleOptionsChange}
      />
    </div>
  )
}
