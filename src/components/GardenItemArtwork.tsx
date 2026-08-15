import type { GardenSeedKind } from "../types/game";
import { PlantArtwork } from "./PlantArtwork";

interface GardenItemArtworkProps {
  kind: GardenSeedKind;
  idPrefix: string;
}

const LABELS: Record<GardenSeedKind, string> = {
  tree: "درخت باغ",
  flower: "گل باغ",
  bush: "بوته‌ی باغ",
};

export function GardenItemArtwork({ kind, idPrefix }: GardenItemArtworkProps) {
  if (kind === "tree") return <PlantArtwork stage="tree" idPrefix={idPrefix} />;

  return (
    <svg className={`garden-item-art garden-item-art--${kind}`} viewBox="0 0 120 100" role="img" aria-label={LABELS[kind]}>
      <ellipse className="garden-item-art__ground" cx="60" cy="88" rx="42" ry="8" />
      {kind === "flower" ? (
        <>
          <path className="garden-item-art__stem" d="M60 85c-1-20 2-35 8-48" />
          <path className="garden-item-art__leaf" d="M58 67c-16-2-22-10-22-22 14 0 23 7 22 22Z" />
          <g className="garden-item-art__petals">
            <circle cx="68" cy="32" r="14" />
            <circle cx="50" cy="35" r="13" />
            <circle cx="61" cy="20" r="13" />
            <circle cx="61" cy="46" r="13" />
            <circle className="garden-item-art__center" cx="61" cy="33" r="9" />
          </g>
        </>
      ) : (
        <>
          <path className="garden-item-art__stem" d="M60 86c0-20 1-33 0-45" />
          <circle className="garden-item-art__bush garden-item-art__bush--one" cx="42" cy="48" r="20" />
          <circle className="garden-item-art__bush garden-item-art__bush--two" cx="70" cy="42" r="25" />
          <circle className="garden-item-art__bush garden-item-art__bush--three" cx="86" cy="58" r="16" />
          <circle className="garden-item-art__berry" cx="58" cy="38" r="3" />
          <circle className="garden-item-art__berry" cx="78" cy="52" r="3" />
        </>
      )}
    </svg>
  );
}
