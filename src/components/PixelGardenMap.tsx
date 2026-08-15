import { Lock, Plus } from "lucide-react";
import type { CSSProperties } from "react";
import { getSeedDefinition } from "../data/garden";
import { toPersianDigits } from "../lib/format";
import type { GardenSeedKind, PlantedGardenItem } from "../types/game";
import { PixelPlantArtwork } from "./PixelPlantArtwork";

interface PixelGardenMapProps {
  plantedItems: readonly PlantedGardenItem[];
  unlockedSlotIds: readonly string[];
  plantingKind: GardenSeedKind | null;
  movingItemId: string | null;
  selectedItemId: string | null;
  pendingTreeReady?: boolean;
  onSlotClick: (slotId: string, item?: PlantedGardenItem) => void;
}

const ALL_SLOT_IDS = Array.from({ length: 12 }, (_, index) => `plot-${index + 1}`);

const SOIL_PLOT_POSITIONS = [
  { left: "8%", top: "25%" },
  { left: "24%", top: "25%" },
  { left: "40%", top: "25%" },
  { left: "56%", top: "25%" },
  { left: "72%", top: "25%" },
  { left: "88%", top: "25%" },
  { left: "8%", top: "75%" },
  { left: "24%", top: "75%" },
  { left: "40%", top: "75%" },
  { left: "56%", top: "75%" },
  { left: "72%", top: "75%" },
  { left: "88%", top: "75%" },
] as const;

function plotStyle(index: number): CSSProperties {
  const position = SOIL_PLOT_POSITIONS[index];
  return {
    "--plot-left": position.left,
    "--plot-top": position.top,
  } as CSSProperties;
}

export function PixelGardenMap({
  plantedItems,
  unlockedSlotIds,
  plantingKind,
  movingItemId,
  selectedItemId,
  pendingTreeReady = false,
  onSlotClick,
}: PixelGardenMapProps) {
  return (
    <div className="pixel-garden-map pixel-garden-map--cozy" aria-label="نقشه‌ی باغ Apricity">
      <div className="pixel-garden-map__grass" aria-hidden="true">
        <span className="pixel-garden-map__sun-patch" />
        <span className="pixel-garden-map__path pixel-garden-map__path--main" />
        <span className="pixel-garden-map__path pixel-garden-map__path--side" />

        <span className="pixel-house" aria-hidden="true">
          <span className="pixel-house__roof" />
          <span className="pixel-house__wall" />
          <span className="pixel-house__door" />
          <span className="pixel-house__window pixel-house__window--one" />
          <span className="pixel-house__window pixel-house__window--two" />
          <span className="pixel-house__steps" />
        </span>

        <span className="pixel-well" aria-hidden="true">
          <span className="pixel-well__roof" />
          <span className="pixel-well__stone" />
          <span className="pixel-well__water" />
        </span>
        <span className="pixel-bench" aria-hidden="true" />
        <span className="pixel-mailbox" aria-hidden="true" />
        <span className="pixel-stump" aria-hidden="true" />
        <span className="pixel-tree pixel-tree--left" />
        <span className="pixel-tree pixel-tree--right" />
        <span className="pixel-bushes pixel-bushes--left" />
        <span className="pixel-bushes pixel-bushes--right" />
        <span className="pixel-fence pixel-fence--left" />
        <span className="pixel-fence pixel-fence--bottom" />
        <span className="pixel-character" aria-label="یک دوست کوچولوی باغ" role="img">
          <span className="pixel-character__hat" />
          <span className="pixel-character__head" />
          <span className="pixel-character__body" />
          <span className="pixel-character__legs" />
        </span>

        <span className="pixel-soil-patch pixel-soil-patch--main" />
        <span className="pixel-soil-patch pixel-soil-patch--left" />
        <span className="pixel-soil-patch pixel-soil-patch--right" />
        <span className="pixel-crop-row pixel-crop-row--one" />
        <span className="pixel-crop-row pixel-crop-row--two" />
        <span className="pixel-crop-row pixel-crop-row--three" />
        <span className="pixel-flower-cluster pixel-flower-cluster--one" />
        <span className="pixel-flower-cluster pixel-flower-cluster--two" />
      </div>

      {pendingTreeReady && (
        <div className="pixel-garden-map__preview" role="status" aria-label="درخت امروز آماده‌ی کاشت است">
          <PixelPlantArtwork kind="tree" />
          <span>درخت آماده</span>
        </div>
      )}

      <div className="pixel-garden-map__plot-field" role="grid" aria-label="جایگاه‌های کاشت باغ">
        {ALL_SLOT_IDS.map((slotId, index) => {
          const item = plantedItems.find((candidate) => candidate.slotId === slotId);
          const unlocked = unlockedSlotIds.includes(slotId);
          const isTarget = Boolean(plantingKind || movingItemId) && unlocked && !item;
          const isSelected = selectedItemId === item?.id;
          const isMoving = movingItemId === item?.id;
          return (
            <button
              key={slotId}
              type="button"
              role="gridcell"
              style={plotStyle(index)}
              className={`pixel-garden-plot${unlocked ? "" : " is-locked"}${item ? " is-occupied" : " is-empty"}${isTarget ? " is-target" : ""}${isSelected ? " is-selected" : ""}${isMoving ? " is-moving" : ""}`}
              onClick={() => onSlotClick(slotId, item)}
              disabled={!unlocked}
              aria-label={item
                ? `${getSeedDefinition(item.kind).label} در جایگاه ${toPersianDigits(index + 1)}`
                : unlocked
                  ? `جایگاه خالی ${toPersianDigits(index + 1)}`
                  : `جایگاه قفل است`}
            >
              {item ? <PixelPlantArtwork kind={item.kind} /> : unlocked ? <Plus size={14} aria-hidden="true" /> : <Lock size={13} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="pixel-garden-map__caption" aria-hidden="true">
        <span>زمین کوچولوی Apricity</span>
        <span>هر قدم، یک تکه‌ی سبزتر</span>
      </div>
    </div>
  );
}
