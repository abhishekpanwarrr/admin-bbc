"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getCurrentUser, removeToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (user.role === "admin") {
          router.push("/admin/dashboard")
        }
        setUserName(user.name || user.email)
      } catch {
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    removeToken()
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/user/menu" className="text-xl font-bold text-primary">
              FoodHub
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/user/menu" className="text-sm text-foreground hover:text-primary transition">
                Menu
              </Link>
              <Link href="/user/orders" className="text-sm text-foreground hover:text-primary transition">
                My Orders
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Hi, {userName}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
