"use client"

import { Trophy, Calendar, Ticket } from "lucide-react"
import { LanguageToggle } from "./language-toggle"
import { t, Language } from "@/lib/translations"

interface LotteryHeaderProps {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function LotteryHeader({ language, onLanguageChange }: LotteryHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-red-600 via-white to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600/80 p-3 rounded-full backdrop-blur-sm">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-red-800">{t('title', language)}</h1>
              <p className="text-red-600">{t('subtitle', language)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-red-600/80 px-4 py-2 rounded-full backdrop-blur-sm">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{t('nextDraw', language)}</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-600/80 px-4 py-2 rounded-full backdrop-blur-sm">
                <Ticket className="w-5 h-5" />
                <span className="font-medium">{t('availableTickets', language)}</span>
              </div>
            </div>
            <LanguageToggle 
              currentLang={language}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>
      </div>
    </header>
  )
}