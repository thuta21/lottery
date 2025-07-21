"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface LotteryDraw {
  id: string
  title: string
  draw_date: string
  created_at: string
  is_active: boolean
}

export function DrawManagement() {
  const [draws, setDraws] = useState<LotteryDraw[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDraw, setEditingDraw] = useState<LotteryDraw | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    draw_date: "",
    is_active: false
  })

  useEffect(() => {
    fetchDraws()
  }, [])

  const fetchDraws = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('lottery_draws')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDraws(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDraw = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('lottery_draws')
        .insert([{
          title: formData.title,
          draw_date: formData.draw_date,
          is_active: formData.is_active
        }])

      if (error) throw error
      
      setIsAddDialogOpen(false)
      setFormData({ title: "", draw_date: "", is_active: false })
      fetchDraws()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEditDraw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDraw) return

    try {
      const { error } = await supabase
        .from('lottery_draws')
        .update({
          title: formData.title,
          draw_date: formData.draw_date,
          is_active: formData.is_active
        })
        .eq('id', editingDraw.id)

      if (error) throw error
      
      setIsEditDialogOpen(false)
      setEditingDraw(null)
      setFormData({ title: "", draw_date: "", is_active: false })
      fetchDraws()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteDraw = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draw? This will also delete all associated tickets.')) return

    try {
      const { error } = await supabase
        .from('lottery_draws')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchDraws()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const toggleDrawStatus = async (draw: LotteryDraw) => {
    try {
      const { error } = await supabase
        .from('lottery_draws')
        .update({ is_active: !draw.is_active })
        .eq('id', draw.id)

      if (error) throw error
      fetchDraws()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openEditDialog = (draw: LotteryDraw) => {
    setEditingDraw(draw)
    setFormData({
      title: draw.title,
      draw_date: draw.draw_date.split('T')[0], // Format for date input
      is_active: draw.is_active
    })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading draws...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Draw Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Draw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Draw</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDraw} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="January 2025 Draw"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="draw_date">Draw Date</Label>
                  <Input
                    id="draw_date"
                    type="datetime-local"
                    value={formData.draw_date}
                    onChange={(e) => setFormData({...formData, draw_date: e.target.value})}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Active Draw</Label>
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Add Draw
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Draw Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draws.map((draw) => (
                <TableRow key={draw.id}>
                  <TableCell className="font-medium">{draw.title}</TableCell>
                  <TableCell>
                    {new Date(draw.draw_date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={draw.is_active ? "default" : "secondary"}>
                      {draw.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(draw.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDrawStatus(draw)}
                        className={draw.is_active ? "text-red-600" : "text-green-600"}
                      >
                        {draw.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(draw)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDraw(draw.id)}
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
              <DialogTitle>Edit Draw</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditDraw} className="space-y-4">
              <div>
                <Label htmlFor="edit_title">Title</Label>
                <Input
                  id="edit_title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="January 2025 Draw"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_draw_date">Draw Date</Label>
                <Input
                  id="edit_draw_date"
                  type="datetime-local"
                  value={formData.draw_date}
                  onChange={(e) => setFormData({...formData, draw_date: e.target.value})}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit_is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="edit_is_active">Active Draw</Label>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Update Draw
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}