export const translations = {
  en: {
    // Header
    title: "Thailand Lottery",
    subtitle: "Official Lottery Tickets",
    nextDraw: "Next Draw",
    availableTickets: "Available Tickets",
    results: "Results",

    // Stats
    available: "Available",
    totalTickets: "Total Tickets",
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

    // Price Checker
    priceChecker: "Price Checker",
    enterTicketNumber: "Enter 6-digit ticket number",
    checkButton: "Check Prize",
    invalidTicketNumber: "Please enter a valid 6-digit ticket number",
    checkFailed: "Failed to check prize. Please try again.",
    checkPrize: "Check Prize Result",
    drawDate: "Draw Date",
    noWinning: "Not a winning number",

    // Ticket Grid
    availableTicketsTitle: "Available Tickets",
    showingTickets: "Showing {filtered} of {total} tickets",
    noTicketsAvailable: "No tickets available at this time",
    noTicketsMessage: "There are currently no tickets for this draw.",
    noActiveDrawMessage: "No active draw found. Please check back later.",

    // Results Page
    latestDraw: "Latest Draw Results",
    firstPrize: "1st Prize",
    last2Digits: "Last 2 Digits",
    last3Front: "Front 3 Digits",
    last3Back: "Back 3 Digits",
    nearFirst: "Near 1st Prize",
    totalWinning: "Total Winnings",

    // Footer
    copyright: "© 2025 Thailand Lottery. All rights reserved.",
    playResponsibly: "Please Play Responsibly",

    // General
    loading: "Loading...",
    luckyNumber: "Lucky Number",
  },
  th: {
    // Header
    title: 'สำนักงานสลากกินแบ่งรัฐบาล',
    subtitle: 'ล็อตเตอรี่ออนไลน์อย่างเป็นทางการ',
    nextDraw: 'งวดถัดไป',
    availableTickets: 'สลากที่มีจำหน่าย',
    results: 'ผลรางวัล',

    // Stats
    available: 'มีจำหน่าย',
    totalTickets: 'สลากทั้งหมด',
    activeDraw: 'งวดที่ใช้งานอยู่',
    nextDrawDate: 'วันที่ออกรางวัลครั้งถัดไป',
    noActiveDraw: 'ไม่มีงวดที่ใช้งานอยู่',

    // Search & Filter
    searchPlaceholder: 'ค้นหาเลขสลาก...',
    filters: 'ตัวกรอง',
    luckyNumbersOnly: 'เฉพาะเลขนำโชค',
    lastDigit: 'เลขท้าย',
    any: 'ทั้งหมด',
    clear: 'ล้าง',

    // Price Checker
    priceChecker: 'ตรวจรางวัล',
    enterTicketNumber: 'กรอกเลขสลาก 6 หลัก',
    checkButton: 'ตรวจรางวัล',
    invalidTicketNumber: 'กรุณากรอกเลขสลาก 6 หลักให้ถูกต้อง',
    checkFailed: 'การตรวจสอบล้มเหลว กรุณาลองใหม่',
    checkPrize: 'ผลการตรวจรางวัล',
    drawDate: 'งวดวันที่',
    noWinning: 'ไม่ถูกรางวัล',

    // Ticket Grid
    availableTicketsTitle: 'สลากที่เปิดจำหน่าย',
    showingTickets: 'แสดง {filtered} จาก {total} ใบ',
    noTicketsAvailable: 'ไม่มีสลากในขณะนี้',
    noTicketsMessage: 'ไม่มีสลากสำหรับงวดนี้ในขณะนี้',
    noActiveDrawMessage: 'ไม่พบงวดที่เปิดใช้งานอยู่ กรุณาตรวจสอบอีกครั้งในภายหลัง',

    // Results Page
    latestDraw: 'ผลรางวัลงวดล่าสุด',
    firstPrize: 'รางวัลที่ 1',
    last2Digits: 'เลขท้าย 2 ตัว',
    last3Front: 'เลขหน้า 3 ตัว',
    last3Back: 'เลขท้าย 3 ตัว',
    nearFirst: 'รางวัลข้างเคียงรางวัลที่ 1',
    totalWinning: 'รางวัลรวม',

    // Footer
    copyright: '© 2568 สำนักงานสลากกินแบ่งรัฐบาล สงวนลิขสิทธิ์',
    playResponsibly: 'กรุณาเล่นอย่างรับผิดชอบ',

    // General
    loading: 'กำลังโหลด...',
    luckyNumber: 'เลขนำโชค',
  }
}

export type Language = keyof typeof translations;
export type TranslationKey = keyof (typeof translations.en | typeof translations.th);

export function t(key: TranslationKey, lang: Language = 'en', params?: Record<string, string | number>): string {
  let text = translations[lang][key] || translations.en[key] || key

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value))
    })
  }

  return text
}
