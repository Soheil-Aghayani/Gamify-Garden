import type { EnergyLevel, Quest, QuestId } from "../types/game";
import { QuestTile } from "./QuestTile";

interface QuestGridProps {
  quests: readonly Quest[];
  energy: EnergyLevel;
  completedQuestIds: QuestId[];
  onToggle: (questId: QuestId) => void;
}

export function QuestGrid({ quests, energy, completedQuestIds, onToggle }: QuestGridProps) {
  return (
    <section className="quests-section" aria-labelledby="quests-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ماموریت‌های کوچیک</p>
          <h2 id="quests-title">کدوم سه‌تا صدات می‌زنن؟</h2>
        </div>
        <span className="tiny-badge">۳ تا کافیه</span>
      </div>
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
    </section>
  );
}
