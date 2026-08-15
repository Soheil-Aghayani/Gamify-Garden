import { LOVE_CAPSULES, type LoveCapsule } from "../data/loveCapsules";

function hashValue(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Chooses a stable capsule for the day so the same note remains open after a
 * refresh. The opened-id list is tracked separately by the game state.
 */
export function getDailyLoveCapsule(dayKey: string): LoveCapsule {
  const ordered = [...LOVE_CAPSULES].sort(
    (left, right) => hashValue(`${dayKey}:${left.id}`) - hashValue(`${dayKey}:${right.id}`),
  );
  return ordered[0];
}
