import { Check, Sparkles } from "lucide-react";
import type { EnergyLevel, Quest } from "../types/game";
import { TaskIcon } from "./taskIcons";

interface QuestTileProps {
  quest: Quest;
  energy: EnergyLevel;
  complete: boolean;
  onToggle: () => void;
}

export function QuestTile({ quest, energy, complete, onToggle }: QuestTileProps) {
  return (
    <button
      className={`quest-tile${complete ? " is-complete" : ""}`}
      type="button"
      onClick={onToggle}
      aria-pressed={complete}
      aria-label={`${quest.title}: ${quest.energyCopy[energy]}`}
    >
      <span className="quest-tile__icon" aria-hidden="true"><TaskIcon iconKey={quest.iconKey} size={22} /></span>
      <span className="quest-tile__body">
        <strong>{quest.title}</strong>
        <small>{quest.energyCopy[energy]}</small>
      </span>
      <span className="quest-tile__check" aria-hidden="true">
        {complete ? <Check size={16} strokeWidth={2.4} /> : <Sparkles size={14} strokeWidth={1.8} />}
      </span>
    </button>
  );
}
