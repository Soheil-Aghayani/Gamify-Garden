import { describe, expect, it } from "vitest";
import { getDailyAvatar } from "./avatar";
import { getPersianDateSummary, getPersianGreeting, getSkyPhase } from "./date";
import { getDailyRewardOptions } from "./game";

describe("daily garden details", () => {
  it("keeps the daily avatar stable for a day and changes it on a new day", () => {
    const today = getDailyAvatar("fatemeh-apricity", "2026-08-15");
    const refreshed = getDailyAvatar("fatemeh-apricity", "2026-08-15");
    const tomorrow = getDailyAvatar("fatemeh-apricity", "2026-08-16");

    expect(refreshed).toEqual(today);
    expect(tomorrow.seed).not.toBe(today.seed);
    expect(["beam", "sunset", "bauhaus", "ring"]).toContain(tomorrow.variant);
  });

  it("rotates a compact set of reward suggestions by day", () => {
    const rewards = ["چای", "سریال", "موسیقی", "قدم‌زدن", "چرت", "بازی", "خوراکی"];
    const today = getDailyRewardOptions(rewards, "2026-08-15");
    const refreshed = getDailyRewardOptions(rewards, "2026-08-15");

    expect(today).toHaveLength(5);
    expect(new Set(today).size).toBe(5);
    expect(refreshed).toEqual(today);
  });

  it("formats the current day in the Persian calendar", () => {
    const summary = getPersianDateSummary(new Date(2026, 7, 15));

    expect(summary.weekday).toBeTruthy();
    expect(summary.date).toMatch(/[۰-۹]/);
    expect(summary.ariaLabel).toContain(summary.weekday);
  });

  it("greets Fatemeh according to the local time of day", () => {
    expect(getPersianGreeting(new Date(2026, 7, 15, 4, 59))).toBe("نیمه‌شبت بخیر");
    expect(getPersianGreeting(new Date(2026, 7, 15, 8, 0))).toBe("صبحت بخیر");
    expect(getPersianGreeting(new Date(2026, 7, 15, 13, 0))).toBe("ظهرت بخیر");
    expect(getPersianGreeting(new Date(2026, 7, 15, 18, 0))).toBe("عصرت بخیر");
    expect(getPersianGreeting(new Date(2026, 7, 15, 22, 0))).toBe("شبت بخیر");
  });

  it("moves the sky through dawn, day, sunset and night", () => {
    expect(getSkyPhase(new Date(2026, 7, 15, 7, 0))).toBe("dawn");
    expect(getSkyPhase(new Date(2026, 7, 15, 12, 0))).toBe("day");
    expect(getSkyPhase(new Date(2026, 7, 15, 18, 0))).toBe("sunset");
    expect(getSkyPhase(new Date(2026, 7, 15, 23, 0))).toBe("night");
  });
});
