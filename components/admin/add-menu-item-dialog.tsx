"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { authenticatedFetch } from "@/lib/auth"
import { CloudinaryUploader } from "@/components/cloudinary-uploader"
import type { MenuItem } from "@/types/menu"

interface AddMenuItemDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onItemAdded: (item: MenuItem) => void
}

export function AddMenuItemDialog({ isOpen, onOpenChange, onItemAdded }: AddMenuItemDialogProps) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        price: Number.parseFloat(formData.price),
        image: imageUrl,
      }

      const response = await authenticatedFetch("/api/v1/menu", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to add menu item")

      const newItem = await response.json()
      onItemAdded(newItem)
      setFormData({ name: "", description: "", price: "", category: "" })
      setImageUrl("")
      onOpenChange(false)

      toast({
        title: "Success",
        description: "Menu item added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card p-8 rounded-lg max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-foreground">Add Menu Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Item Name</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Margherita Pizza"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item"
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Price</label>
            <Input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Pizza, Pasta, Salad"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Image</label>
            <CloudinaryUploader onUploadSuccess={setImageUrl} />
            {imageUrl && <p className="text-xs text-green-500">Image uploaded successfully</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
