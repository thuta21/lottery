"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Ticket, Trophy, Clock } from "lucide-react"
import { t, Language } from "@/lib/translations"

interface LotteryStatsProps {
  totalTickets: number
  activeDraw: {
    title: string
    draw_date: string
  } | null
  language: Language
}

export function LotteryStats({ totalTickets, activeDraw, language }: LotteryStatsProps) {
  const formatDate = (dateString: string) => {
    const locale = language === 'th' ? 'th-TH' : 'en-US'
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">{t('totalTickets', language)}</p>
              <p className="text-3xl font-bold text-red-800">{totalTickets.toLocaleString()}</p>
            </div>
            <div className="bg-red-600 p-3 rounded-full">
              <Ticket className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-900 text-sm font-medium">{t('activeDraw', language)}</p>
              <p className="text-lg font-bold text-green-900">
                {activeDraw ? activeDraw.title : t('noActiveDraw', language)}
              </p>
            </div>
            <div className="bg-white p-3 rounded-full">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">{t('nextDrawDate', language)}</p>
              <p className="text-sm font-bold text-blue-800">
                {activeDraw ? formatDate(activeDraw.draw_date) : 'TBA'}
              </p>
            </div>
            <div className="bg-blue-600 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
