import {
  BookOpen,
  BrainCircuit,
  CirclePlay,
  Dumbbell,
  Languages,
  PenLine,
} from "lucide-react";
import type { Quest } from "../types/game";

export const QUESTS: readonly Quest[] = [
  {
    id: "llm",
    title: "LLM",
    minimumAction: "یک قدم کوچک",
    energyCopy: {
      1: "فقط فایل را باز کن",
      2: "ده دقیقه جلو برو",
      3: "یک بخش را تمام کن",
    },
    icon: BrainCircuit,
  },
  {
    id: "article-video",
    title: "آموزش",
    minimumAction: "چند دقیقه ویدئو",
    energyCopy: {
      1: "فقط پنج دقیقه ببین",
      2: "یک بخش را ببین",
      3: "یادداشت کوتاه بردار",
    },
    icon: CirclePlay,
  },
  {
    id: "language",
    title: "زبان",
    minimumAction: "چند کلمه",
    energyCopy: {
      1: "پنج دقیقه کافی است",
      2: "یک تمرین کوتاه",
      3: "یک درس کوچک",
    },
    icon: Languages,
  },
  {
    id: "article",
    title: "مقاله",
    minimumAction: "یک صفحه",
    energyCopy: {
      1: "فقط یک صفحه",
      2: "پنج تا ده دقیقه",
      3: "یک مقاله کامل",
    },
    icon: BookOpen,
  },
  {
    id: "exercise",
    title: "ورزش",
    minimumAction: "بدن را بیدار کن",
    energyCopy: {
      1: "کمی کشش",
      2: "یک پیاده‌روی کوتاه",
      3: "تمرین کامل‌تر",
    },
    icon: Dumbbell,
  },
  {
    id: "writing",
    title: "نوشتن",
    minimumAction: "سه جمله",
    energyCopy: {
      1: "سه جمله بی‌نقص‌نباشد",
      2: "ده دقیقه بنویس",
      3: "یک تکه از متن را بنویس",
    },
    icon: PenLine,
  },
];
