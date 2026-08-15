import { toPersianDigits } from "./format";

export function getDayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getPersianGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return "نیمه‌شبت بخیر";
  if (hour < 12) return "صبحت بخیر";
  if (hour < 17) return "ظهرت بخیر";
  if (hour < 21) return "عصرت بخیر";
  return "شبت بخیر";
}

export interface PersianDateSummary {
  weekday: string;
  date: string;
  ariaLabel: string;
}

export function getPersianDateSummary(date = new Date()): PersianDateSummary {
  const weekday = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "long" }).format(date);
  const dateLabel = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const formattedDate = toPersianDigits(dateLabel);
  return {
    weekday,
    date: formattedDate,
    ariaLabel: `${weekday}، ${formattedDate}`,
  };
}

export function shiftDayKey(dayKey: string, amount: number): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + amount);
  return getDayKey(date);
}
