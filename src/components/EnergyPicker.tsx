import { BatteryLow, CloudSun, Cloudy, Zap, type LucideIcon } from "lucide-react";
import type { Ref } from "react";
import type { MoodLevel } from "../types/game";

interface EnergyPickerProps {
  value: MoodLevel;
  confirmed: boolean;
  isNext: boolean;
  sectionRef?: Ref<HTMLElement>;
  onChange: (value: MoodLevel) => void;
}

const MOOD_OPTIONS: Array<{
  value: MoodLevel;
  label: string;
  copy: string;
  Icon: LucideIcon;
}> = [
  { value: "tired", label: "خسته‌ام", copy: "امروز آهسته‌تر می‌ریم", Icon: BatteryLow },
  { value: "calm", label: "آرومم", copy: "یک قدم نرم و خوب", Icon: CloudSun },
  { value: "low", label: "بی‌حوصله‌ام", copy: "فقط یک شروع کوچیک", Icon: Cloudy },
  { value: "energized", label: "پرانرژی‌ام", copy: "اگر دلت خواست بیشتر", Icon: Zap },
];

export function EnergyPicker({ value, confirmed, isNext, sectionRef, onChange }: EnergyPickerProps) {
  return (
    <section
      ref={sectionRef}
      tabIndex={-1}
      className={`soft-card energy-card${isNext ? " is-flow-next" : ""}${confirmed ? " is-confirmed" : ""}`}
      aria-labelledby="energy-title"
    >
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">اول از همه</p>
          <h2 id="energy-title">امروز چه حالی داری؟</h2>
        </div>
        <span className={`tiny-badge${isNext ? " tiny-badge--flow" : ""}`}>
          {isNext ? "قدم بعدی" : confirmed ? "انتخاب شد" : "هیچ جوابی غلط نیست"}
        </span>
      </div>
      <div className="energy-options" role="group" aria-label="انتخاب حال امروز">
        {MOOD_OPTIONS.map(({ value: optionValue, label, copy, Icon }) => {
          const selected = optionValue === value;
          return (
            <button
              className={`energy-option${selected ? " is-selected" : ""}`}
              type="button"
              key={optionValue}
              onClick={() => onChange(optionValue)}
              aria-pressed={selected}
            >
              <span className="energy-option__icon" aria-hidden="true"><Icon size={20} strokeWidth={1.8} /></span>
              <span className="energy-option__text">
                <strong>{label}</strong>
                <small>{copy}</small>
              </span>
              <span className="energy-option__dot" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
