import { Check, Gift, Heart, Sparkles } from "lucide-react";

interface RewardBannerProps {
  dailyWin: boolean;
  target: number;
  selectedReward?: string;
  onChoose: (reward: string) => void;
}

const REWARDS = [
  "یک نوشیدنی خوشمزه",
  "یک قسمت سریال",
  "یک بغل و قدم‌زدن",
];

export function RewardBanner({ dailyWin, target, selectedReward, onChoose }: RewardBannerProps) {
  const emptyGarden = target === 0;
  return (
    <section className={`reward-card soft-card${dailyWin ? " is-unlocked" : ""}`} aria-labelledby="reward-title">
      <div className="reward-card__icon" aria-hidden="true">
        {dailyWin ? <Gift size={24} strokeWidth={1.8} /> : <Sparkles size={22} strokeWidth={1.8} />}
      </div>
      <div className="reward-card__content">
        <p className="eyebrow">جایزه‌ی مهربانانه</p>
        <h2 id="reward-title">{dailyWin ? "امروز را بردی ✨" : emptyGarden ? "اول یک کار به باغ اضافه کن" : `${target} قدم، یک جایزه‌ی کوچیک`}</h2>
        <p>{dailyWin ? "یکی را برای خودت انتخاب کن؛ واقعاً حقته." : emptyGarden ? "هر چیزی که دوست داری می‌تواند اولین جوانه باشد." : "لازم نیست بزرگ باشد؛ فقط چیزی که حالت را خوب کند."}</p>
        {dailyWin && (
          <div className="reward-options" role="group" aria-label="انتخاب جایزه">
            {REWARDS.map((reward) => {
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
