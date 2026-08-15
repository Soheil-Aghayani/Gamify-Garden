import { getTreeVariantDefinition } from "../data/garden";
import { getGardenAssetPath } from "../lib/assets";
import type { GardenSeedKind, GardenTreeVariant } from "../types/game";

interface GardenItemArtworkProps {
  kind: GardenSeedKind;
  treeVariant?: GardenTreeVariant;
  idPrefix: string;
}

const LABELS: Record<GardenSeedKind, string> = {
  tree: "درخت باغ",
  flower: "گل باغ",
  bush: "بوته‌ی باغ",
};

export function GardenItemArtwork({ kind, treeVariant = "peach", idPrefix }: GardenItemArtworkProps) {
  void idPrefix;
  const label = kind === "tree" ? `درخت ${getTreeVariantDefinition(treeVariant).label}` : LABELS[kind];
  return <img className={`garden-item-art garden-item-art--${kind}`} src={getGardenAssetPath(kind, treeVariant)} alt={label} draggable="false" />;
}
