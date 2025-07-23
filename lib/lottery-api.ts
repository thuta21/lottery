// Thailand Lottery API integration
const LOTTERY_API_BASE = 'https://lotto.api.rayriffy.com'

export interface LotteryResult {
  date: string
  endpoint: string
  results: {
    first: string
    last2: string
    last3back: string
    last3front: string
    near1: string[]
    near2: string[]
  }
}

export interface PrizeDetail {
  id: string;
  name: string;
  reward: number;
  numbers: string[];
}

export interface DrawListItem {
  id: string;
  url: string;
  date: string;
}

export interface PriceCheckResult {
  number: string;
  prizes: PrizeDetail[];
  totalWinning: number;
  date?: string;
  endpoint?: string;
  error?: string;
}

export async function getLatestLotteryResult(): Promise<LotteryResult | null> {
  try {
    const response = await fetch(`${LOTTERY_API_BASE}/latest`)
    if (!response.ok) throw new Error('Failed to fetch lottery results')
    return await response.json()
  } catch (error) {
    console.error('Error fetching lottery results:', error)
    return null
  }
}

export async function checkLotteryPrice(ticketNumber: string, date?: string): Promise<PriceCheckResult> {
  const result: PriceCheckResult = {
    number: ticketNumber,
    prizes: [],
    totalWinning: 0,
  };

  try {
    const endpoint = date ? `${LOTTERY_API_BASE}/lotto/${date}` : `${LOTTERY_API_BASE}/latest`;
    console.log('date: ', date)
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch lottery results');

    const lotteryResult = await response.json();
    if (!lotteryResult || !lotteryResult.response) {
      throw new Error('Invalid API response structure');
    }
    const { response: api } = lotteryResult;
    result.date = api.date;
    result.endpoint = api.endpoint;

    // Check all main prizes
    if (api.prizes && Array.isArray(api.prizes)) {
      for (const prize of api.prizes) {
        if (prize.number && Array.isArray(prize.number) && prize.number.includes(ticketNumber)) {
          result.prizes.push({
            id: prize.id,
            name: prize.name,
            reward: Number(prize.reward),
            numbers: prize.number,
          });
          result.totalWinning += Number(prize.reward);
        }
      }
    }
    // Check running numbers (เลขหน้า/เลขท้าย 3 ตัว, 2 ตัว)
    if (api.runningNumbers && Array.isArray(api.runningNumbers)) {
      for (const running of api.runningNumbers) {
        if (running.number && Array.isArray(running.number)) {
          // 3-digit front/back: match last 3 or first 3 digits
          if (running.id.includes('FrontThree')) {
            if (running.number.includes(ticketNumber.slice(0, 3))) {
              result.prizes.push({
                id: running.id,
                name: running.name,
                reward: Number(running.reward),
                numbers: running.number,
              });
              result.totalWinning += Number(running.reward);
            }
          } else if (running.id.includes('BackThree')) {
            if (running.number.includes(ticketNumber.slice(-3))) {
              result.prizes.push({
                id: running.id,
                name: running.name,
                reward: Number(running.reward),
                numbers: running.number,
              });
              result.totalWinning += Number(running.reward);
            }
          } else if (running.id.includes('BackTwo')) {
            if (running.number.includes(ticketNumber.slice(-2))) {
              result.prizes.push({
                id: running.id,
                name: running.name,
                reward: Number(running.reward),
                numbers: running.number,
              });
              result.totalWinning += Number(running.reward);
            }
          }
        }
      }
    }
  } catch (error: any) {
    result.error = error.message || 'Unknown error';
  }

  return result;
}

export async function getDrawHistory(page: number = 1): Promise<DrawListItem[]> {
  try {
    const response = await fetch(`${LOTTERY_API_BASE}/list/${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch draw history');
    }
    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.response)) {
      return data.response;
    }
    throw new Error('Invalid API response structure for draw history');
  } catch (error) {
    console.error('Error fetching draw history:', error);
    return [];
  }
}
