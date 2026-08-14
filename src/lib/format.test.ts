import { describe, expect, it } from "vitest";
import { toPersianDigits, toPersianPercent } from "./format";

describe("Persian number formatting", () => {
  it("converts Latin digits inside text", () => {
    expect(toPersianDigits("3 قدم و 12٪")).toBe("۳ قدم و ۱۲٪");
  });

  it("formats a percentage with Persian digits and symbol", () => {
    expect(toPersianPercent(67)).toBe("۶۷٪");
  });
});
