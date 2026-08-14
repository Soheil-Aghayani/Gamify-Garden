import { Check, Gift, Heart, Sparkles } from "lucide-react";
import type { Ref } from "react";

interface RewardBannerProps {
  dailyWin: boolean;
  target: number;
  rewards: readonly string[];
  selectedReward?: string;
  isNext: boolean;
  sectionRef?: Ref<HTMLElement>;
  onChoose: (reward: string) => void;
}

export function RewardBanner({ dailyWin, target, rewards, selectedReward, isNext, sectionRef, onChoose }: RewardBannerProps) {
  const emptyGarden = target === 0;
  const isDone = dailyWin && Boolean(selectedReward);
  return (
    <section
      ref={sectionRef}
      tabIndex={-1}
      className={`reward-card soft-card${dailyWin ? " is-unlocked" : ""}${isNext ? " is-flow-next" : ""}${isDone ? " is-done" : ""}`}
      aria-labelledby="reward-title"
    >
      <div className="reward-card__icon" aria-hidden="true">
        {dailyWin ? <Gift size={24} strokeWidth={1.8} /> : <Sparkles size={22} strokeWidth={1.8} />}
      </div>
      <div className="reward-card__content">
        <p className="eyebrow">جایزه‌ی مهربانانه</p>
        <h2 id="reward-title">{isDone ? "امروز همین‌قدر کافی بود 🌤️" : dailyWin ? "امروز را بردی ✨" : emptyGarden ? "اول یک کار به باغ اضافه کن" : `${target} قدم، یک جایزه‌ی کوچیک`}</h2>
        <p>{isDone ? `انتخابت: ${selectedReward}` : dailyWin ? "یکی را برای خودت انتخاب کن؛ واقعاً حقته." : emptyGarden ? "هر چیزی که دوست داری می‌تواند اولین جوانه باشد." : "لازم نیست بزرگ باشد؛ فقط چیزی که حالت را خوب کند."}</p>
        {dailyWin && (
          <div className="reward-options" role="group" aria-label="انتخاب جایزه">
            {rewards.map((reward) => {
              const selected = reward === selectedReward;
              return (
                <button
                  className={`reward-option${selected ? " is-selected" : ""}`}
                  type="button"
                  key={reward}
                  onClick={() => onChoose(reward)}
                  aria-pressed={selected}
                >
                  <span>{reward}</span>
                  {selected ? <Check size={15} /> : <Heart size={14} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
