"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ticket, Star } from "lucide-react"
import { t, Language } from "@/lib/translations"

interface TicketGridProps {
  tickets: Array<{
    id: string
    ticket_number: string
    draw_id: string
    created_at: string
  }>
  language: Language
}

export function TicketGrid({ tickets, language }: TicketGridProps) {
  const formatTicketNumber = (number: string) => {
    // Format ticket number with spaces for better readability
    return number.replace(/(\d{3})/g, '$1 ').trim()
  }

  const getTicketColor = (number: string) => {
    const lastDigit = parseInt(number.slice(-1))
    if (lastDigit === 0 || lastDigit === 5) return 'bg-gradient-to-br from-red-500 to-red-600'
    if (lastDigit === 1 || lastDigit === 6) return 'bg-gradient-to-br from-blue-500 to-blue-600'
    if (lastDigit === 2 || lastDigit === 7) return 'bg-gradient-to-br from-white to-gray-100 text-red-600'
    if (lastDigit === 3 || lastDigit === 8) return 'bg-gradient-to-br from-red-400 to-red-500'
    return 'bg-gradient-to-br from-red-400 to-red-500'
  }

  const isLuckyNumber = (number: string) => {
    const luckyPatterns = ['888', '999', '777', '666', '123', '456', '789']
    return luckyPatterns.some(pattern => number.includes(pattern))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-red-400"
        >
          <CardContent className="p-4">
            <div className={`${getTicketColor(ticket.ticket_number)} ${ticket.ticket_number.slice(-1) === '2' || ticket.ticket_number.slice(-1) === '7' ? 'text-red-600' : 'text-white'} p-4 rounded-lg mb-3 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>

              <div className="flex items-center justify-between mb-2">
                <Ticket className="w-5 h-5" />
                {isLuckyNumber(ticket.ticket_number) && (
                  <Star className="w-5 h-5 text-yellow-300" fill="currentColor" />
                )}
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold font-mono tracking-wider">
                  {formatTicketNumber(ticket.ticket_number)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {isLuckyNumber(ticket.ticket_number) && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
                  <Star className="w-3 h-3 mr-1" />
                  {t('luckyNumber', language)}
                </Badge>
              )}
              {/* Status badge */}
              <Badge className={"bg-green-100 text-green-800 border-green-300"}>
                {t('available', language)}
              </Badge>
              {/* Removed the 'Added:' label and date */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
