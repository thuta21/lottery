import { LotteryResult as LotteryResultType } from "@/lib/lottery-api";
import { t, Language } from "@/lib/translations";

interface LotteryResultProps {
  result: LotteryResultType;
  language: Language;
}

export function LotteryResult({ result, language }: LotteryResultProps) {
  const renderPrize = (titleKey: any, numbers: string[] | undefined) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-700">{t(titleKey, language)}</h3>
      {numbers && numbers.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {numbers.map((num) => (
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

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-red-800">{t('firstPrize', language)}</h2>
        <p className="text-5xl font-mono text-red-600 tracking-widest py-2">
          {result.prizes.find(p => p.name === 'รางวัลที่ 1')?.number || '-'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {renderPrize('last2Digits', result.runningNumbers.find(rn => rn.name === 'เลขท้าย 2 ตัว')?.numbers)}
        {renderPrize('last3Front', result.runningNumbers.find(rn => rn.name === 'เลขหน้า 3 ตัว')?.numbers)}
        {renderPrize('last3Back', result.runningNumbers.find(rn => rn.name === 'เลขท้าย 3 ตัว')?.numbers)}
      </div>
    </div>
  );
}
