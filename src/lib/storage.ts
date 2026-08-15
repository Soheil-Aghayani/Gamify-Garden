import { DEFAULT_TASKS } from "../data/quests";
import { DEFAULT_REWARDS, REWARD_CATALOG_VERSION } from "../data/rewards";
import { createInitialState, recalculateStats } from "./game";
import type { DailyState, GameState, MoodLevel, PaletteId, QuestId, TaskDefinition, TaskIconKey, ThemeMode } from "../types/game";

export const STORAGE_KEY = "gamify-garden:v1";

const TASK_ICON_KEYS: TaskIconKey[] = [
  "brain",
  "play",
  "languages",
  "book",
  "exercise",
  "writing",
  "sparkles",
  "star",
  "heart",
  "sun",
  "lightbulb",
];

function isQuestId(value: unknown): value is QuestId {
  return typeof value === "string" && value.trim().length > 0;
}

function isPalette(value: unknown): value is PaletteId {
  return value === "mint" || value === "lilac" || value === "peach";
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function isMoodLevel(value: unknown): value is MoodLevel {
  return value === "tired" || value === "calm" || value === "low" || value === "energized";
}

function isTaskIconKey(value: unknown): value is TaskIconKey {
  return typeof value === "string" && TASK_ICON_KEYS.includes(value as TaskIconKey);
}

function getEnergyCopy(candidate: Partial<TaskDefinition>, fallback: string) {
  const copy = candidate.energyCopy;
  return {
    1: typeof copy?.[1] === "string" ? copy[1] : fallback,
    2: typeof copy?.[2] === "string" ? copy[2] : fallback,
    3: typeof copy?.[3] === "string" ? copy[3] : `${fallback} یا کمی بیشتر`,
  };
}

function normalizeTask(value: unknown, index: number): TaskDefinition | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<TaskDefinition>;
  if (!isQuestId(candidate.id) || typeof candidate.title !== "string") return null;

  const title = candidate.title.trim().slice(0, 42);
  if (!title) return null;
  const minimumAction = typeof candidate.minimumAction === "string" && candidate.minimumAction.trim()
    ? candidate.minimumAction.trim().slice(0, 60)
    : "یک قدم کوچک";

  return {
    id: candidate.id.trim().slice(0, 80),
    title,
    minimumAction,
    energyCopy: getEnergyCopy(candidate, minimumAction),
    iconKey: isTaskIconKey(candidate.iconKey) ? candidate.iconKey : DEFAULT_TASKS[index]?.iconKey ?? "sparkles",
    isDefault: candidate.isDefault === true,
    createdAt: typeof candidate.createdAt === "number" ? candidate.createdAt : undefined,
  };
}

function normalizeDay(dayKey: string, value: unknown, tasks: TaskDefinition[]): DailyState | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<DailyState>;
  const availableIds = new Set(tasks.map((task) => task.id));
  const completedQuestIds = Array.isArray(candidate.completedQuestIds)
    ? candidate.completedQuestIds.filter(isQuestId).filter((id) => availableIds.has(id)).slice(0, Math.min(3, tasks.length))
    : [];
  const energy = candidate.energy === 2 || candidate.energy === 3 ? candidate.energy : 1;
  const target = Math.min(3, tasks.length);
  const dailyWin = target > 0 && completedQuestIds.length >= target;

  return {
    dayKey,
    energy,
    mood: isMoodLevel(candidate.mood)
      ? candidate.mood
      : energy === 3 ? "energized" : "calm",
    energyConfirmed: typeof candidate.energyConfirmed === "boolean" ? candidate.energyConfirmed : true,
    completedQuestIds,
    dailyWin,
    rewardChoice: dailyWin && typeof candidate.rewardChoice === "string" ? candidate.rewardChoice.slice(0, 80) : undefined,
  };
}

function normalizeState(value: unknown): GameState {
  const initial = createInitialState();
  if (!value || typeof value !== "object") return initial;

  const candidate = value as Partial<GameState> & {
    profile?: Partial<GameState["profile"]>;
    rewardCatalogVersion?: number;
  };

  const rawTasks = Array.isArray(candidate.tasks) ? candidate.tasks : DEFAULT_TASKS;
  const tasks = rawTasks
    .map((task, index) => normalizeTask(task, index))
    .filter((task): task is TaskDefinition => task !== null);
  const safeTasks = Array.isArray(candidate.tasks)
    ? tasks
    : DEFAULT_TASKS.map((task) => ({ ...task, energyCopy: { ...task.energyCopy } }));
  const days: Record<string, DailyState> = {};

  if (candidate.days && typeof candidate.days === "object") {
    Object.entries(candidate.days).forEach(([dayKey, day]) => {
      const normalized = normalizeDay(dayKey, day, safeTasks);
      if (normalized) days[dayKey] = normalized;
    });
  }

  const savedName = typeof candidate.profile?.displayName === "string" ? candidate.profile.displayName.trim() : "";
  const displayName = savedName && savedName !== "دوست من" ? savedName.slice(0, 24) : initial.profile.displayName;
  const avatarSeed = typeof candidate.profile?.avatarSeed === "string" && candidate.profile.avatarSeed.trim()
    ? candidate.profile.avatarSeed.trim().slice(0, 80)
    : initial.profile.avatarSeed;
  const savedRewards = Array.isArray(candidate.rewards)
    ? candidate.rewards.filter((reward): reward is string => typeof reward === "string")
      .map((reward) => reward.trim().slice(0, 42))
      .filter(Boolean)
      .filter((reward, index, list) => list.indexOf(reward) === index)
    : [];
  const rewards = (candidate.rewardCatalogVersion === REWARD_CATALOG_VERSION
    ? savedRewards
    : [...DEFAULT_REWARDS, ...savedRewards]
  ).filter((reward, index, list) => list.indexOf(reward) === index).slice(0, 20);
  const openedLoveCapsuleIds = Array.isArray(candidate.openedLoveCapsuleIds)
    ? candidate.openedLoveCapsuleIds
      .filter((id): id is string => typeof id === "string" && id.trim().length > 0)
      .map((id) => id.trim().slice(0, 80))
      .filter((id, index, list) => list.indexOf(id) === index)
      .slice(0, 100)
    : [];
  const savedLifetimeWins = typeof candidate.lifetimeWins === "number" && Number.isFinite(candidate.lifetimeWins)
    ? Math.max(0, Math.floor(candidate.lifetimeWins))
    : typeof candidate.totalWins === "number" && Number.isFinite(candidate.totalWins)
      ? Math.max(0, Math.floor(candidate.totalWins))
      : 0;

  return recalculateStats({
    ...initial,
    profile: {
      displayName,
      nickname:
        typeof candidate.profile?.nickname === "string" && candidate.profile.nickname.trim()
          ? candidate.profile.nickname.trim().slice(0, 24)
          : initial.profile.nickname,
      avatarSeed,
      palette: isPalette(candidate.profile?.palette) ? candidate.profile.palette : initial.profile.palette,
      theme: isThemeMode(candidate.profile?.theme) ? candidate.profile.theme : initial.profile.theme,
    },
    tasks: safeTasks,
    days,
    lifetimeWins: savedLifetimeWins,
    hasSeenIntro: typeof candidate.hasSeenIntro === "boolean" ? candidate.hasSeenIntro : true,
    rewards: rewards.length > 0 ? rewards : [...DEFAULT_REWARDS],
    rewardCatalogVersion: REWARD_CATALOG_VERSION,
    openedLoveCapsuleIds,
  });
}

export function loadGameState(): GameState {
  if (typeof window === "undefined") return createInitialState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeState(JSON.parse(raw)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable in private browsing; the in-memory app still works.
  }
}
