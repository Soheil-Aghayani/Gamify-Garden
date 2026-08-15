import type { GardenSeedKind } from "../types/game";

export interface GardenSeedDefinition {
  kind: GardenSeedKind;
  label: string;
  copy: string;
  emoji: string;
  color: "mint" | "peach" | "lilac";
}

export const GARDEN_SEEDS: readonly GardenSeedDefinition[] = [
  { kind: "tree", label: "درخت امروز", copy: "جایزه‌ی سه قدم قشنگ", emoji: "🌳", color: "mint" },
  { kind: "flower", label: "دانه‌ی گل", copy: "بعد از اولین برد آزاد می‌شود", emoji: "🌼", color: "peach" },
  { kind: "bush", label: "دانه‌ی بوته", copy: "بعد از سه برد آزاد می‌شود", emoji: "🌿", color: "lilac" },
];

export function getSeedDefinition(kind: GardenSeedKind): GardenSeedDefinition {
  return GARDEN_SEEDS.find((seed) => seed.kind === kind) ?? GARDEN_SEEDS[0];
}
