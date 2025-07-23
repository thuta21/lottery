"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trophy, DollarSign, CheckCircle, XCircle } from "lucide-react"
import { checkLotteryPrice, PriceCheckResult, getDrawHistory, DrawListItem } from "@/lib/lottery-api";
import { formatThaiCurrency } from "@/lib/utils";
import { t, Language } from "@/lib/translations"
import { useMemo } from "react"

interface PriceCheckerProps {
  language: Language
}

function formatApiDateToEnglish(dateStr?: string): string {
  if (!dateStr) return "-";
  // Try to parse Thai month names and Buddhist year
  // Example input: '16 กรกฎาคม 2568'
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const engMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    const [day, thaiMonth, buddhistYear] = parts;
    const monthIdx = thaiMonths.indexOf(thaiMonth);
    const engMonth = monthIdx !== -1 ? engMonths[monthIdx] : thaiMonth;
    // Convert Buddhist year to Gregorian year
    const year = parseInt(buddhistYear, 10) - 543;
    return `${day}/${engMonth}/${year}`;
  }
  return dateStr || "";
}

export function PriceChecker({ language }: PriceCheckerProps) {
  const [historicalDraws, setHistoricalDraws] = useState<DrawListItem[]>([]);
  const [selectedDrawId, setSelectedDrawId] = useState<string>("");
  const [ticketNumber, setTicketNumber] = useState("")
  const [result, setResult] = useState<PriceCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      const draws = await getDrawHistory(1);
      setHistoricalDraws(draws);
      if (draws.length > 0) {
        setSelectedDrawId(draws[0].id);
      }
    };
    fetchHistory();
  }, []);

  const handleCheck = async () => {
    if (!ticketNumber || ticketNumber.length !== 6) {
      setError(t('invalidTicketNumber', language))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const priceResult = await checkLotteryPrice(ticketNumber, selectedDrawId === 'latest' ? undefined : selectedDrawId)
      if (priceResult.error) {
        setError(priceResult.error)
        setResult(null)
      } else {
        setResult(priceResult)
      }
    } catch (err) {
      setError(t('checkFailed', language))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6)
    setTicketNumber(cleaned)
    if (result) setResult(null)
    if (error) setError(null)
  }

  const formatTicketDisplay = (number: string) => {
    return number.replace(/(\d{3})/g, '$1 ').trim()
  }

  const drawDateHeader = useMemo(() => {
    if (result && result.date) {
      return `Thailand Lottery - ${formatApiDateToEnglish(result.date)}`;
    }
    return "Thailand Lottery";
  }, [result]);

  return (
    <>
      <div className="text-center text-lg font-bold mb-2 text-blue-900">
        {drawDateHeader}
      </div>
      <Card className="bg-gradient-to-br from-blue-50 to-red-50 border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-red-600 via-white to-blue-600 text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-red-800">
            <Trophy className="w-6 h-6" />
            {t('priceChecker', language)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
                        <Select onValueChange={setSelectedDrawId} value={selectedDrawId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a draw date" />
              </SelectTrigger>
              <SelectContent>
                
                {historicalDraws.map(draw => (
                  <SelectItem key={draw.id} value={draw.id}>
                    {formatApiDateToEnglish(draw.date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

                        <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('enterTicketNumber', language)}
                  value={formatTicketDisplay(ticketNumber)}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="pl-10 text-center text-lg font-mono"
                  maxLength={7}
                />
              </div>
              <Button
                onClick={handleCheck}
                disabled={loading || ticketNumber.length !== 6}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? "..." : t('checkButton', language)}
              </Button>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    {t('checkPrize', language)}: {formatTicketDisplay(result.number)}
                  </h3>
                  {result.date && (
                    <div className="text-sm text-gray-500 mb-1">{t('drawDate', language)}: {result.date}</div>
                  )}
                  
                  {result.totalWinning > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="w-6 h-6" />
                        <span className="text-2xl font-bold">
                          {formatThaiCurrency(result.totalWinning)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {result.prizes.map((prize) => (
                          <Badge key={prize.id} className="bg-blue-500 text-white p-2">
                            {prize.name}: {formatThaiCurrency(prize.reward)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <XCircle className="w-6 h-6" />
                      <span className="text-lg">{t('noWinning', language)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </>
  )
}
