export type GardenDecorId = "flower" | "butterfly" | "bench" | "lamp" | "cat";

export interface GardenDecorDefinition {
  id: GardenDecorId;
  label: string;
  unlockAt: number;
  emoji: string;
}

export const GARDEN_DECOR: readonly GardenDecorDefinition[] = [
  { id: "flower", label: "گل کوچولو", unlockAt: 1, emoji: "🌼" },
  { id: "butterfly", label: "پروانه", unlockAt: 2, emoji: "🦋" },
  { id: "bench", label: "نیمکت دنج", unlockAt: 3, emoji: "🪑" },
  { id: "lamp", label: "چراغ شب", unlockAt: 4, emoji: "🏮" },
  { id: "cat", label: "گربه‌ی باغ", unlockAt: 5, emoji: "🐈" },
];

export function getUnlockedDecor(lifetimeWins: number): GardenDecorDefinition[] {
  return GARDEN_DECOR.filter((decor) => lifetimeWins >= decor.unlockAt);
}

export function getNextDecor(lifetimeWins: number): GardenDecorDefinition | undefined {
  return GARDEN_DECOR.find((decor) => lifetimeWins < decor.unlockAt);
}
