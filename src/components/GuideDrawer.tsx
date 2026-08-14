import { Gift, Heart, ListPlus, Moon, Sprout, X } from "lucide-react";
import { useEffect } from "react";

interface GuideDrawerProps {
  open: boolean;
  onClose: () => void;
}

const GUIDE_STEPS = [
  {
    Icon: Moon,
    title: "حال امروزت را بگو",
    copy: "آرام، معمولی یا پرانرژی؛ باغ خودش را با تو هماهنگ می‌کند.",
  },
  {
    Icon: Sprout,
    title: "چند قدم کوچک بردار",
    copy: "از بین کارها چندتا را انتخاب کن. سه قدم برای برد روزانه کافی است.",
  },
  {
    Icon: Gift,
    title: "جایزه‌ات را بردار",
    copy: "بعد از برد، چیزی کوچک و مهربانانه برای خودت انتخاب کن.",
  },
  {
    Icon: ListPlus,
    title: "باغ را مال خودت کن",
    copy: "هر وقت خواستی کار تازه اضافه کن یا کاری را از باغت بیرون ببر.",
  },
];

export function GuideDrawer({ open, onClose }: GuideDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="settings-drawer guide-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-title">
            <span className="drawer-title__icon drawer-title__icon--warm"><Heart size={19} fill="currentColor" /></span>
            <div>
              <p className="eyebrow">برای روزهای سرد</p>
              <h2 id="guide-title">راهنمای Apricity</h2>
            </div>
          </div>
          <button type="button" className="icon-button icon-button--small" onClick={onClose} aria-label="بستن راهنما">
            <X size={18} />
          </button>
        </div>

        <div className="guide-intro">
          <strong>Apricity یعنی گرمای نور خورشید در زمستان.</strong>
          <span>این باغ قرار نیست از تو بیشتر بخواهد؛ فقط کمک می‌کند قدم بعدی را ببینی.</span>
        </div>

        <div className="guide-steps">
          {GUIDE_STEPS.map(({ Icon, title, copy }, index) => (
            <div className="guide-step" key={title}>
              <span className="guide-step__number">{index + 1}</span>
              <span className="guide-step__icon" aria-hidden="true"><Icon size={19} /></span>
              <span className="guide-step__copy">
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
            </div>
          ))}
        </div>

        <button type="button" className="primary-button drawer-save" onClick={onClose}>بریم یک قدم کوچیک برداریم</button>
      </aside>
    </div>
  );
}
