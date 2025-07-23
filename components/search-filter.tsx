"use client"

"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  useEffect(() => {
    onFilter({ luckyOnly, lastDigit })
  }, [luckyOnly, lastDigit, onFilter])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const clearFilters = () => {
    setLuckyOnly(false)
    setLastDigit("")
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
          <div className="mt-4 pt-4 border-t border-red-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="luckyOnly"
                  checked={luckyOnly}
                  onCheckedChange={(checked) => setLuckyOnly(Boolean(checked))}
                />
                <label
                  htmlFor="luckyOnly"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('luckyNumbersOnly', language)}
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="lastDigit" className="text-sm font-medium whitespace-nowrap">
                  {t('lastDigit', language)}
                </Label>
                <Select value={lastDigit} onValueChange={setLastDigit}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('any', language)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('any', language)}</SelectItem>
                    {Array.from({ length: 10 }, (_, i) => i).map(digit => (
                      <SelectItem key={digit} value={digit.toString()}>{digit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {(luckyOnly || lastDigit) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-red-600 hover:bg-red-100 justify-self-start md:justify-self-end"
                >
                  <X className="w-3 h-3" />
                  {t('clear', language)}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}