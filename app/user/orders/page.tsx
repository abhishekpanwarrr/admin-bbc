"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { authenticatedFetch } from "@/lib/auth"
import type { Order } from "@/types/order"

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await authenticatedFetch("/api/v1/orders/me")
      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-2">Track your order status</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-8">Loading orders...</p>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">You haven't placed any orders yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Order #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(order.createdAt || "").toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${order.totalPrice.toFixed(2)}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                      order.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : order.status === "cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : order.status === "ready"
                            ? "bg-blue-500/20 text-blue-400"
                            : order.status === "preparing"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex justify-between">
                      <span>{item.name || item.menuItemId}</span>
                      <span>x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
