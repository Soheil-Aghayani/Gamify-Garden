import { ListPlus } from "lucide-react";
import type { Ref } from "react";
import type { EnergyLevel, Quest, QuestId } from "../types/game";
import { toPersianDigits } from "../lib/format";
import { QuestTile } from "./QuestTile";

interface QuestGridProps {
  quests: readonly Quest[];
  energy: EnergyLevel;
  completedQuestIds: QuestId[];
  target: number;
  isNext: boolean;
  sectionRef?: Ref<HTMLElement>;
  onManage: () => void;
  onToggle: (questId: QuestId) => void;
}

export function QuestGrid({ quests, energy, completedQuestIds, target, isNext, sectionRef, onManage, onToggle }: QuestGridProps) {
  return (
    <section ref={sectionRef} tabIndex={-1} className={`quests-section${isNext ? " is-flow-next" : ""}`} aria-labelledby="quests-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ماموریت‌های کوچیک</p>
          <h2 id="quests-title">کدوم قدم‌ها صدات می‌زنن؟</h2>
        </div>
        <div className="quest-heading-actions">
          <span className={`tiny-badge${isNext ? " tiny-badge--flow" : ""}`}>
            {target === 0 ? "یک کار اضافه کن" : isNext ? "حالا یکی رو انتخاب کن" : `${toPersianDigits(target)} تا کافیه`}
          </span>
          <button className="text-button" type="button" onClick={onManage}>
            <ListPlus size={16} />
            تغییر کارها
          </button>
        </div>
      </div>
      {quests.length > 0 ? (
        <div className="quest-grid">
          {quests.map((quest) => (
            <QuestTile
              key={quest.id}
              quest={quest}
              energy={energy}
              complete={completedQuestIds.includes(quest.id)}
              onToggle={() => onToggle(quest.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-tasks">
          <ListPlus size={24} />
          <strong>باغت هنوز مأموریتی ندارد</strong>
          <span>یک کار کوچک اضافه کن تا شروع کنیم.</span>
          <button className="primary-button" type="button" onClick={onManage}>اضافه‌کردن اولین کار</button>
        </div>
      )}
    </section>
  );
}
