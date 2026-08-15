import { Lock, MapPin, Move, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useState, type Ref } from "react";
import { GARDEN_DECOR, getNextDecor } from "../data/decor";
import { GARDEN_SEEDS, getSeedDefinition } from "../data/garden";
import {
  GARDEN_SLOT_COUNTS,
  getGardenSlotIds,
  getUnlockedGardenSlotCount,
  isGardenSeedUnlocked,
} from "../lib/game";
import { toPersianDigits } from "../lib/format";
import type { GardenSeedKind, PlantedGardenItem } from "../types/game";
import { PixelGardenMap } from "./PixelGardenMap";

interface GardenDecorProps {
  lifetimeWins: number;
  plantedItems: readonly PlantedGardenItem[];
  pendingTreeSeedDays: readonly string[];
  deferredTreePlanting?: boolean;
  isNext: boolean;
  sectionRef?: Ref<HTMLElement>;
  onPlant: (kind: GardenSeedKind, slotId: string, sourceDayKey?: string) => void;
  onDefer: () => void;
  onMove: (itemId: string, slotId: string) => void;
  onRemove: (itemId: string) => void;
}

export function GardenDecor({
  lifetimeWins,
  plantedItems,
  pendingTreeSeedDays,
  deferredTreePlanting = false,
  isNext,
  sectionRef,
  onPlant,
  onDefer,
  onMove,
  onRemove,
}: GardenDecorProps) {
  const nextDecor = getNextDecor(lifetimeWins);
  const unlockedSlotCount = getUnlockedGardenSlotCount(lifetimeWins);
  const unlockedSlotIds = getGardenSlotIds(lifetimeWins);
  const pendingTreeCount = pendingTreeSeedDays.length;
  const hasPendingTree = pendingTreeCount > 0;

  const [plantingKind, setPlantingKind] = useState<GardenSeedKind | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [movingItemId, setMovingItemId] = useState<string | null>(null);

  const selectedItem = plantedItems.find((item) => item.id === selectedItemId);
  const movingItem = plantedItems.find((item) => item.id === movingItemId);

  useEffect(() => {
    if (selectedItemId && !plantedItems.some((item) => item.id === selectedItemId)) setSelectedItemId(null);
    if (movingItemId && !plantedItems.some((item) => item.id === movingItemId)) setMovingItemId(null);
    if (plantingKind === "tree" && pendingTreeCount === 0) setPlantingKind(null);
  }, [movingItemId, pendingTreeCount, plantedItems, plantingKind, selectedItemId]);

  const chooseSeed = (kind: GardenSeedKind) => {
    if (!isGardenSeedUnlocked(kind, lifetimeWins, pendingTreeCount)) return;
    setSelectedItemId(null);
    setMovingItemId(null);
    setPlantingKind((current) => current === kind ? null : kind);
  };

  const handleSlotClick = (slotId: string, item?: PlantedGardenItem) => {
    const isUnlocked = unlockedSlotIds.includes(slotId);
    if (!isUnlocked) return;

    if (movingItemId) {
      if (!item || item.id === movingItemId) {
        if (item?.id === movingItemId) {
          setMovingItemId(null);
          setSelectedItemId(item.id);
        } else {
          onMove(movingItemId, slotId);
          setMovingItemId(null);
          setSelectedItemId(null);
        }
      }
      return;
    }

    if (plantingKind) {
      if (!item) {
        onPlant(plantingKind, slotId, plantingKind === "tree" ? pendingTreeSeedDays[0] : undefined);
        setPlantingKind(null);
        return;
      }
      setPlantingKind(null);
    }

    if (item) {
      setSelectedItemId((current) => current === item.id ? null : item.id);
    }
  };

  const handleRemove = () => {
    if (!selectedItem) return;
    onRemove(selectedItem.id);
    setSelectedItemId(null);
  };

  const seedOptions = GARDEN_SEEDS.map((seed) => {
    const unlocked = isGardenSeedUnlocked(seed.kind, lifetimeWins, pendingTreeCount);
    const selected = plantingKind === seed.kind;
    const isTreePending = seed.kind === "tree" && pendingTreeCount > 0;
    const hint = isTreePending
      ? `${toPersianDigits(pendingTreeCount)} دانه`
      : seed.kind === "flower" && lifetimeWins === 0
        ? "دانه‌ی شروع"
        : unlocked
          ? "آزاد است"
          : seed.copy;
    return (
      <button
        key={seed.kind}
        type="button"
        className={`garden-seed-option garden-seed-option--${seed.color}${selected ? " is-selected" : ""}${!unlocked ? " is-locked" : ""}`}
        onClick={() => chooseSeed(seed.kind)}
        disabled={!unlocked}
        aria-pressed={selected}
        title={seed.copy}
      >
        <span className="garden-seed-option__emoji" aria-hidden="true">{unlocked ? seed.emoji : <Lock size={16} />}</span>
        <span className="garden-seed-option__copy">
          <strong>{seed.label}</strong>
          <small>{hint}</small>
        </span>
      </button>
    );
  });

  return (
    <section
      ref={sectionRef}
      tabIndex={-1}
      className={`decor-card soft-card${isNext ? " is-flow-next" : ""}`}
      aria-labelledby="decor-title"
    >
      <div className="decor-card__heading">
        <div className="decor-card__title">
          <span className="decor-card__icon" aria-hidden="true"><Sparkles size={18} /></span>
          <div>
            <p className="eyebrow">باغ کوچولوی من</p>
            <h2 id="decor-title">هر برد، یک چیز قشنگ‌تر</h2>
          </div>
        </div>
        <span className={`tiny-badge${isNext ? " tiny-badge--flow" : ""}`}>
          {hasPendingTree
            ? `${toPersianDigits(pendingTreeCount)} درخت آماده‌ی کاشت`
            : `${toPersianDigits(plantedItems.length)} از ${toPersianDigits(unlockedSlotCount)} جایگاه`}
        </span>
      </div>

      <div className="garden-quickbar" aria-label="نوار کاشت باغ">
        <div className="garden-quickbar__copy">
          <span className="garden-quickbar__icon" aria-hidden="true">🌱</span>
          <span>
            <strong>نوار کاشت</strong>
            <small>{plantingKind ? "حالا یک جای خالی را لمس کن" : "یک دانه را انتخاب کن و بکار"}</small>
          </span>
        </div>
        <div className="garden-seed-tray garden-seed-tray--quick">
          {seedOptions}
        </div>
      </div>

      <div className="garden-board" aria-label="باغ قابل کاشت">
        <div className="garden-board__heading">
          <div>
            <p className="eyebrow">زمین‌های کوچیک باغ</p>
            <strong>{hasPendingTree ? "درختت آماده‌ست؛ یک جای خوب براش پیدا کن" : "هر چیزی که دوست داری اینجا بکار"}</strong>
          </div>
          <span className="garden-board__capacity"><MapPin size={14} /> {toPersianDigits(plantedItems.length)} / {toPersianDigits(unlockedSlotCount)}</span>
        </div>

        {plantingKind && (
          <div className="garden-board__instruction" role="status">
            <span aria-hidden="true">{getSeedDefinition(plantingKind).emoji}</span>
            <span>حالا روی یک جای خالی بزن تا {getSeedDefinition(plantingKind).label} کاشته شود.</span>
            <button type="button" className="icon-button icon-button--tiny" onClick={() => setPlantingKind(null)} aria-label="لغو انتخاب دانه">
              <X size={15} />
            </button>
          </div>
        )}

        {movingItem && (
          <div className="garden-board__instruction garden-board__instruction--moving" role="status">
            <Move size={16} aria-hidden="true" />
            <span>یک جایگاه خالی را برای جابه‌جایی انتخاب کن.</span>
            <button type="button" className="icon-button icon-button--tiny" onClick={() => setMovingItemId(null)} aria-label="لغو جابه‌جایی">
              <X size={15} />
            </button>
          </div>
        )}

        <PixelGardenMap
          plantedItems={plantedItems}
          unlockedSlotIds={unlockedSlotIds}
          plantingKind={plantingKind}
          movingItemId={movingItemId}
          selectedItemId={selectedItemId}
          pendingTreeReady={hasPendingTree}
          onSlotClick={handleSlotClick}
        />

        {selectedItem && !movingItemId && (
          <div className="garden-item-actions" role="group" aria-label={`مدیریت ${getSeedDefinition(selectedItem.kind).label}`}>
            <span className="garden-item-actions__title">{getSeedDefinition(selectedItem.kind).emoji} {getSeedDefinition(selectedItem.kind).label}</span>
            <button type="button" className="text-button" onClick={() => { setMovingItemId(selectedItem.id); setSelectedItemId(null); }}>
              <Move size={15} /> جابه‌جا کن
            </button>
            <button type="button" className="text-button text-button--danger" onClick={handleRemove}>
              <Trash2 size={15} /> بردار
            </button>
          </div>
        )}

        {hasPendingTree && !deferredTreePlanting && !plantingKind && (
          <div className="garden-board__plant-cta">
            <button type="button" className="primary-button" onClick={() => chooseSeed("tree")}>
              🌳 درختت آماده‌ست؛ بکارش
            </button>
            <button type="button" className="text-button" onClick={onDefer}>
              بعداً می‌کارمش
            </button>
          </div>
        )}
      </div>

      <div className="decor-card__collection" aria-label="مجموعه‌ی دکورهای باغ">
        {GARDEN_DECOR.map((decor) => {
          const unlocked = lifetimeWins >= decor.unlockAt;
          return (
            <div className={`decor-card__item${unlocked ? " is-unlocked" : ""}`} key={decor.id}>
              <span className="decor-card__item-icon" aria-hidden="true">
                {unlocked ? decor.emoji : <Lock size={14} />}
              </span>
              <span>{decor.label}</span>
            </div>
          );
        })}
      </div>

      <p className="decor-card__hint">
        {nextDecor
          ? `${toPersianDigits(nextDecor.unlockAt - lifetimeWins)} برد کوچک تا ${nextDecor.label}`
          : unlockedSlotCount < 12
            ? `با ${toPersianDigits((GARDEN_SLOT_COUNTS.find((stage) => stage.count > unlockedSlotCount)?.unlockAt ?? 10) - lifetimeWins)} برد دیگر، باغت یک گوشه‌ی تازه می‌گیرد ✨`
            : "همه‌ی گوشه‌های باغت پر از چیزهای قشنگ شده ✨"}
      </p>
    </section>
  );
}
