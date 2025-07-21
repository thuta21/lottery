"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { LotteryHeader } from "@/components/lottery-header"
import { LotteryStats } from "@/components/lottery-stats"
import { TicketGrid } from "@/components/ticket-grid"
import { SearchFilter } from "@/components/search-filter"
import { PriceChecker } from "@/components/price-checker"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Language, t } from "@/lib/translations"

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
  created_at: string
  is_active: boolean
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('en')
  const [tickets, setTickets] = useState<LotteryTicket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<LotteryTicket[]>([])
  const [activeDraw, setActiveDraw] = useState<LotteryDraw | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch active draw
      const { data: drawData, error: drawError } = await supabase
        .from('lottery_draws')
        .select('*')
        .eq('is_active', true)
        .single()

      if (drawError && drawError.code !== 'PGRST116') {
        console.error('Error fetching draw:', drawError)
        setError('Failed to fetch lottery draw information')
        return
      }

      setActiveDraw(drawData)

      // Fetch tickets for active draw
      if (drawData) {
        const { data: ticketData, error: ticketError } = await supabase
          .from('lottery_tickets')
          .select('*')
          .eq('draw_id', drawData.id)
          .order('ticket_number', { ascending: true })

        if (ticketError) {
          console.error('Error fetching tickets:', ticketError)
          setError('Failed to fetch lottery tickets')
          return
        }

        setTickets(ticketData || [])
        setFilteredTickets(ticketData || [])
      } else {
        setTickets([])
        setFilteredTickets([])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTickets(tickets)
      return
    }

    const filtered = tickets.filter(ticket =>
      ticket.ticket_number.includes(query.replace(/\s/g, ''))
    )
    setFilteredTickets(filtered)
  }

  const handleFilter = (filters: { luckyOnly: boolean; lastDigit: string }) => {
    let filtered = [...tickets]

    if (filters.luckyOnly) {
      const luckyPatterns = ['888', '999', '777', '666', '123', '456', '789']
      filtered = filtered.filter(ticket =>
        luckyPatterns.some(pattern => ticket.ticket_number.includes(pattern))
      )
    }

    if (filters.lastDigit) {
      filtered = filtered.filter(ticket =>
        ticket.ticket_number.endsWith(filters.lastDigit)
      )
    }

    setFilteredTickets(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LotteryHeader language={language} onLanguageChange={setLanguage} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-600">{t('loading', language)}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LotteryHeader language={language} onLanguageChange={setLanguage} />
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LotteryHeader language={language} onLanguageChange={setLanguage} />
      
      <main className="container mx-auto px-4 py-8">
        <LotteryStats 
          totalTickets={tickets.length}
          activeDraw={activeDraw}
          language={language}
        />

        <div className="mb-8">
          <PriceChecker language={language} />
        </div>

        {tickets.length > 0 ? (
          <>
            <SearchFilter 
              onSearch={handleSearch}
              onFilter={handleFilter}
              language={language}
            />

            <div className="mb-4">
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                {t('availableTicketsTitle', language)}
              </h2>
              <p className="text-gray-600">
                {t('showingTickets', language, { 
                  filtered: filteredTickets.length.toString(), 
                  total: tickets.length.toString() 
                })}
              </p>
            </div>

            <TicketGrid tickets={filteredTickets} language={language} />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                {t('noTicketsAvailable', language)}
              </h3>
              <p className="text-gray-600">
                {activeDraw 
                  ? t('noTicketsMessage', language)
                  : t('noActiveDrawMessage', language)
                }
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-red-600 via-white to-blue-600 text-red-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-medium">
            {t('copyright', language)}
          </p>
          <p className="text-sm text-red-600 mt-2">
            {t('playResponsibly', language)}
          </p>
        </div>
      </footer>
    </div>
  )
}