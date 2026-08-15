import { Lock, Sparkles } from "lucide-react";
import { toPersianDigits } from "../lib/format";
import { GARDEN_DECOR, getNextDecor, getUnlockedDecor } from "../data/decor";

interface GardenDecorProps {
  lifetimeWins: number;
}

export function GardenDecor({ lifetimeWins }: GardenDecorProps) {
  const unlockedDecor = getUnlockedDecor(lifetimeWins);
  const nextDecor = getNextDecor(lifetimeWins);

  return (
    <section className="decor-card soft-card" aria-labelledby="decor-title">
      <div className="decor-card__heading">
        <div className="decor-card__title">
          <span className="decor-card__icon" aria-hidden="true"><Sparkles size={18} /></span>
          <div>
            <p className="eyebrow">دکورهای باغ</p>
            <h2 id="decor-title">هر برد، یک چیز قشنگ‌تر</h2>
          </div>
        </div>
        <span className="tiny-badge">{toPersianDigits(unlockedDecor.length)} از {toPersianDigits(GARDEN_DECOR.length)}</span>
      </div>

      <div className="decor-card__scene" role="img" aria-label="صحنه‌ی دکورهای آزادشده">
        <span className="decor-card__seed" aria-hidden="true">🌱</span>
        {unlockedDecor.map((decor) => (
          <span key={decor.id} className={`decor-card__scene-item decor-card__scene-item--${decor.id}`} title={decor.label} aria-label={decor.label}>
            {decor.emoji}
          </span>
        ))}
        {unlockedDecor.length === 0 && <span className="decor-card__scene-hint">با اولین برد، باغت یک گل هدیه می‌گیرد ✨</span>}
      </div>

      <div className="decor-card__collection" aria-label="مجموعه‌ی دکورهای باغ">
        {GARDEN_DECOR.map((decor) => {
          const unlocked = lifetimeWins >= decor.unlockAt;
          return (
            <div className={`decor-card__item${unlocked ? " is-unlocked" : ""}`} key={decor.id}>
              <span className="decor-card__item-icon" aria-hidden="true">
                {unlocked ? decor.emoji : <Lock size={14} />}
              </span>
              <span>{decor.label}</span>
            </div>
          );
        })}
      </div>

      <p className="decor-card__hint">
        {nextDecor
          ? `${toPersianDigits(nextDecor.unlockAt - lifetimeWins)} برد کوچک تا ${nextDecor.label}`
          : "همه‌ی گوشه‌های باغت پر از چیزهای قشنگ شده ✨"}
      </p>
    </section>
  );
}
