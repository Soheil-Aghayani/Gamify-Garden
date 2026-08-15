import { BookOpen, CalendarDays, Heart, Settings2, Sparkles, Trophy } from "lucide-react";
import type { AvatarVariant } from "../lib/avatar";
import type { PaletteId, PlantStage } from "../types/game";
import { toPersianDigits } from "../lib/format";
import { ApricityAvatar } from "./ApricityAvatar";

interface GardenHeaderProps {
  displayName: string;
  greeting: string;
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
  greeting,
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
          <ApricityAvatar seed={avatarSeed} variant={avatarVariant} palette={palette} stage={plantStage} size={54} label={`آواتار امروز ${displayName}`} />
        </div>
        <div className="garden-header__copy">
          <p className="eyebrow">سلام، {greeting} {displayName} <Heart className="inline-heart" size={14} fill="currentColor" /></p>
          <div className="garden-header__brand-kicker" aria-label="باغچه‌ی قدم‌های کوچک">
            <span>باغچه‌ی قدم‌های کوچیک</span>
            <span aria-hidden="true">✦</span>
          </div>
          <div className="garden-header__name-row">
            <h1 dir="auto">{nickname}</h1>
            <span className="garden-header__name-spark" aria-hidden="true">✦</span>
          </div>
          <p className="header-subtitle">یک قدم کوچیک هم برای امروز کافیه.</p>
          <div className="today-summary" aria-label={`امروز ${todayWeekday}، ${todayDate}`}>
            <span className="today-summary__icon" aria-hidden="true"><CalendarDays size={15} strokeWidth={1.8} /></span>
            <span>
              <strong>امروز، {todayWeekday}</strong>
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
