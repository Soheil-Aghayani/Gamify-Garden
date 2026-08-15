export type QuestId = string;

export type EnergyLevel = 1 | 2 | 3;
export type PlantStage = "seed" | "sprout" | "flower" | "tree";
export type PaletteId = "mint" | "lilac" | "peach";
export type ThemeMode = "light" | "dark" | "system";
export type FlowStep = "intro" | "energy" | "tasks" | "reward" | "done" | "manage";
export type TaskIconKey =
  | "brain"
  | "play"
  | "languages"
  | "book"
  | "exercise"
  | "writing"
  | "sparkles"
  | "star"
  | "heart"
  | "sun"
  | "lightbulb";

export interface TaskDefinition {
  id: QuestId;
  title: string;
  minimumAction: string;
  energyCopy: Record<EnergyLevel, string>;
  iconKey: TaskIconKey;
  isDefault?: boolean;
  createdAt?: number;
}

export type Quest = TaskDefinition;

export interface DailyState {
  dayKey: string;
  energy: EnergyLevel;
  energyConfirmed: boolean;
  completedQuestIds: QuestId[];
  dailyWin: boolean;
  rewardChoice?: string;
}

export interface Profile {
  displayName: string;
  nickname: string;
  avatarSeed: string;
  palette: PaletteId;
  theme: ThemeMode;
}

export interface GameState {
  profile: Profile;
  tasks: TaskDefinition[];
  days: Record<string, DailyState>;
  totalWins: number;
  gentleStreak: number;
  plantStage: PlantStage;
  hasSeenIntro: boolean;
  rewards: string[];
  rewardCatalogVersion: number;
  openedLoveCapsuleIds: string[];
}
