import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatApiDateToEnglish(dateStr?: string): string {
  if (!dateStr) return "-";
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
    return `${day} ${engMonth} ${year}`;
  }
  return dateStr || "";
}

export function formatThaiCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
