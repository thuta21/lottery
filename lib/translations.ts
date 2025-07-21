export const translations = {
  en: {
    // Header
    title: "Thailand Lottery",
    subtitle: "Official Lottery Tickets",
    nextDraw: "Next Draw",
    availableTickets: "Available Tickets",

    // Stats
    totalTickets: "Available Tickets",
    activeDraw: "Active Draw",
    nextDrawDate: "Next Draw Date",
    noActiveDraw: "No Active Draw",

    // Search & Filter
    searchPlaceholder: "Search ticket numbers...",
    filters: "Filters",
    luckyNumbersOnly: "Lucky Numbers Only",
    lastDigit: "Last Digit:",
    any: "Any",
    clear: "Clear",

    // Tickets
    availableTicketsTitle: "Available Tickets",
    showingTickets: "Showing {filtered} of {total} tickets",
    luckyNumber: "Lucky Number",

    // Price Checker
    priceChecker: "Price Checker",
    checkPrize: "Check Prize",
    enterTicketNumber: "Enter ticket number",
    checkButton: "Check Prize",
    latestDraw: "Latest Draw Results",
    firstPrize: "First Prize",
    last2Digits: "Last 2 Digits",
    last3Front: "First 3 Digits",
    last3Back: "Last 3 Digits",
    nearFirst: "Near First Prize",
    nearSecond: "Near Second Prize",
    totalWinning: "Total Winning",
    noWinning: "No winning prizes",
    invalidTicketNumber: "Please enter a valid 6-digit ticket number",
    checkFailed: "Failed to check lottery results. Please try again.",
    drawDate: "Draw Date",

    // Messages
    loading: "Loading lottery tickets...",
    noTicketsAvailable: "No Tickets Available",
    noTicketsMessage: "No tickets are currently available for this draw.",
    noActiveDrawMessage: "No active lottery draw found. Please check back later.",

    // Footer
    copyright: "© 2025 Thailand Lottery. All rights reserved.",
    playResponsibly: "Play responsibly. Must be 18 or older to participate.",
  },
  th: {
    // Header
    title: "หวยไทย",
    subtitle: "ตั้วหวยราชการ",
    nextDraw: "งวดถัดไป",
    availableTickets: "ตั้วหวยที่มี",

    // Stats
    totalTickets: "ตั้วหวยที่มี",
    activeDraw: "งวดปัจจุบัน",
    nextDrawDate: "วันที่ออกรางวัล",
    noActiveDraw: "ไม่มีงวดที่เปิด",

    // Search & Filter
    searchPlaceholder: "ค้นหาเลขตั้ว...",
    filters: "ตัวกรอง",
    luckyNumbersOnly: "เลขมงคลเท่านั้น",
    lastDigit: "เลขท้าย:",
    any: "ทั้งหมด",
    clear: "ล้าง",

    // Tickets
    availableTicketsTitle: "ตั้วหวยที่มี",
    showingTickets: "แสดง {filtered} จาก {total} ตั้ว",
    luckyNumber: "เลขมงคล",

    // Price Checker
    priceChecker: "ตรวจหวย",
    checkPrize: "ตรวจรางวัล",
    enterTicketNumber: "ใส่เลขตั้วหวย",
    checkButton: "ตรวจรางวัล",
    latestDraw: "ผลรางวัลงวดล่าสุด",
    firstPrize: "รางวัลที่ 1",
    last2Digits: "เลขท้าย 2 ตัว",
    last3Front: "เลขหน้า 3 ตัว",
    last3Back: "เลขท้าย 3 ตัว",
    nearFirst: "ใกล้เคียงรางวัลที่ 1",
    nearSecond: "ใกล้เคียงรางวัลที่ 2",
    totalWinning: "รางวัลรวม",
    noWinning: "ไม่ถูกรางวัล",
    invalidTicketNumber: "กรุณากรอกเลขตั๋ว 6 หลักให้ถูกต้อง",
    checkFailed: "ตรวจสอบผลล้มเหลว กรุณาลองใหม่อีกครั้ง",
    drawDate: "วันที่ออกรางวัล",

    // Messages
    loading: "กำลังโหลดตั้วหวย...",
    noTicketsAvailable: "ไม่มีตั้วหวย",
    noTicketsMessage: "ไม่มีตั้วหวยสำหรับงวดนี้",
    noActiveDrawMessage: "ไม่มีงวดที่เปิดขาย กรุณาตรวจสอบใหม่ภายหลัง",

    // Footer
    copyright: "© 2025 หวยไทย สงวนลิขสิทธิ์",
    playResponsibly: "เล่นอย่างมีสติ ต้องอายุ 18 ปีขึ้นไป",
  }
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

export function t(key: TranslationKey, lang: Language = 'en', params?: Record<string, string | number>): string {
  let text = translations[lang][key] || translations.en[key] || key

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value))
    })
  }

  return text
}
