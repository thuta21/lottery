"use client"

"use client"

import { LotteryHeader } from "@/components/lottery-header"
import { LotteryResult } from "@/components/lottery-result";
import { getLatestLottery, LotteryResult as LotteryResultType } from "@/lib/lottery-api";
import { Language, t } from "@/lib/translations"
import { useEffect, useState } from "react"

export default function ResultsPage() {
  const [language, setLanguage] = useState<Language>('en')
  const [result, setResult] = useState<LotteryResultType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getLatestLottery();
        setResult(data);
      } catch (err) {
        setError('Failed to fetch lottery results.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <LotteryHeader language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-800">{t('results', language)}</h1>
        </div>

        {loading && <p>{t('loading', language)}</p>}
        {error && <p className="text-red-500">{error}</p>}
        {result && <LotteryResult result={result} language={language} />}

      </main>
    </div>
  )
}
