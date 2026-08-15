import { describe, expect, it } from "vitest";
import { getDailyLoveCapsule } from "./love";

describe("love capsules", () => {
  it("chooses the same capsule for the same day", () => {
    const firstChoice = getDailyLoveCapsule("2026-08-15");
    const secondChoice = getDailyLoveCapsule("2026-08-15");

    expect(secondChoice.id).toBe(firstChoice.id);
  });

  it("changes its choice with the calendar day", () => {
    const todayChoice = getDailyLoveCapsule("2026-08-15");
    const tomorrowChoice = getDailyLoveCapsule("2026-08-16");

    expect(todayChoice.id).not.toBe(tomorrowChoice.id);
  });
});
