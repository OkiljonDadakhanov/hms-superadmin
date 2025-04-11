"use client"

import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  // Extract the page title from the pathname
  const getPageTitle = () => {
    const path = pathname.split("/")[1]
    if (!path) return "Dashboard"
    return path.charAt(0).toUpperCase() + path.slice(1)
  }

  const handleAvatarClick = () => {
    router.push("/settings")
  }

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <h1 className="text-xl font-medium">{getPageTitle()}</h1>
      <div className="flex items-center space-x-4">
        <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        </button>
        <div className="flex items-center">
          <Avatar className="h-8 w-8 cursor-pointer" onClick={handleAvatarClick}>
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="User" />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500">{user?.role || "Guest"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
