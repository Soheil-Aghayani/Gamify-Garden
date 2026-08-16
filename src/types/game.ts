export type QuestId = string;

export type EnergyLevel = 1 | 2 | 3;
export type MoodLevel = "tired" | "calm" | "low" | "energized";
export type PlantStage = "seed" | "sprout" | "flower" | "tree";
export type GardenSeedKind = "tree" | "flower" | "bush";
export type GardenTreeVariant = "peach" | "apple" | "cherry" | "lemon";
export type PaletteId = "mint" | "lilac" | "peach";
export type ThemeMode = "light" | "dark" | "system";
export type FlowStep = "intro" | "energy" | "tasks" | "plant" | "reward" | "done" | "manage";
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
  mood?: MoodLevel;
  energyConfirmed: boolean;
  completedQuestIds: QuestId[];
  dailyWin: boolean;
  treeSeedClaimed?: boolean;
  rewardChoice?: string;
}

export interface PlantedGardenItem {
  id: string;
  kind: GardenSeedKind;
  treeVariant?: GardenTreeVariant;
  slotId: string;
  plantedAt: number;
  sourceDayKey?: string;
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
  lifetimeWins: number;
  gentleStreak: number;
  plantStage: PlantStage;
  gardenPlantStage: PlantStage;
  plantedItems: PlantedGardenItem[];
  hasSeenIntro: boolean;
  rewards: string[];
  rewardCatalogVersion: number;
  openedLoveCapsuleIds: string[];
}
