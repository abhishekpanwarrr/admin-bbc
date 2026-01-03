export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}
