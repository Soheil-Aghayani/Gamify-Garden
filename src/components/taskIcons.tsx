import {
  BookOpen,
  BrainCircuit,
  Dumbbell,
  Heart,
  Languages,
  Lightbulb,
  PenLine,
  PlayCircle,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TaskIconKey } from "../types/game";

export const TASK_ICON_MAP: Record<TaskIconKey, LucideIcon> = {
  brain: BrainCircuit,
  play: PlayCircle,
  languages: Languages,
  book: BookOpen,
  exercise: Dumbbell,
  writing: PenLine,
  sparkles: Sparkles,
  star: Star,
  heart: Heart,
  sun: Sun,
  lightbulb: Lightbulb,
};

export const TASK_ICON_OPTIONS: Array<{ key: TaskIconKey; label: string }> = [
  { key: "sparkles", label: "درخشش" },
  { key: "star", label: "ستاره" },
  { key: "heart", label: "قلب" },
  { key: "sun", label: "خورشید" },
  { key: "lightbulb", label: "ایده" },
  { key: "book", label: "یادگیری" },
  { key: "writing", label: "نوشتن" },
];

export function TaskIcon({ iconKey, size = 20 }: { iconKey: TaskIconKey; size?: number }) {
  const Icon = TASK_ICON_MAP[iconKey] ?? Lightbulb;
  return <Icon size={size} strokeWidth={1.8} />;
}
