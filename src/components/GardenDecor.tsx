import { Lock, Sparkles } from "lucide-react";
import { toPersianDigits } from "../lib/format";
import { GARDEN_DECOR, getNextDecor, getUnlockedDecor } from "../data/decor";
import type { PlantStage } from "../types/game";
import { PlantArtwork } from "./PlantArtwork";

interface GardenDecorProps {
  lifetimeWins: number;
  gardenPlantStage: PlantStage;
}

export function GardenDecor({ lifetimeWins, gardenPlantStage }: GardenDecorProps) {
  const unlockedDecor = getUnlockedDecor(lifetimeWins);
  const nextDecor = getNextDecor(lifetimeWins);
  const gardenLevel = Math.min(5, Math.max(0, Math.floor(lifetimeWins)));
  const gardenCopy = gardenPlantStage === "tree"
    ? "درختت اینجا ریشه دوانده ✨"
    : gardenPlantStage === "flower"
      ? "باغت دارد رنگ می‌گیرد"
      : gardenPlantStage === "sprout"
        ? "جوانه‌ات جای خودش را پیدا کرده"
        : "اینجا جای رشدهای بعدی توست";

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
        <span className="tiny-badge">{gardenPlantStage === "tree" ? "درخت ریشه دارد" : `${toPersianDigits(unlockedDecor.length)} از ${toPersianDigits(GARDEN_DECOR.length)}`}</span>
      </div>

      <div
        className={`decor-card__scene decor-card__scene--${gardenPlantStage} decor-card__scene--level-${gardenLevel}`}
        role="img"
        aria-label={`باغ Apricity؛ ${gardenCopy}`}
      >
        <span className="decor-card__scene-sun" aria-hidden="true" />
        <span className="decor-card__scene-cloud decor-card__scene-cloud--one" aria-hidden="true" />
        <span className="decor-card__scene-cloud decor-card__scene-cloud--two" aria-hidden="true" />
        <span className="decor-card__scene-hill decor-card__scene-hill--back" aria-hidden="true" />
        <span className="decor-card__scene-hill decor-card__scene-hill--front" aria-hidden="true" />
        <span className="decor-card__scene-path" aria-hidden="true" />
        <span className="decor-card__scene-plant" aria-hidden="true">
          <PlantArtwork stage={gardenPlantStage} idPrefix="garden-plant" />
        </span>
        {unlockedDecor.map((decor) => (
          <span key={decor.id} className={`decor-card__scene-item decor-card__scene-item--${decor.id}`} title={decor.label} aria-label={decor.label}>
            {decor.emoji}
          </span>
        ))}
        <span className="decor-card__scene-note">{gardenCopy}</span>
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
