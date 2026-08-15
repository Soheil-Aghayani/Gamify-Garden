import { describe, expect, it } from "vitest";
import { getNextDecor, getUnlockedDecor } from "./decor";

describe("garden decor unlocks", () => {
  it("unlocks one new garden detail per lifetime win", () => {
    expect(getUnlockedDecor(0)).toHaveLength(0);
    expect(getUnlockedDecor(1).map((decor) => decor.id)).toEqual(["flower"]);
    expect(getUnlockedDecor(3).map((decor) => decor.id)).toEqual(["flower", "butterfly", "bench"]);
    expect(getUnlockedDecor(99)).toHaveLength(5);
  });

  it("points gently to the next detail without taking old ones away", () => {
    expect(getNextDecor(0)?.id).toBe("flower");
    expect(getNextDecor(4)?.id).toBe("cat");
    expect(getNextDecor(5)).toBeUndefined();
    expect(getUnlockedDecor(4).length).toBeLessThanOrEqual(getUnlockedDecor(5).length);
  });
});
