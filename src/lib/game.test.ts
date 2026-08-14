import { describe, expect, it } from "vitest";
import {
  addTask,
  addReward,
  createInitialState,
  getDailyPlantStage,
  getDailyTarget,
  getFlowStep,
  getLongTermPlantStage,
  markIntroSeen,
  removeTask,
  restoreTask,
  setTodayEnergy,
  setTodayReward,
  toggleQuest,
} from "./game";
import { getDayKey, shiftDayKey } from "./date";
import type { GameState, QuestId } from "../types/game";

const DAY = "2026-08-15";
const QUESTS: QuestId[] = ["llm", "article-video", "language", "article"];

function freshState(): GameState {
  return createInitialState();
}

describe("Gamify Garden game rules", () => {
  it("uses the browser-local calendar day key", () => {
    expect(getDayKey(new Date(2026, 7, 15))).toBe(DAY);
    expect(shiftDayKey(DAY, 1)).toBe("2026-08-16");
    expect(shiftDayKey(DAY, -1)).toBe("2026-08-14");
  });

  it("marks a day as won after three quests", () => {
    let state = freshState();

    QUESTS.slice(0, 3).forEach((questId) => {
      state = toggleQuest(state, questId, DAY).state;
    });

    expect(state.days[DAY].completedQuestIds).toHaveLength(3);
    expect(state.days[DAY].dailyWin).toBe(true);
    expect(state.totalWins).toBe(1);
    expect(state.gentleStreak).toBe(1);
  });

  it("does not allow a fourth quest, but does allow undoing a selected quest", () => {
    let state = freshState();
    QUESTS.slice(0, 3).forEach((questId) => {
      state = toggleQuest(state, questId, DAY).state;
    });

    const blocked = toggleQuest(state, QUESTS[3], DAY);
    expect(blocked.blocked).toBe(true);
    expect(blocked.state.days[DAY].completedQuestIds).toHaveLength(3);

    const undone = toggleQuest(state, QUESTS[1], DAY);
    expect(undone.blocked).toBe(false);
    expect(undone.state.days[DAY].completedQuestIds).toHaveLength(2);
    expect(undone.state.days[DAY].dailyWin).toBe(false);
  });

  it("keeps a gentle streak across consecutive winning days", () => {
    let state = freshState();
    state = {
      ...state,
      days: {
        "2026-08-13": { dayKey: "2026-08-13", energy: 1, energyConfirmed: true, completedQuestIds: QUESTS.slice(0, 3), dailyWin: true },
        "2026-08-14": { dayKey: "2026-08-14", energy: 2, energyConfirmed: true, completedQuestIds: QUESTS.slice(0, 3), dailyWin: true },
      },
    };
    state = toggleQuest(state, "llm", DAY).state;
    state = toggleQuest(state, "article-video", DAY).state;
    state = toggleQuest(state, "language", DAY).state;

    expect(state.gentleStreak).toBe(3);
    expect(state.totalWins).toBe(3);
  });

  it("moves the plant through daily and long-term stages", () => {
    expect(getDailyPlantStage(0)).toBe("seed");
    expect(getDailyPlantStage(1)).toBe("sprout");
    expect(getDailyPlantStage(2)).toBe("flower");
    expect(getDailyPlantStage(3)).toBe("tree");
    expect(getLongTermPlantStage(0)).toBe("seed");
    expect(getLongTermPlantStage(3)).toBe("flower");
    expect(getLongTermPlantStage(6)).toBe("tree");
  });

  it("supports custom tasks and adapts the daily target when tasks are removed", () => {
    let state = freshState();
    const customTask = {
      id: "custom-room",
      title: "مرتب‌کردن اتاق",
      minimumAction: "پنج دقیقه",
      energyCopy: { 1: "پنج دقیقه", 2: "پنج دقیقه", 3: "پنج دقیقه یا بیشتر" },
      iconKey: "sparkles" as const,
      isDefault: false,
    };

    state = addTask(state, customTask);
    expect(state.tasks.some((task) => task.id === "custom-room")).toBe(true);
    expect(getDailyTarget(state)).toBe(3);

    state = removeTask(state, "llm");
    expect(state.tasks.some((task) => task.id === "llm")).toBe(false);
    expect(getDailyTarget(state)).toBe(3);
  });

  it("moves through the gentle daily flow", () => {
    let state = freshState();

    expect(getFlowStep(state, DAY)).toBe("intro");
    state = markIntroSeen(state);
    expect(getFlowStep(state, DAY)).toBe("energy");

    state = setTodayEnergy(state, 2, DAY);
    expect(getFlowStep(state, DAY)).toBe("tasks");
    QUESTS.slice(0, 3).forEach((questId) => {
      state = toggleQuest(state, questId, DAY).state;
    });

    expect(getFlowStep(state, DAY)).toBe("reward");
    state = setTodayReward(state, "یک نوشیدنی خوشمزه", DAY);
    expect(getFlowStep(state, DAY)).toBe("done");
  });

  it("restores a removed task without losing its previous completion", () => {
    let state = freshState();
    state = toggleQuest(state, "llm", DAY).state;
    const completedBeforeRemoval = { [DAY]: true };
    state = removeTask(state, "llm");
    expect(state.days[DAY].completedQuestIds).not.toContain("llm");

    state = restoreTask(state, {
      id: "llm",
      title: "LLM",
      minimumAction: "یک قدم کوچک",
      energyCopy: { 1: "فقط فایل را باز کن", 2: "ده دقیقه جلو برو", 3: "یک بخش را تمام کن" },
      iconKey: "brain",
      isDefault: true,
    }, completedBeforeRemoval);

    expect(state.days[DAY].completedQuestIds).toContain("llm");
  });

  it("supports adding custom rewards without duplicates", () => {
    let state = freshState();
    state = addReward(state, "چای و موسیقی");
    state = addReward(state, "چای و موسیقی");

    expect(state.rewards).toContain("چای و موسیقی");
    expect(state.rewards.filter((reward) => reward === "چای و موسیقی")).toHaveLength(1);
  });
});
