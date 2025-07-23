"use client"

"use client"

import { LotteryHeader } from "@/components/lottery-header"
import { LotteryResult } from "@/components/lottery-result";
import { getDrawHistory, getLotteryByDate, getLatestLottery, LotteryResult as LotteryResultType, DrawListItem } from "@/lib/lottery-api";
import { Language, t } from "@/lib/translations";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatApiDateToEnglish } from "@/lib/utils";

export default function ResultsPage() {
  const [language, setLanguage] = useState<Language>('en')
    const [result, setResult] = useState<LotteryResultType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicalDraws, setHistoricalDraws] = useState<DrawListItem[]>([]);
  const [selectedDrawId, setSelectedDrawId] = useState<string>("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const history = await getDrawHistory(1);
        setHistoricalDraws(history);
        if (history.length > 0) {
          const initialDrawId = history[0].id;
          setSelectedDrawId(initialDrawId);
          const latestResult = await getLotteryByDate(initialDrawId);
          setResult(latestResult);
        }
      } catch (err) {
        setError('Failed to fetch lottery data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleDrawChange = async (drawId: string) => {
    setSelectedDrawId(drawId);
    setLoading(true);
    try {
      const newResult = await getLotteryByDate(drawId);
      setResult(newResult);
    } catch (err) {
      setError('Failed to fetch results for the selected date.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LotteryHeader language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-red-800">{t('results', language)}</h1>
          {historicalDraws.length > 0 && (
            <Select onValueChange={handleDrawChange} value={selectedDrawId}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder={t('drawDate', language)} />
              </SelectTrigger>
              <SelectContent>
                {historicalDraws.map((draw) => (
                  <SelectItem key={draw.id} value={draw.id}>
                    {formatApiDateToEnglish(draw.date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {loading && <p>{t('loading', language)}</p>}
        {error && <p className="text-red-500">{error}</p>}
        {result && <LotteryResult result={result} language={language} />}

      </main>
    </div>
  )
}
