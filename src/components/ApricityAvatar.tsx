import Avatar from "boring-avatars";
import type { PaletteId, PlantStage } from "../types/game";

const AVATAR_COLORS: Record<PaletteId, string[]> = {
  mint: ["#fffaf3", "#a9e3c8", "#6db797", "#ffd9c9", "#e8e0ff"],
  lilac: ["#fffaf3", "#d8c8ff", "#9272c5", "#f1d9ec", "#ffe7bb"],
  peach: ["#fffaf3", "#ffc8b6", "#d8896e", "#ffe3b9", "#c7e9dc"],
};

interface ApricityAvatarProps {
  seed: string;
  palette: PaletteId;
  stage: PlantStage;
  size?: number;
  label?: string;
}

export function ApricityAvatar({ seed, palette, stage, size = 64, label = "آواتار فاطمه" }: ApricityAvatarProps) {
  return (
    <span className={`apricity-avatar apricity-avatar--${stage}`} role="img" aria-label={label}>
      <span className="apricity-avatar__halo" aria-hidden="true" />
      <Avatar
        name={seed}
        variant="marble"
        colors={AVATAR_COLORS[palette]}
        size={size}
        title
        aria-hidden="true"
      />
      <span className="apricity-avatar__spark apricity-avatar__spark--one" aria-hidden="true">✦</span>
      <span className="apricity-avatar__spark apricity-avatar__spark--two" aria-hidden="true">·</span>
    </span>
  );
}
