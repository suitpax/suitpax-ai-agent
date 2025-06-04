"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, CreditCard, Plane, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DocumentUploadProps {
  onDocumentProcessed: (data: any) => void
  isPro: boolean
}

type DocumentType = "invoice" | "passport" | "boarding-pass" | "receipt"

interface ProcessedDocument {
  id: string
  type: DocumentType
  filename: string
  data: any
  confidence: number
  processed: boolean
}

export default function DocumentUpload({ onDocumentProcessed, isPro }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = async (files: File[]) => {
    if (!isPro) {
      alert("Document processing is available only for Suitpax AI Pro subscribers")
      return
    }

    setIsProcessing(true)

    for (const file of files) {
      // Simulate OCR processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const documentType = detectDocumentType(file.name)
      const processedData = await simulateOCR(file, documentType)

      const newDocument: ProcessedDocument = {
        id: `doc-${Date.now()}-${Math.random()}`,
        type: documentType,
        filename: file.name,
        data: processedData,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        processed: true,
      }

      setDocuments((prev) => [...prev, newDocument])
      onDocumentProcessed(newDocument)
    }

    setIsProcessing(false)
  }

  const detectDocumentType = (filename: string): DocumentType => {
    const lower = filename.toLowerCase()
    if (lower.includes("invoice") || lower.includes("factura")) return "invoice"
    if (lower.includes("passport") || lower.includes("pasaporte")) return "passport"
    if (lower.includes("boarding") || lower.includes("tarjeta")) return "boarding-pass"
    return "receipt"
  }

  const simulateOCR = async (file: File, type: DocumentType) => {
    // Simulate different OCR results based on document type
    switch (type) {
      case "invoice":
        return {
          vendor: "Hotel Ritz Madrid",
          amount: "€450.00",
          date: "2024-01-15",
          category: "Accommodation",
          taxAmount: "€94.50",
          description: "Business accommodation - 2 nights",
        }
      case "passport":
        return {
          name: "GARCÍA LÓPEZ, MARÍA",
          nationality: "ESP",
          passportNumber: "ABC123456",
          expiryDate: "2029-06-15",
          issueDate: "2019-06-15",
        }
      case "boarding-pass":
        return {
          airline: "Iberia",
          flight: "IB3170",
          from: "MAD",
          to: "LHR",
          date: "2024-01-20",
          seat: "14A",
          gate: "B12",
          departure: "14:20",
        }
      case "receipt":
        return {
          vendor: "Taxi Madrid",
          amount: "€25.50",
          date: "2024-01-15",
          category: "Transportation",
          description: "Airport transfer",
        }
    }
  }

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case "invoice":
        return <FileText className="h-5 w-5" />
      case "passport":
        return <FileText className="h-5 w-5" />
      case "boarding-pass":
        return <Plane className="h-5 w-5" />
      case "receipt":
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getDocumentColor = (type: DocumentType) => {
    switch (type) {
      case "invoice":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "passport":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "boarding-pass":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "receipt":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 transition-colors",
          dragActive ? "border-white bg-white/5" : "border-white/20",
          !isPro && "opacity-50 cursor-not-allowed",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleChange}
          className="hidden"
          disabled={!isPro}
        />

        <div className="text-center">
          <Upload className="h-8 w-8 text-white/50 mx-auto mb-3" />
          <h3 className="text-white font-medium mb-2">
            {isPro ? "Upload Travel Documents" : "Document Processing - Pro Feature"}
          </h3>
          <p className="text-white/70 text-sm mb-4">
            {isPro
              ? "Drag & drop or click to upload invoices, receipts, boarding passes, or passports"
              : "Upgrade to Suitpax AI Pro to unlock intelligent document processing"}
          </p>

          {isPro ? (
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black hover:bg-white/90"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </>
              )}
            </Button>
          ) : (
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
              Pro Feature - Upgrade Required
            </Badge>
          )}
        </div>
      </div>

      {/* Processed Documents */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium text-sm">Processed Documents</h4>
          {documents.map((doc) => (
            <Card key={doc.id} className="bg-black border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={cn("p-2 rounded-lg border", getDocumentColor(doc.type))}>
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm">{doc.filename}</span>
                        <Badge variant="outline" className="text-xs">
                          {doc.type.replace("-", " ")}
                        </Badge>
                        {doc.processed && (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            {Math.round(doc.confidence * 100)}% confidence
                          </Badge>
                        )}
                      </div>

                      {/* Document Data Preview */}
                      <div className="text-xs text-white/70 space-y-1">
                        {Object.entries(doc.data)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="capitalize w-20">{key}:</span>
                              <span className="text-white">{value as string}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(doc.id)}
                    className="text-white/50 hover:text-white p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
