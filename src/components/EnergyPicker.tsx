import { CloudSun, Moon, Zap } from "lucide-react";
import type { EnergyLevel } from "../types/game";

interface EnergyPickerProps {
  value: EnergyLevel;
  onChange: (value: EnergyLevel) => void;
}

const ENERGY_OPTIONS: Array<{
  value: EnergyLevel;
  label: string;
  copy: string;
  Icon: typeof Moon;
}> = [
  { value: 1, label: "آرام", copy: "نسخه خیلی کوچیک", Icon: Moon },
  { value: 2, label: "معمولی", copy: "نسخه استاندارد", Icon: CloudSun },
  { value: 3, label: "پرانرژی", copy: "اگر دلت خواست بیشتر", Icon: Zap },
];

export function EnergyPicker({ value, onChange }: EnergyPickerProps) {
  return (
    <section className="soft-card energy-card" aria-labelledby="energy-title">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">اول از همه</p>
          <h2 id="energy-title">امروز چقدر انرژی داری؟</h2>
        </div>
        <span className="tiny-badge">هیچ جوابی غلط نیست</span>
      </div>
      <div className="energy-options" role="group" aria-label="انتخاب انرژی امروز">
        {ENERGY_OPTIONS.map(({ value: optionValue, label, copy, Icon }) => {
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
