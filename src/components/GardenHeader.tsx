import { Heart, Settings2, Sparkles, Trophy } from "lucide-react";

interface GardenHeaderProps {
  displayName: string;
  totalWins: number;
  gentleStreak: number;
  onSettings: () => void;
}

export function GardenHeader({
  displayName,
  totalWins,
  gentleStreak,
  onSettings,
}: GardenHeaderProps) {
  return (
    <header className="garden-header">
      <div className="garden-header__main">
        <div className="brand-mark" aria-hidden="true">
          <Sparkles size={22} strokeWidth={1.8} />
        </div>
        <div>
          <p className="eyebrow">سلام، {displayName} <Heart className="inline-heart" size={14} fill="currentColor" /></p>
          <h1>باغ امروزت</h1>
          <p className="header-subtitle">سه قدم کوچیک، یک حالِ بهتر.</p>
        </div>
      </div>

      <div className="garden-header__side">
        <div className="stats-row" aria-label="آمار باغ">
          <div className="mini-stat">
            <span className="mini-stat__icon mini-stat__icon--sun" aria-hidden="true"><Trophy size={16} /></span>
            <span><strong>{totalWins}</strong><small>برد</small></span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat__icon mini-stat__icon--leaf" aria-hidden="true"><Sparkles size={16} /></span>
            <span><strong>{gentleStreak}</strong><small>روز نرم</small></span>
          </div>
        </div>
        <button className="icon-button" type="button" onClick={onSettings} aria-label="باز کردن تنظیمات">
          <Settings2 size={20} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
