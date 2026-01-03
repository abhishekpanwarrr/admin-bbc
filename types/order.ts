export interface OrderItem {
  menuItemId?: string
  name?: string
  quantity: number
  price?: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  totalPrice: number
  createdAt?: string
  updatedAt?: string
  notes?: string
}
