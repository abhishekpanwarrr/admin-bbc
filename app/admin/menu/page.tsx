"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { authenticatedFetch } from "@/lib/auth"
import { AddMenuItemDialog } from "@/components/admin/add-menu-item-dialog"
import type { MenuItem } from "@/types/menu"

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const response = await authenticatedFetch("/api/v1/menu")
      if (!response.ok) throw new Error("Failed to fetch menu items")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await authenticatedFetch(`/api/v1/menu/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete item")

      setItems(items.filter((item) => item.id !== id))
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      })
    }
  }

  const handleAddItem = async (newItem: MenuItem) => {
    setItems([...items, newItem])
    setIsDialogOpen(false)
    toast({
      title: "Success",
      description: "Menu item added successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Items</h1>
          <p className="text-muted-foreground mt-2">Manage your restaurant's menu</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>Add Menu Item</Button>
      </div>

      <AddMenuItemDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onItemAdded={handleAddItem} />

      {loading ? (
        <p className="text-muted-foreground text-center py-8">Loading menu items...</p>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No menu items yet. Start by adding one!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="p-4 space-y-4">
              {item.image && (
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">${item.price}</span>
                  <span className="text-sm text-muted-foreground">{item.category}</span>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDeleteItem(item.id)}>
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
