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
import { Ticket, Plus, Edit, Trash2, Search, AlertCircle, Download } from "lucide-react"
import { supabase } from "@/lib/supabase"
import * as XLSX from 'xlsx'
import { DrawCheckerModal } from './draw-checker-modal'

interface LotteryTicket {
  id: string
  ticket_number: string
  draw_id: string
  created_at: string
  amount: number
  currency_type: string
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
  const [isDrawCheckerOpen, setIsDrawCheckerOpen] = useState(false)
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<LotteryTicket | null>(null)
  const [formData, setFormData] = useState({
    ticket_number: "",
    draw_id: "",
    amount: 1000,
    currency_type: "MMK"
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: drawsData, error: drawsError } = await supabase
        .from('lottery_draws')
        .select('*')
        .order('created_at', { ascending: false })

      if (drawsError) throw drawsError
      setDraws(drawsData || [])

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
          draw_id: formData.draw_id,
          amount: formData.amount,
          currency_type: formData.currency_type
        }])

      if (error) throw error
      
      setIsAddDialogOpen(false)
      setFormData({ ticket_number: "", draw_id: "", amount: 1000, currency_type: "MMK" })
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
          draw_id: formData.draw_id,
          amount: formData.amount,
          currency_type: formData.currency_type
        })
        .eq('id', editingTicket.id)

      if (error) throw error
      
      setIsEditDialogOpen(false)
      setEditingTicket(null)
      setFormData({ ticket_number: "", draw_id: "", amount: 1000, currency_type: "MMK" })
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
      draw_id: ticket.draw_id,
      amount: ticket.amount,
      currency_type: ticket.currency_type
    })
    setIsEditDialogOpen(true)
  }

  const getDrawTitle = (drawId: string) => {
    return draws.find(d => d.id === drawId)?.title || 'N/A'
  }

  const filteredTickets = tickets.filter(ticket => {
    const searchMatch = ticket.ticket_number.includes(searchQuery);
    const drawMatch = selectedDraw === 'all' || ticket.draw_id === selectedDraw;
    return searchMatch && drawMatch;
  });

  const handleExportExcel = () => {
    if (selectedDraw === 'all') {
      alert("Please select a specific draw to export.");
      return;
    }
    if (filteredTickets.length === 0) {
      alert("No tickets to export for the selected draw.");
      return;
    }

    const dataForSheet = filteredTickets.map(ticket => ({
        'Ticket Number': ticket.ticket_number,
        'Amount': ticket.amount,
        'Currency': ticket.currency_type,
        'Draw': getDrawTitle(ticket.draw_id),
        'Date Created': new Date(ticket.created_at).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');

    const drawTitle = getDrawTitle(selectedDraw).replace(/\s/g, '_');
    XLSX.writeFile(workbook, `lottery_tickets_${drawTitle}.xlsx`);
  }

  if (loading) return <div>Loading...</div>
  if (error) return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search tickets..."
                className="pl-8 sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedDraw} onValueChange={setSelectedDraw}>
              <SelectTrigger className="w-[180px]">
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
          </div>

          <Button onClick={handleExportExcel} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
          <Button 
            onClick={() => setIsDrawCheckerOpen(true)} 
            variant="secondary" 
            size="sm"
            disabled={selectedDraw === 'all' || filteredTickets.length === 0}
          >
            Check Winnings
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Ticket</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTicket} className="space-y-4">
                 <div>
                  <Label htmlFor="add_ticket_number">Ticket Number</Label>
                  <Input
                    id="add_ticket_number"
                    value={formData.ticket_number}
                    onChange={(e) => setFormData({...formData, ticket_number: e.target.value})}
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="add_amount">Amount</Label>
                  <Input
                    id="add_amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    placeholder="1000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="add_currency_type">Currency</Label>
                  <Select value={formData.currency_type} onValueChange={(value) => setFormData({...formData, currency_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MMK">MMK</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="THB">THB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add_draw_id">Draw</Label>
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
                <TableHead>Amount</TableHead>
                <TableHead>Currency</TableHead>
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
                    {new Intl.NumberFormat().format(ticket.amount)}
                  </TableCell>
                  <TableCell>
                    {ticket.currency_type}
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
                <Label htmlFor="edit_amount">Amount</Label>
                <Input
                  id="edit_amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                  placeholder="1000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_currency_type">Currency</Label>
                <Select value={formData.currency_type} onValueChange={(value) => setFormData({...formData, currency_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MMK">MMK</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="THB">THB</SelectItem>
                  </SelectContent>
                </Select>
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

      {selectedDraw !== 'all' && (
        <DrawCheckerModal 
          isOpen={isDrawCheckerOpen}
          onClose={() => setIsDrawCheckerOpen(false)}
          tickets={filteredTickets}
          drawTitle={getDrawTitle(selectedDraw)}
        />
      )}
    </Card>
  )
}