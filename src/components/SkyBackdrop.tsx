import type { SkyPhase } from "../lib/date";

interface SkyBackdropProps {
  phase: SkyPhase;
}

const STAR_POSITIONS = [
  { top: "18%", left: "14%" },
  { top: "28%", left: "34%" },
  { top: "12%", left: "58%" },
  { top: "38%", left: "76%" },
  { top: "22%", left: "88%" },
  { top: "50%", left: "48%" },
];

export function SkyBackdrop({ phase }: SkyBackdropProps) {
  return (
    <div className={`sky-backdrop sky-backdrop--${phase}`} aria-hidden="true">
      <span className="sky-backdrop__sun" />
      <span className="sky-backdrop__moon"><span /></span>
      <span className="sky-backdrop__horizon" />
      <span className="sky-backdrop__stars">
        {STAR_POSITIONS.map(({ top, left }, index) => (
          <span key={`${top}-${left}`} className="sky-backdrop__star" style={{ top, left, animationDelay: `${index * 420}ms` }}>✦</span>
        ))}
      </span>
      <span className="sky-backdrop__cloud sky-backdrop__cloud--one" />
      <span className="sky-backdrop__cloud sky-backdrop__cloud--two" />
    </div>
  );
}
