import { Flower2, Sprout } from "lucide-react";
import { shiftDayKey } from "../lib/date";
import type { DailyState } from "../types/game";

interface WeekMemoryProps {
  days: Record<string, DailyState>;
  todayKey: string;
}

function weekdayLabel(dayKey: string, isToday: boolean) {
  if (isToday) return "امروز";
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Intl.DateTimeFormat("fa-IR", { weekday: "short" }).format(new Date(year, month - 1, day));
}

export function WeekMemory({ days, todayKey }: WeekMemoryProps) {
  const week = Array.from({ length: 7 }, (_, index) => {
    const dayKey = shiftDayKey(todayKey, index - 6);
    return { dayKey, state: days[dayKey], isToday: dayKey === todayKey };
  });

  return (
    <section className="week-memory soft-card" aria-labelledby="week-memory-title">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">یادگارهای کوچک</p>
          <h2 id="week-memory-title">هفته‌ات همین‌جا می‌درخشد</h2>
        </div>
        <span className="tiny-badge">بدون فشار</span>
      </div>
      <p className="week-memory__copy">هر شکوفه یعنی یک روز که به خودت رسیدی.</p>
      <div className="week-memory__days">
        {week.map(({ dayKey, state, isToday }) => {
          const isBloom = Boolean(state?.dailyWin);
          return (
            <div
              className={`week-memory__day${isBloom ? " is-bloom" : ""}${isToday ? " is-today" : ""}`}
              key={dayKey}
              aria-label={`${weekdayLabel(dayKey, isToday)}؛ ${isBloom ? "روز شکوفه‌دار" : "روز آرام"}`}
            >
              <span className="week-memory__label">{weekdayLabel(dayKey, isToday)}</span>
              <span className="week-memory__dot" aria-hidden="true">
                {isBloom ? <Flower2 size={16} /> : state ? <Sprout size={14} /> : <span />}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
