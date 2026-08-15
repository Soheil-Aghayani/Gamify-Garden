import { DEFAULT_TASKS } from "../data/quests";
import { DEFAULT_REWARDS, REWARD_CATALOG_VERSION } from "../data/rewards";
import { GARDEN_TREE_VARIANTS, isGardenTreeVariant } from "../data/garden";
import { getDayKey, shiftDayKey } from "./date";
import type {
  DailyState,
  EnergyLevel,
  FlowStep,
  GardenSeedKind,
  GardenTreeVariant,
  GameState,
  MoodLevel,
  PlantStage,
  PlantedGardenItem,
  Profile,
  QuestId,
  TaskDefinition,
} from "../types/game";

export const DAILY_TARGET = 3;
export const GARDEN_SLOT_COUNTS = [
  { unlockAt: 0, count: 6 },
  { unlockAt: 3, count: 8 },
  { unlockAt: 6, count: 10 },
  { unlockAt: 10, count: 12 },
] as const;

export const GARDEN_SEED_UNLOCKS: Record<Exclude<GardenSeedKind, "tree">, number> = {
  flower: 0,
  bush: 3,
};

export const MOOD_TO_ENERGY: Record<MoodLevel, EnergyLevel> = {
  tired: 1,
  calm: 2,
  low: 1,
  energized: 3,
};

export const DEFAULT_PROFILE: Profile = {
  displayName: "فاطمه",
  nickname: "Apricity",
  avatarSeed: "fatemeh-apricity",
  palette: "mint",
  theme: "light",
};

export function createEmptyDay(dayKey = getDayKey()): DailyState {
  return {
    dayKey,
    energy: 1,
    energyConfirmed: false,
    completedQuestIds: [],
    dailyWin: false,
  };
}

export function createInitialState(): GameState {
  return {
    profile: DEFAULT_PROFILE,
    tasks: DEFAULT_TASKS.map((task) => ({ ...task, energyCopy: { ...task.energyCopy } })),
    days: {},
    totalWins: 0,
    lifetimeWins: 0,
    gentleStreak: 0,
    plantStage: "seed",
    gardenPlantStage: "seed",
    plantedItems: [],
    hasSeenIntro: false,
    rewards: [...DEFAULT_REWARDS],
    rewardCatalogVersion: REWARD_CATALOG_VERSION,
    openedLoveCapsuleIds: [],
  };
}

export function getDayState(state: GameState, dayKey = getDayKey()): DailyState {
  return state.days[dayKey] ?? createEmptyDay(dayKey);
}

export function getDailyTarget(state: GameState): number {
  return Math.min(DAILY_TARGET, state.tasks.length);
}

export function getUnlockedGardenSlotCount(lifetimeWins: number): number {
  return GARDEN_SLOT_COUNTS.reduce<number>(
    (count, stage) => lifetimeWins >= stage.unlockAt ? stage.count : count,
    GARDEN_SLOT_COUNTS[0].count,
  );
}

export function getGardenSlotIds(lifetimeWins: number): string[] {
  return Array.from({ length: getUnlockedGardenSlotCount(lifetimeWins) }, (_, index) => `plot-${index + 1}`);
}

export function getPendingTreeSeeds(state: GameState): string[] {
  return Object.values(state.days)
    .filter((day) => day.dailyWin && !day.treeSeedClaimed)
    .map((day) => day.dayKey)
    .sort((left, right) => right.localeCompare(left));
}

export function isGardenSeedUnlocked(kind: GardenSeedKind, lifetimeWins: number, pendingTreeSeeds = 0): boolean {
  if (kind === "tree") return pendingTreeSeeds > 0;
  return lifetimeWins >= GARDEN_SEED_UNLOCKS[kind];
}

export function getMoodForDay(day: DailyState): MoodLevel {
  if (day.mood) return day.mood;
  if (day.energy === 3) return "energized";
  if (day.energy === 2) return "calm";
  return "calm";
}

function hashValue(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

export function getDailyRewardOptions(
  rewards: readonly string[],
  dayKey = getDayKey(),
  limit = 5,
): string[] {
  return [...rewards]
    .sort((left, right) => hashValue(`${dayKey}:${left}`) - hashValue(`${dayKey}:${right}`))
    .slice(0, Math.min(limit, rewards.length));
}

export function getFlowStep(state: GameState, dayKey = getDayKey()): FlowStep {
  const day = getDayState(state, dayKey);
  const target = getDailyTarget(state);

  if (!state.hasSeenIntro) return "intro";
  if (target === 0) return "manage";
  if (!day.energyConfirmed) return "energy";
  if (day.dailyWin && !day.treeSeedClaimed) return "plant";
  if (day.dailyWin) return day.rewardChoice ? "done" : "reward";
  return "tasks";
}

export function isDailyWin(completedCount: number, target: number): boolean {
  return target > 0 && completedCount >= target;
}

export function getDailyPlantStage(completedCount: number, target = DAILY_TARGET): PlantStage {
  if (target <= 0) return "seed";
  if (completedCount >= target) return "tree";
  if (completedCount >= Math.max(1, target - 1)) return "flower";
  if (completedCount > 0) return "sprout";
  return "seed";
}

export function getLongTermPlantStage(totalWins: number): PlantStage {
  if (totalWins >= 6) return "tree";
  if (totalWins >= 3) return "flower";
  if (totalWins >= 1) return "sprout";
  return "seed";
}

export function getDailyTreeSuggestion(dayKey = getDayKey()): GardenTreeVariant {
  const variantIndex = hashValue(`tree:${dayKey}`) % GARDEN_TREE_VARIANTS.length;
  return GARDEN_TREE_VARIANTS[variantIndex]?.id ?? "peach";
}

function isPlantStage(value: unknown): value is PlantStage {
  return value === "seed" || value === "sprout" || value === "flower" || value === "tree";
}

function getPlantStageRank(stage: PlantStage): number {
  return { seed: 0, sprout: 1, flower: 2, tree: 3 }[stage];
}

function getMoreMaturePlantStage(left: PlantStage, right: PlantStage): PlantStage {
  return getPlantStageRank(left) >= getPlantStageRank(right) ? left : right;
}

function getGentleStreak(days: Record<string, DailyState>): number {
  const winningDays = Object.values(days)
    .filter((day) => day.dailyWin)
    .sort((a, b) => b.dayKey.localeCompare(a.dayKey));

  if (winningDays.length === 0) return 0;

  let streak = 1;
  for (let index = 1; index < winningDays.length; index += 1) {
    const previousDay = shiftDayKey(winningDays[index - 1].dayKey, -1);
    if (previousDay !== winningDays[index].dayKey) break;
    streak += 1;
  }
  return streak;
}

export function recalculateStats(state: GameState): GameState {
  const totalWins = Object.values(state.days).filter((day) => day.dailyWin).length;
  const previousLifetimeWins = Number.isFinite(state.lifetimeWins) ? state.lifetimeWins : 0;
  const lifetimeWins = Math.max(previousLifetimeWins, totalWins);
  const longTermStage = getLongTermPlantStage(lifetimeWins);
  const savedGardenStage = isPlantStage(state.gardenPlantStage) ? state.gardenPlantStage : "seed";
  const gardenPlantStage = getMoreMaturePlantStage(savedGardenStage, longTermStage);
  return {
    ...state,
    totalWins,
    lifetimeWins,
    gentleStreak: getGentleStreak(state.days),
    plantStage: longTermStage,
    gardenPlantStage,
  };
}

export function updateToday(
  state: GameState,
  updater: (day: DailyState) => DailyState,
  dayKey = getDayKey(),
): GameState {
  const nextDay = updater(getDayState(state, dayKey));
  return recalculateStats({
    ...state,
    days: {
      ...state.days,
      [dayKey]: nextDay,
    },
  });
}

export interface ToggleQuestResult {
  state: GameState;
  blocked: boolean;
}

export function toggleQuest(
  state: GameState,
  questId: QuestId,
  dayKey = getDayKey(),
): ToggleQuestResult {
  const day = getDayState(state, dayKey);
  const target = getDailyTarget(state);
  const isComplete = day.completedQuestIds.includes(questId);
  const taskExists = state.tasks.some((task) => task.id === questId);

  if (!taskExists || (!isComplete && day.completedQuestIds.length >= target)) {
    return { state, blocked: true };
  }

  const completedQuestIds = isComplete
    ? day.completedQuestIds.filter((id) => id !== questId)
    : [...day.completedQuestIds, questId];

  const nextDay: DailyState = {
    ...day,
    completedQuestIds,
    dailyWin: isDailyWin(completedQuestIds.length, target),
    rewardChoice: isDailyWin(completedQuestIds.length, target) ? day.rewardChoice : undefined,
  };

  return {
    state: recalculateStats({
      ...state,
      days: {
        ...state.days,
        [dayKey]: nextDay,
      },
    }),
    blocked: false,
  };
}

export function addTask(state: GameState, task: TaskDefinition): GameState {
  if (state.tasks.some((existingTask) => existingTask.id === task.id)) return state;
  return {
    ...state,
    tasks: [...state.tasks, task],
  };
}

export function addReward(state: GameState, reward: string): GameState {
  const cleanReward = reward.trim().slice(0, 42);
  if (!cleanReward || state.rewards.includes(cleanReward)) return state;
  return { ...state, rewards: [...state.rewards, cleanReward] };
}

export function removeReward(state: GameState, reward: string): GameState {
  if (state.rewards.length <= 1) return state;
  return { ...state, rewards: state.rewards.filter((item) => item !== reward) };
}

export function restoreTask(
  state: GameState,
  task: TaskDefinition,
  completedBeforeRemoval: Record<string, boolean>,
): GameState {
  if (state.tasks.some((item) => item.id === task.id)) return state;
  const tasks = [...state.tasks, task];
  const target = Math.min(DAILY_TARGET, tasks.length);
  const days = Object.fromEntries(
    Object.entries(state.days).map(([dayKey, day]) => {
      const completedQuestIds = completedBeforeRemoval[dayKey] && !day.completedQuestIds.includes(task.id)
        ? [...day.completedQuestIds, task.id]
        : day.completedQuestIds;
      const dailyWin = isDailyWin(completedQuestIds.length, target);
      return [dayKey, { ...day, completedQuestIds, dailyWin, rewardChoice: dailyWin ? day.rewardChoice : undefined }];
    }),
  );

  return recalculateStats({ ...state, tasks, days });
}

export function removeTask(state: GameState, taskId: QuestId): GameState {
  const tasks = state.tasks.filter((task) => task.id !== taskId);
  const target = Math.min(DAILY_TARGET, tasks.length);
  const days = Object.fromEntries(
    Object.entries(state.days).map(([dayKey, day]) => {
      const completedQuestIds = day.completedQuestIds.filter((id) => id !== taskId);
      const dailyWin = isDailyWin(completedQuestIds.length, target);
      return [dayKey, { ...day, completedQuestIds, dailyWin, rewardChoice: dailyWin ? day.rewardChoice : undefined }];
    }),
  );

  return recalculateStats({ ...state, tasks, days });
}

export function setTodayEnergy(
  state: GameState,
  energy: EnergyLevel,
  dayKey = getDayKey(),
): GameState {
  return updateToday(state, (day) => ({ ...day, energy, energyConfirmed: true }), dayKey);
}

function makeGardenItemId(kind: GardenSeedKind, slotId: string): string {
  const randomPart = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `garden-${kind}-${slotId}-${randomPart}`;
}

function isValidGardenSeedKind(kind: string): kind is GardenSeedKind {
  return kind === "tree" || kind === "flower" || kind === "bush";
}

function isValidGardenSlot(slotId: string, lifetimeWins: number): boolean {
  return getGardenSlotIds(lifetimeWins).includes(slotId);
}

function isGardenSlotTaken(items: readonly PlantedGardenItem[], slotId: string, ignoredItemId?: string): boolean {
  return items.some((item) => item.slotId === slotId && item.id !== ignoredItemId);
}

export interface GardenMutationResult {
  state: GameState;
  blocked: boolean;
  item?: PlantedGardenItem;
}

export function claimTreeSeed(state: GameState, dayKey = getDayKey()): GameState {
  const day = getDayState(state, dayKey);
  if (!day.dailyWin || day.treeSeedClaimed) return state;
  return {
    ...state,
    days: {
      ...state.days,
      [dayKey]: { ...day, treeSeedClaimed: true },
    },
  };
}

export function plantGardenItem(
  state: GameState,
  kind: GardenSeedKind,
  slotId: string,
  sourceDayKey?: string,
  treeVariant?: GardenTreeVariant,
): GardenMutationResult {
  const pendingTreeSeeds = getPendingTreeSeeds(state);
  if (!isValidGardenSeedKind(kind)
    || !isValidGardenSlot(slotId, state.lifetimeWins)
    || isGardenSlotTaken(state.plantedItems, slotId)
    || !isGardenSeedUnlocked(kind, state.lifetimeWins, pendingTreeSeeds.length)) {
    return { state, blocked: true };
  }

  const resolvedSourceDayKey = kind === "tree"
    ? (sourceDayKey && pendingTreeSeeds.includes(sourceDayKey) ? sourceDayKey : pendingTreeSeeds[0])
    : sourceDayKey;
  if (kind === "tree" && !resolvedSourceDayKey) return { state, blocked: true };

  const resolvedTreeVariant = kind === "tree"
    ? (isGardenTreeVariant(treeVariant)
      ? treeVariant
      : getDailyTreeSuggestion(resolvedSourceDayKey))
    : undefined;

  const item: PlantedGardenItem = {
    id: makeGardenItemId(kind, slotId),
    kind,
    treeVariant: resolvedTreeVariant,
    slotId,
    plantedAt: Date.now(),
    sourceDayKey: resolvedSourceDayKey,
  };
  const nextState = kind === "tree" && resolvedSourceDayKey
    ? claimTreeSeed(state, resolvedSourceDayKey)
    : state;

  return {
    state: {
      ...nextState,
      plantedItems: [...nextState.plantedItems, item],
    },
    blocked: false,
    item,
  };
}

export function moveGardenItem(state: GameState, itemId: string, slotId: string): GardenMutationResult {
  const item = state.plantedItems.find((candidate) => candidate.id === itemId);
  if (!item || !isValidGardenSlot(slotId, state.lifetimeWins) || isGardenSlotTaken(state.plantedItems, slotId, itemId)) {
    return { state, blocked: true };
  }

  return {
    state: {
      ...state,
      plantedItems: state.plantedItems.map((candidate) => candidate.id === itemId ? { ...candidate, slotId } : candidate),
    },
    blocked: false,
    item: { ...item, slotId },
  };
}

export function removeGardenItem(state: GameState, itemId: string): GardenMutationResult {
  const item = state.plantedItems.find((candidate) => candidate.id === itemId);
  if (!item) return { state, blocked: true };
  return {
    state: {
      ...state,
      plantedItems: state.plantedItems.filter((candidate) => candidate.id !== itemId),
    },
    blocked: false,
    item,
  };
}

export function restoreGardenItem(state: GameState, item: PlantedGardenItem): GardenMutationResult {
  if (state.plantedItems.some((candidate) => candidate.id === item.id)
    || !isValidGardenSlot(item.slotId, state.lifetimeWins)
    || isGardenSlotTaken(state.plantedItems, item.slotId)) {
    return { state, blocked: true };
  }
  return {
    state: {
      ...state,
      plantedItems: [...state.plantedItems, item],
    },
    blocked: false,
    item,
  };
}

export function setTodayMood(
  state: GameState,
  mood: MoodLevel,
  dayKey = getDayKey(),
): GameState {
  return updateToday(state, (day) => ({
    ...day,
    mood,
    energy: MOOD_TO_ENERGY[mood],
    energyConfirmed: true,
  }), dayKey);
}

export function markIntroSeen(state: GameState): GameState {
  return { ...state, hasSeenIntro: true };
}

export function setTodayReward(
  state: GameState,
  rewardChoice: string,
  dayKey = getDayKey(),
): GameState {
  return updateToday(state, (day) => ({ ...day, rewardChoice }), dayKey);
}

export function setProfile(state: GameState, profile: Profile): GameState {
  return { ...state, profile };
}

export function openLoveCapsule(state: GameState, capsuleId: string): GameState {
  if (!capsuleId || state.openedLoveCapsuleIds.includes(capsuleId)) return state;
  return {
    ...state,
    openedLoveCapsuleIds: [...state.openedLoveCapsuleIds, capsuleId],
  };
}
