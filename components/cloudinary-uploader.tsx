"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string) => void
}

export function CloudinaryUploader({ onUploadSuccess }: CloudinaryUploaderProps) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      )

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      onUploadSuccess(data.secure_url)

      toast({
        title: "Success",
        description: "Image uploaded to Cloudinary",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please check your Cloudinary configuration.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  )
}
