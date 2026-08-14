import { getDayKey, shiftDayKey } from "./date";
import type {
  DailyState,
  EnergyLevel,
  GameState,
  PlantStage,
  Profile,
  QuestId,
} from "../types/game";

export const DAILY_TARGET = 3;

export const DEFAULT_PROFILE: Profile = {
  displayName: "دوست من",
  palette: "mint",
};

export function createEmptyDay(dayKey = getDayKey()): DailyState {
  return {
    dayKey,
    energy: 1,
    completedQuestIds: [],
    dailyWin: false,
  };
}

export function createInitialState(): GameState {
  return {
    profile: DEFAULT_PROFILE,
    days: {},
    totalWins: 0,
    gentleStreak: 0,
    plantStage: "seed",
  };
}

export function getDayState(state: GameState, dayKey = getDayKey()): DailyState {
  return state.days[dayKey] ?? createEmptyDay(dayKey);
}

export function getDailyPlantStage(completedCount: number): PlantStage {
  if (completedCount >= DAILY_TARGET) return "tree";
  if (completedCount === 2) return "flower";
  if (completedCount === 1) return "sprout";
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
  const isComplete = day.completedQuestIds.includes(questId);

  if (!isComplete && day.completedQuestIds.length >= DAILY_TARGET) {
    return { state, blocked: true };
  }

  const completedQuestIds = isComplete
    ? day.completedQuestIds.filter((id) => id !== questId)
    : [...day.completedQuestIds, questId];

  const nextDay: DailyState = {
    ...day,
    completedQuestIds,
    dailyWin: completedQuestIds.length >= DAILY_TARGET,
    rewardChoice: completedQuestIds.length >= DAILY_TARGET ? day.rewardChoice : undefined,
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

export function setTodayEnergy(
  state: GameState,
  energy: EnergyLevel,
  dayKey = getDayKey(),
): GameState {
  return updateToday(state, (day) => ({ ...day, energy }), dayKey);
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
