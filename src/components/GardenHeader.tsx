import { BookOpen, Heart, Settings2, Sparkles, Trophy } from "lucide-react";
import type { AvatarVariant } from "../lib/avatar";
import type { PaletteId, PlantStage } from "../types/game";
import { toPersianDigits } from "../lib/format";
import { ApricityAvatar } from "./ApricityAvatar";

interface GardenHeaderProps {
  displayName: string;
  nickname: string;
  avatarSeed: string;
  avatarVariant: AvatarVariant;
  palette: PaletteId;
  plantStage: PlantStage;
  totalWins: number;
  gentleStreak: number;
  todayWeekday: string;
  todayDate: string;
  onGuide: () => void;
  onSettings: () => void;
}

export function GardenHeader({
  displayName,
  nickname,
  avatarSeed,
  avatarVariant,
  palette,
  plantStage,
  totalWins,
  gentleStreak,
  todayWeekday,
  todayDate,
  onGuide,
  onSettings,
}: GardenHeaderProps) {
  return (
    <header className="garden-header">
      <div className="garden-header__main">
        <div className="brand-mark brand-mark--avatar">
          <ApricityAvatar seed={avatarSeed} variant={avatarVariant} palette={palette} stage={plantStage} size={54} label="آواتار امروز فاطمه" />
        </div>
        <div>
          <p className="eyebrow">سلام، {displayName} <Heart className="inline-heart" size={14} fill="currentColor" /></p>
          <h1>{nickname}</h1>
          <p className="header-subtitle">گرمای آفتاب در روزهای سرد.</p>
          <div className="today-summary" aria-label={`امروز ${todayWeekday}، ${todayDate}`}>
            <span className="today-summary__icon" aria-hidden="true">☼</span>
            <span>
              <strong>{todayWeekday}</strong>
              <small>{todayDate}</small>
            </span>
          </div>
        </div>
      </div>

      <div className="garden-header__side">
        <div className="stats-row" aria-label="آمار باغ">
          <div className="mini-stat">
            <span className="mini-stat__icon mini-stat__icon--sun" aria-hidden="true"><Trophy size={16} /></span>
            <span><strong>{toPersianDigits(totalWins)}</strong><small>برد</small></span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat__icon mini-stat__icon--leaf" aria-hidden="true"><Sparkles size={16} /></span>
            <span><strong>{toPersianDigits(gentleStreak)}</strong><small>روز نرم</small></span>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-button" type="button" onClick={onGuide} aria-label="راهنمای Apricity">
            <BookOpen size={20} strokeWidth={1.8} />
          </button>
          <button className="icon-button" type="button" onClick={onSettings} aria-label="باز کردن تنظیمات">
            <Settings2 size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}
