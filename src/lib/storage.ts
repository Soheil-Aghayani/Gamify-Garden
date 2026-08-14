import { createInitialState, recalculateStats } from "./game";
import type { DailyState, GameState, PaletteId, QuestId } from "../types/game";

export const STORAGE_KEY = "gamify-garden:v1";

const QUEST_IDS: QuestId[] = [
  "llm",
  "article-video",
  "language",
  "article",
  "exercise",
  "writing",
];

function isQuestId(value: unknown): value is QuestId {
  return typeof value === "string" && QUEST_IDS.includes(value as QuestId);
}

function isPalette(value: unknown): value is PaletteId {
  return value === "mint" || value === "lilac" || value === "peach";
}

function normalizeDay(dayKey: string, value: unknown): DailyState | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<DailyState>;
  const completedQuestIds = Array.isArray(candidate.completedQuestIds)
    ? candidate.completedQuestIds.filter(isQuestId).slice(0, 3)
    : [];
  const energy = candidate.energy === 2 || candidate.energy === 3 ? candidate.energy : 1;

  return {
    dayKey,
    energy,
    completedQuestIds,
    dailyWin: completedQuestIds.length >= 3,
    rewardChoice: typeof candidate.rewardChoice === "string" ? candidate.rewardChoice : undefined,
  };
}

function normalizeState(value: unknown): GameState {
  const initial = createInitialState();
  if (!value || typeof value !== "object") return initial;

  const candidate = value as Partial<GameState> & {
    profile?: Partial<GameState["profile"]>;
  };
  const days: Record<string, DailyState> = {};

  if (candidate.days && typeof candidate.days === "object") {
    Object.entries(candidate.days).forEach(([dayKey, day]) => {
      const normalized = normalizeDay(dayKey, day);
      if (normalized) days[dayKey] = normalized;
    });
  }

  return recalculateStats({
    ...initial,
    profile: {
      displayName:
        typeof candidate.profile?.displayName === "string" && candidate.profile.displayName.trim()
          ? candidate.profile.displayName.trim().slice(0, 24)
          : initial.profile.displayName,
      palette: isPalette(candidate.profile?.palette) ? candidate.profile.palette : initial.profile.palette,
    },
    days,
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
