"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  username: string
  name: string
  role: string
  avatar: string
  age?: number
  birthplace?: string
  email?: string
  phoneNumber?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("hms_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!isLoading && !user && pathname !== "/login") {
      router.push("/login")
    }
  }, [user, isLoading, router, pathname])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // In a real app, this would be an API call
    // For demo purposes, we're hardcoding the credentials
    if (username === "superadmin123" && password === "superadmin123") {
      const userData: User = {
        username: "superadmin123",
        name: "Dadaxanov Oqiljon",
        role: "Admin",
        avatar: "/placeholder.svg",
      }

      setUser(userData)
      localStorage.setItem("hms_user", JSON.stringify(userData))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) throw new Error("No user logged in")

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("hms_user", JSON.stringify(updatedUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hms_user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
