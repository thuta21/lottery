"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { Language } from "@/lib/translations"

interface LanguageToggleProps {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
}

export function LanguageToggle({ currentLang, onLanguageChange }: LanguageToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onLanguageChange(currentLang === 'en' ? 'th' : 'en')}
      className="flex items-center gap-2 text-white hover:bg-white/20"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">
        {currentLang === 'en' ? 'ไทย' : 'EN'}
      </span>
    </Button>
  )
}