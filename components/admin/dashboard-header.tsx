"use client"

import { Button } from "@/components/ui/button"
import { Shield, LogOut, User } from "lucide-react"
import { signOutAdmin } from "@/lib/auth"

interface DashboardHeaderProps {
  userEmail?: string
  onSignOut: () => void
}

export function DashboardHeader({ userEmail, onSignOut }: DashboardHeaderProps) {
  const handleSignOut = async () => {
    try {
      await signOutAdmin()
      onSignOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-gradient-to-r from-red-600 via-white to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600/80 p-2 rounded-full backdrop-blur-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-800">Admin Dashboard</h1>
              <p className="text-red-600">Thailand Lottery Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm">
              <User className="w-4 h-4 text-red-800" />
              <span className="text-red-800 text-sm">{userEmail}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-800 hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}