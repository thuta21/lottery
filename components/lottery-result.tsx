import { LotteryResult as LotteryResultType } from "@/lib/lottery-api";
import { t, Language } from "@/lib/translations";

interface LotteryResultProps {
  result: LotteryResultType;
  language: Language;
}

export function LotteryResult({ result, language }: LotteryResultProps) {
  const renderPrize = (titleKey: any, numbers: string | string[] | undefined) => {
    const numberArray = Array.isArray(numbers) ? numbers : (numbers ? [numbers] : []);
    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{t(titleKey, language)}</h3>
        {numberArray.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {numberArray.map((num) => (
              <span key={num} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md font-mono">
                {num}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">-</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-red-800">{t('firstPrize', language)}</h2>
        <p className="text-5xl font-mono text-red-600 tracking-widest py-2">
          {result.results.first || '-'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-center">
        {renderPrize('last2Digits', result.results.last2)}
        {renderPrize('last3Front', result.results.last3front)}
        {renderPrize('last3Back', result.results.last3back)}
      </div>

      <div className="mt-6 border-t pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          {renderPrize('nearFirst', result.results.near1)}
        </div>
      </div>
    </div>
  );
}
