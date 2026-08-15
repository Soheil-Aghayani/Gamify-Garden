import type { GardenSeedKind } from "../types/game";

interface PixelPlantArtworkProps {
  kind: GardenSeedKind;
}

const LABELS: Record<GardenSeedKind, string> = {
  tree: "درخت باغ",
  flower: "گل باغ",
  bush: "بوته‌ی باغ",
};

export function PixelPlantArtwork({ kind }: PixelPlantArtworkProps) {
  return (
    <span className={`pixel-plant pixel-plant--${kind}`} role="img" aria-label={LABELS[kind]}>
      <span className="pixel-plant__shadow" aria-hidden="true" />
      <span className="pixel-plant__trunk" aria-hidden="true" />
      <span className="pixel-plant__canopy pixel-plant__canopy--one" aria-hidden="true" />
      <span className="pixel-plant__canopy pixel-plant__canopy--two" aria-hidden="true" />
      <span className="pixel-plant__canopy pixel-plant__canopy--three" aria-hidden="true" />
      <span className="pixel-plant__petal pixel-plant__petal--one" aria-hidden="true" />
      <span className="pixel-plant__petal pixel-plant__petal--two" aria-hidden="true" />
      <span className="pixel-plant__berry pixel-plant__berry--one" aria-hidden="true" />
      <span className="pixel-plant__berry pixel-plant__berry--two" aria-hidden="true" />
    </span>
  );
}
