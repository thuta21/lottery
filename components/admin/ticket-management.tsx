"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Ticket, Plus, Edit, Trash2, Search, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface LotteryTicket {
  id: string
  ticket_number: string
  draw_id: string
  created_at: string
}

interface LotteryDraw {
  id: string
  title: string
  draw_date: string
  is_active: boolean
}

export function TicketManagement() {
  const [tickets, setTickets] = useState<LotteryTicket[]>([])
  const [draws, setDraws] = useState<LotteryDraw[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDraw, setSelectedDraw] = useState<string>("all")
  
  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<LotteryTicket | null>(null)
  const [formData, setFormData] = useState({
    ticket_number: "",
    draw_id: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch draws
      const { data: drawsData, error: drawsError } = await supabase
        .from('lottery_draws')
        .select('*')
        .order('created_at', { ascending: false })

      if (drawsError) throw drawsError
      setDraws(drawsData || [])

      // Fetch tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('lottery_tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (ticketsError) throw ticketsError
      setTickets(ticketsData || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('lottery_tickets')
        .insert([{
          ticket_number: formData.ticket_number,
          draw_id: formData.draw_id
        }])

      if (error) throw error
      
      setIsAddDialogOpen(false)
      setFormData({ ticket_number: "", draw_id: "" })
      fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEditTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTicket) return

    try {
      const { error } = await supabase
        .from('lottery_tickets')
        .update({
          ticket_number: formData.ticket_number,
          draw_id: formData.draw_id
        })
        .eq('id', editingTicket.id)

      if (error) throw error
      
      setIsEditDialogOpen(false)
      setEditingTicket(null)
      setFormData({ ticket_number: "", draw_id: "" })
      fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return

    try {
      const { error } = await supabase
        .from('lottery_tickets')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openEditDialog = (ticket: LotteryTicket) => {
    setEditingTicket(ticket)
    setFormData({
      ticket_number: ticket.ticket_number,
      draw_id: ticket.draw_id
    })
    setIsEditDialogOpen(true)
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticket_number.includes(searchQuery)
    const matchesDraw = selectedDraw === "all" || ticket.draw_id === selectedDraw
    return matchesSearch && matchesDraw
  })

  const getDrawTitle = (drawId: string) => {
    const draw = draws.find(d => d.id === drawId)
    return draw ? draw.title : 'Unknown Draw'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading tickets...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          Ticket Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search ticket numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedDraw} onValueChange={setSelectedDraw}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by draw" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Draws</SelectItem>
              {draws.map((draw) => (
                <SelectItem key={draw.id} value={draw.id}>
                  {draw.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Ticket</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTicket} className="space-y-4">
                <div>
                  <Label htmlFor="ticket_number">Ticket Number</Label>
                  <Input
                    id="ticket_number"
                    value={formData.ticket_number}
                    onChange={(e) => setFormData({...formData, ticket_number: e.target.value})}
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="draw_id">Draw</Label>
                  <Select value={formData.draw_id} onValueChange={(value) => setFormData({...formData, draw_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a draw" />
                    </SelectTrigger>
                    <SelectContent>
                      {draws.map((draw) => (
                        <SelectItem key={draw.id} value={draw.id}>
                          {draw.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Add Ticket
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket Number</TableHead>
                <TableHead>Draw</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono font-bold">
                    {ticket.ticket_number.replace(/(\d{3})/g, '$1 ').trim()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getDrawTitle(ticket.draw_id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(ticket)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Ticket</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditTicket} className="space-y-4">
              <div>
                <Label htmlFor="edit_ticket_number">Ticket Number</Label>
                <Input
                  id="edit_ticket_number"
                  value={formData.ticket_number}
                  onChange={(e) => setFormData({...formData, ticket_number: e.target.value})}
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_draw_id">Draw</Label>
                <Select value={formData.draw_id} onValueChange={(value) => setFormData({...formData, draw_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a draw" />
                  </SelectTrigger>
                  <SelectContent>
                    {draws.map((draw) => (
                      <SelectItem key={draw.id} value={draw.id}>
                        {draw.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Update Ticket
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}