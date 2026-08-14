import { Check, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { getDailyPlantStage } from "../lib/game";
import { toPersianDigits, toPersianPercent } from "../lib/format";
import type { PaletteId, PlantStage } from "../types/game";
import { ApricityAvatar } from "./ApricityAvatar";
import { PlantArtwork } from "./PlantArtwork";

interface GrowthSceneProps {
  completedCount: number;
  target: number;
  totalWins: number;
  avatarSeed: string;
  palette: PaletteId;
}

const STAGE_LABELS: Record<PlantStage, string> = {
  seed: "دانه",
  sprout: "جوانه",
  flower: "گل",
  tree: "درخت",
};

export function GrowthScene({ completedCount, target, totalWins, avatarSeed, palette }: GrowthSceneProps) {
  const stage = getDailyPlantStage(completedCount, target);
  const progress = target === 0 ? 0 : Math.min(100, Math.round((completedCount / target) * 100));
  const isComplete = target > 0 && completedCount >= target;
  const message = target === 0
    ? "اول یک مأموریت برای باغت بساز"
    : isComplete
      ? "امروز باغت شکوفه زد"
      : completedCount === target - 1
        ? "فقط یک قدم تا شکوفه"
        : completedCount === 1
          ? "جوانه‌اش را دیدی"
          : "یک قدم کوچک بردار";

  return (
    <section className={`growth-card soft-card${isComplete ? " is-blooming" : ""}`} aria-labelledby="growth-title" aria-live="polite">
      <Sparkles className="growth-spark growth-spark--one" size={20} aria-hidden="true" />
      <Sparkles className="growth-spark growth-spark--two" size={14} aria-hidden="true" />
      <div className="growth-card__copy">
        <div className="growth-card__topline">
          <span className="tiny-badge tiny-badge--warm"><Sparkles size={13} /> مرحله‌ی امروز</span>
          <ApricityAvatar seed={avatarSeed} palette={palette} stage={stage} size={54} label="Apricity کنار باغ" />
        </div>
        <h2 id="growth-title">باغت آرام‌آرام رشد می‌کند</h2>
        <p>{message}</p>
        <div className="growth-facts">
          <span><strong>{toPersianDigits(completedCount)}</strong> از {toPersianDigits(target)} قدم</span>
          <span><strong>{toPersianDigits(totalWins)}</strong> شکوفه‌ی قبلی</span>
        </div>
        <div className="growth-stage"><span className="growth-stage__dot" /> {STAGE_LABELS[stage]}</div>
      </div>

      <div className="growth-visual">
        <div className="growth-ring" style={{ "--progress": `${progress}%` } as CSSProperties}>
          <div className="growth-ring__inner">
            <PlantArtwork stage={stage} />
            {isComplete && <span className="growth-check" aria-label="روز موفق"><Check size={18} /></span>}
          </div>
        </div>
        <span className="growth-percent">{toPersianPercent(progress)}</span>
      </div>
    </section>
  );
}
