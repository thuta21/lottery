"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/admin/login-form"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { TicketManagement } from "@/components/admin/ticket-management"
import { DrawManagement } from "@/components/admin/draw-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Calendar, Users, TrendingUp } from "lucide-react"
import { getCurrentAdmin } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

interface DashboardStats {
  totalTickets: number
  totalDraws: number
  activeDraws: number
  totalAdmins: number
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    totalDraws: 0,
    activeDraws: 0,
    totalAdmins: 0
  })

  useEffect(() => {
    checkAuth()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user)
        fetchStats()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentAdmin()
      setUser(currentUser)
      if (currentUser) {
        fetchStats()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch tickets count
      const { count: ticketsCount } = await supabase
        .from('lottery_tickets')
        .select('*', { count: 'exact', head: true })

      // Fetch draws count
      const { count: drawsCount } = await supabase
        .from('lottery_draws')
        .select('*', { count: 'exact', head: true })

      // Fetch active draws count
      const { count: activeDrawsCount } = await supabase
        .from('lottery_draws')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      setStats({
        totalTickets: ticketsCount || 0,
        totalDraws: drawsCount || 0,
        activeDraws: activeDrawsCount || 0,
        totalAdmins: 1 // Since we're using Supabase auth, we can't easily count admins
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSignOut = () => {
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onSuccess={() => setUser(true)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userEmail={user.email} onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">{stats.totalTickets.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Draws</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{stats.totalDraws}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Active Draws</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{stats.activeDraws}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Admins</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{stats.totalAdmins}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tickets">Ticket Management</TabsTrigger>
            <TabsTrigger value="draws">Draw Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tickets">
            <TicketManagement />
          </TabsContent>
          
          <TabsContent value="draws">
            <DrawManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}