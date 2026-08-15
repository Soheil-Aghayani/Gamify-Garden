import { getTreeVariantDefinition } from "../data/garden";
import { getGardenAssetPath } from "../lib/assets";
import type { GardenSeedKind, GardenTreeVariant } from "../types/game";

interface PixelPlantArtworkProps {
  kind: GardenSeedKind;
  treeVariant?: GardenTreeVariant;
}

const LABELS: Record<GardenSeedKind, string> = {
  tree: "درخت باغ",
  flower: "گل باغ",
  bush: "بوته‌ی باغ",
};

export function PixelPlantArtwork({ kind, treeVariant = "peach" }: PixelPlantArtworkProps) {
  const label = kind === "tree" ? `درخت ${getTreeVariantDefinition(treeVariant).label}` : LABELS[kind];
  return <img className={`pixel-plant pixel-plant--${kind}`} src={getGardenAssetPath(kind, treeVariant)} alt={label} draggable="false" />;
}
