import { DEFAULT_TASKS } from "../data/quests";
import { DEFAULT_REWARDS, REWARD_CATALOG_VERSION } from "../data/rewards";
import { getDayKey, shiftDayKey } from "./date";
import type {
  DailyState,
  EnergyLevel,
  FlowStep,
  GameState,
  PlantStage,
  Profile,
  QuestId,
  TaskDefinition,
} from "../types/game";

export const DAILY_TARGET = 3;

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
    gentleStreak: 0,
    plantStage: "seed",
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
  return {
    ...state,
    totalWins,
    gentleStreak: getGentleStreak(state.days),
    plantStage: getLongTermPlantStage(totalWins),
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
