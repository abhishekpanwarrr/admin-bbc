"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, getToken } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken()
        if (!token) {
          setIsAuthenticated(false)
          setLoading(false)
          return
        }

        const userData = await getCurrentUser()
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { user, loading, isAuthenticated }
}
