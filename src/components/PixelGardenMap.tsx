import { Lock, Plus } from "lucide-react";
import type { CSSProperties } from "react";
import type { GardenDecorDefinition } from "../data/decor";
import { getSeedDefinition } from "../data/garden";
import { getGardenDecorAsset } from "../lib/assets";
import { toPersianDigits } from "../lib/format";
import type { GardenSeedKind, GardenTreeVariant, PlantedGardenItem } from "../types/game";
import { PixelPlantArtwork } from "./PixelPlantArtwork";

interface PixelGardenMapProps {
  plantedItems: readonly PlantedGardenItem[];
  unlockedSlotIds: readonly string[];
  plantingKind: GardenSeedKind | null;
  movingItemId: string | null;
  selectedItemId: string | null;
  unlockedDecor: readonly GardenDecorDefinition[];
  pendingTreeReady?: boolean;
  pendingTreeVariant?: GardenTreeVariant;
  onSlotClick: (slotId: string, item?: PlantedGardenItem) => void;
}

const ALL_SLOT_IDS = Array.from({ length: 12 }, (_, index) => `plot-${index + 1}`);

export function PixelGardenMap({
  plantedItems,
  unlockedSlotIds,
  plantingKind,
  movingItemId,
  selectedItemId,
  unlockedDecor,
  pendingTreeReady = false,
  pendingTreeVariant = "peach",
  onSlotClick,
}: PixelGardenMapProps) {
  return (
    <div className="pixel-garden-map pixel-garden-map--cozy" aria-label="نقشه‌ی باغ Apricity">
      <img className="pixel-garden-map__image" src={`${import.meta.env.BASE_URL}apricity-garden-map.webp`} alt="" aria-hidden="true" draggable="false" />

      <div className="pixel-garden-map__decor-layer" aria-label="دکورهای آزادشده‌ی باغ">
        {unlockedDecor.map((decor) => {
          const asset = getGardenDecorAsset(decor.id);
          return (
            <span key={decor.id} className={`pixel-garden-map__decor pixel-garden-map__decor--${decor.id}`} role="img" aria-label={`${decor.label} در باغ`}>
              {asset?.animated
                ? <span
                    className="pixel-garden-map__decor-sprite"
                    aria-hidden="true"
                    style={{ "--decor-sprite": `url(${asset.path})` } as CSSProperties}
                  />
                : asset
                  ? <img src={asset.path} alt="" draggable="false" />
                  : <span aria-hidden="true">{decor.emoji}</span>}
            </span>
          );
        })}
      </div>

      {pendingTreeReady && (
        <div className="pixel-garden-map__preview" role="status" aria-label="درخت امروز آماده‌ی کاشت است">
          <PixelPlantArtwork kind="tree" treeVariant={pendingTreeVariant} />
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
              className={`pixel-garden-plot${unlocked ? "" : " is-locked"}${item ? " is-occupied" : " is-empty"}${isTarget ? " is-target" : ""}${isSelected ? " is-selected" : ""}${isMoving ? " is-moving" : ""}`}
              onClick={() => onSlotClick(slotId, item)}
              disabled={!unlocked}
              aria-label={item
                ? `${getSeedDefinition(item.kind).label} در جایگاه ${toPersianDigits(index + 1)}`
                : unlocked
                  ? `جایگاه خالی ${toPersianDigits(index + 1)}`
                  : `جایگاه قفل است`}
            >
              {item
                ? <PixelPlantArtwork kind={item.kind} treeVariant={item.treeVariant} />
                : unlocked
                  ? <Plus size={14} aria-hidden="true" />
                  : <Lock size={13} aria-hidden="true" />}
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
