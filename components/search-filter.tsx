"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import { t, Language } from "@/lib/translations"

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: { luckyOnly: boolean; lastDigit: string }) => void
  language: Language
}

export function SearchFilter({ onSearch, onFilter, language }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [luckyOnly, setLuckyOnly] = useState(false)
  const [lastDigit, setLastDigit] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const handleFilterChange = () => {
    onFilter({ luckyOnly, lastDigit })
  }

  const clearFilters = () => {
    setLuckyOnly(false)
    setLastDigit("")
    onFilter({ luckyOnly: false, lastDigit: "" })
  }

  return (
    <Card className="mb-6 border-red-200">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('searchPlaceholder', language)}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Filter className="w-4 h-4" />
            {t('filters', language)}
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="luckyOnly"
                  checked={luckyOnly}
                  onChange={(e) => {
                    setLuckyOnly(e.target.checked)
                    setTimeout(handleFilterChange, 0)
                  }}
                  className="rounded"
                />
                <label htmlFor="luckyOnly" className="text-sm font-medium">
                  {t('luckyNumbersOnly', language)}
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <label htmlFor="lastDigit" className="text-sm font-medium">
                  {t('lastDigit', language)}
                </label>
                <select
                  id="lastDigit"
                  value={lastDigit}
                  onChange={(e) => {
                    setLastDigit(e.target.value)
                    setTimeout(handleFilterChange, 0)
                  }}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="">{t('any', language)}</option>
                  {[0,1,2,3,4,5,6,7,8,9].map(digit => (
                    <option key={digit} value={digit.toString()}>{digit}</option>
                  ))}
                </select>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1 text-red-600 hover:bg-red-100"
              >
                <X className="w-3 h-3" />
                {t('clear', language)}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}