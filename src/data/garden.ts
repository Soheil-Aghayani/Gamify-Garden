import type { GardenSeedKind, GardenTreeVariant } from "../types/game";

export interface GardenSeedDefinition {
  kind: GardenSeedKind;
  label: string;
  copy: string;
  emoji: string;
  color: "mint" | "peach" | "lilac";
}

export const GARDEN_SEEDS: readonly GardenSeedDefinition[] = [
  { kind: "tree", label: "درخت امروز", copy: "جایزه‌ی سه قدم قشنگ", emoji: "🌳", color: "mint" },
  { kind: "flower", label: "گل شروع", copy: "یک دانه‌ی کوچولو برای شروع باغ", emoji: "🌼", color: "peach" },
  { kind: "bush", label: "دانه‌ی بوته", copy: "بعد از سه برد آزاد می‌شود", emoji: "🌿", color: "lilac" },
];

export interface GardenTreeVariantDefinition {
  id: GardenTreeVariant;
  label: string;
  emoji: string;
  copy: string;
}

export const GARDEN_TREE_VARIANTS: readonly GardenTreeVariantDefinition[] = [
  { id: "peach", label: "هلو", emoji: "🍑", copy: "گرم و آفتابی" },
  { id: "apple", label: "سیب", emoji: "🍎", copy: "سبز و پُرثمر" },
  { id: "cherry", label: "شکوفه‌ی گیلاس", emoji: "🌸", copy: "نرم و بهاری" },
  { id: "lemon", label: "لیمو", emoji: "🍋", copy: "روشن و پرانرژی" },
];

export function isGardenTreeVariant(value: unknown): value is GardenTreeVariant {
  return GARDEN_TREE_VARIANTS.some((variant) => variant.id === value);
}

export function getTreeVariantDefinition(variant: GardenTreeVariant): GardenTreeVariantDefinition {
  return GARDEN_TREE_VARIANTS.find((item) => item.id === variant) ?? GARDEN_TREE_VARIANTS[0];
}

export function getSeedDefinition(kind: GardenSeedKind): GardenSeedDefinition {
  return GARDEN_SEEDS.find((seed) => seed.kind === kind) ?? GARDEN_SEEDS[0];
}
