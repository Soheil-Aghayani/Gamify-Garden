import type { PlantStage } from "../types/game";

interface PlantArtworkProps {
  stage: PlantStage;
}

const STAGE_LABELS: Record<PlantStage, string> = {
  seed: "یک دانه کوچک",
  sprout: "یک جوانه تازه",
  flower: "یک گل در حال شکفتن",
  tree: "یک درخت کوچولوی قوی",
};

export function PlantArtwork({ stage }: PlantArtworkProps) {
  return (
    <svg
      className={`plant-art plant-art--${stage}`}
      viewBox="0 0 280 220"
      role="img"
      aria-label={STAGE_LABELS[stage]}
    >
      <defs>
        <linearGradient id="plantLeafGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--plant-leaf-light)" />
          <stop offset="1" stopColor="var(--plant-leaf)" />
        </linearGradient>
        <linearGradient id="plantPetalGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--plant-petal-light)" />
          <stop offset="1" stopColor="var(--plant-petal)" />
        </linearGradient>
      </defs>

      <ellipse className="plant-ground" cx="140" cy="194" rx="100" ry="17" />
      <g className="plant-piece plant-piece--seed">
        <ellipse cx="140" cy="172" rx="19" ry="12" />
        <path d="M128 166c7-10 20-11 27-3-7 8-16 10-27 3Z" />
      </g>
      <g className="plant-piece plant-piece--sprout">
        <path className="plant-stem" d="M140 181c-3-29 0-51 13-72" />
        <path className="plant-leaf" d="M150 128c-5-24 10-35 31-35-3 21-14 32-31 35Z" />
        <path className="plant-leaf" d="M143 145c-17-3-27-15-27-32 18 1 29 12 27 32Z" />
      </g>
      <g className="plant-piece plant-piece--flower">
        <path className="plant-stem" d="M140 184c-4-42-1-71 12-101" />
        <path className="plant-leaf" d="M145 153c-22-2-34-16-35-35 20 0 35 12 35 35Z" />
        <path className="plant-leaf" d="M148 139c9-22 24-29 43-25-6 19-19 28-43 25Z" />
        <g className="plant-flower">
          <circle className="plant-petal" cx="153" cy="73" r="17" />
          <circle className="plant-petal" cx="128" cy="74" r="17" />
          <circle className="plant-petal" cx="140" cy="57" r="17" />
          <circle className="plant-petal" cx="141" cy="85" r="17" />
          <circle className="plant-center" cx="140" cy="72" r="12" />
        </g>
      </g>
      <g className="plant-piece plant-piece--tree">
        <path className="plant-trunk" d="M135 184c3-36 4-68 7-103l19 3c-6 35-9 68-7 100Z" />
        <path className="plant-branch" d="M145 119c-20-25-35-28-51-21M149 108c22-25 37-28 54-18" />
        <circle className="plant-canopy plant-canopy--one" cx="109" cy="87" r="32" />
        <circle className="plant-canopy plant-canopy--two" cx="164" cy="75" r="39" />
        <circle className="plant-canopy plant-canopy--three" cx="140" cy="48" r="37" />
        <circle className="plant-canopy plant-canopy--four" cx="190" cy="108" r="24" />
        <circle className="plant-canopy plant-canopy--five" cx="91" cy="118" r="22" />
        <circle className="plant-fruit" cx="116" cy="74" r="5" />
        <circle className="plant-fruit" cx="166" cy="47" r="5" />
        <circle className="plant-fruit" cx="184" cy="90" r="5" />
      </g>
    </svg>
  );
}
