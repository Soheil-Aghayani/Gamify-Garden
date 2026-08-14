import type { LucideIcon } from "lucide-react";

export type QuestId =
  | "llm"
  | "article-video"
  | "language"
  | "article"
  | "exercise"
  | "writing";

export type EnergyLevel = 1 | 2 | 3;
export type PlantStage = "seed" | "sprout" | "flower" | "tree";
export type PaletteId = "mint" | "lilac" | "peach";

export interface Quest {
  id: QuestId;
  title: string;
  minimumAction: string;
  energyCopy: Record<EnergyLevel, string>;
  icon: LucideIcon;
}

export interface DailyState {
  dayKey: string;
  energy: EnergyLevel;
  completedQuestIds: QuestId[];
  dailyWin: boolean;
  rewardChoice?: string;
}

export interface Profile {
  displayName: string;
  palette: PaletteId;
}

export interface GameState {
  profile: Profile;
  days: Record<string, DailyState>;
  totalWins: number;
  gentleStreak: number;
  plantStage: PlantStage;
}
