export type AvatarVariant = "beam" | "sunset" | "bauhaus" | "marble" | "ring";

const DAILY_VARIANTS: readonly AvatarVariant[] = ["beam", "sunset", "bauhaus", "ring"];

function hashValue(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

export interface DailyAvatar {
  seed: string;
  variant: AvatarVariant;
}

export function getDailyAvatar(baseSeed: string, dayKey: string): DailyAvatar {
  const dailySeed = `${baseSeed}:${dayKey}`;
  return {
    seed: dailySeed,
    variant: DAILY_VARIANTS[hashValue(dailySeed) % DAILY_VARIANTS.length],
  };
}
