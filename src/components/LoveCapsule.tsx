import { Heart, MailOpen, Sparkles } from "lucide-react";
import type { Ref } from "react";
import { getDailyLoveCapsule } from "../lib/love";

interface LoveCapsuleProps {
  dailyWin: boolean;
  dayKey: string;
  openedCapsuleIds: readonly string[];
  sectionRef?: Ref<HTMLElement>;
  onOpen: (capsuleId: string) => void;
}

export function LoveCapsule({ dailyWin, dayKey, openedCapsuleIds, sectionRef, onOpen }: LoveCapsuleProps) {
  const capsule = getDailyLoveCapsule(dayKey);
  const isOpened = openedCapsuleIds.includes(capsule.id);

  return (
    <section
      ref={sectionRef}
      className={`love-capsule soft-card${isOpened ? " is-opened" : ""}`}
      aria-labelledby="love-capsule-title"
    >
      <div className="love-capsule__icon" aria-hidden="true">
        {isOpened ? <MailOpen size={25} strokeWidth={1.7} /> : <Heart size={24} strokeWidth={1.7} />}
        <span>✦</span>
      </div>

      <div className="love-capsule__content">
        <div className="love-capsule__heading">
          <div>
            <p className="eyebrow">کپسول محبت</p>
            <h2 id="love-capsule-title">{dailyWin ? "برای برد امروزت یک گرما داریم" : "یک گرمای کوچولو برای تو"}</h2>
          </div>
          <span className="tiny-badge tiny-badge--warm">
            {dailyWin ? "جشن امروز ✨" : "همیشه باز"}
          </span>
        </div>

        {!isOpened ? (
          <>
            <p className="love-capsule__copy">
              {dailyWin ? "این یکی برای همین قدم‌های قشنگت کنار گذاشته شده." : "برای روزهایی که فقط کمی مهربانی لازم داری."}
            </p>
            <button type="button" className="love-capsule__open primary-button" onClick={() => onOpen(capsule.id)}>
              <Sparkles size={16} />
              کپسول را باز کن
            </button>
          </>
        ) : (
          <article className="love-capsule__message" aria-live="polite">
            <div className="love-capsule__message-mark" aria-hidden="true">{capsule.emoji}</div>
            <div>
              <p className="eyebrow">{capsule.label}</p>
              <h3>{capsule.title}</h3>
              <p>{capsule.message}</p>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
