import type { TaskDefinition } from "../types/game";

export const DEFAULT_TASKS: readonly TaskDefinition[] = [
  {
    id: "llm",
    title: "LLM",
    minimumAction: "یک قدم کوچک",
    energyCopy: {
      1: "فقط فایل را باز کن",
      2: "ده دقیقه جلو برو",
      3: "یک بخش را تمام کن",
    },
    iconKey: "brain",
    isDefault: true,
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
    iconKey: "play",
    isDefault: true,
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
    iconKey: "languages",
    isDefault: true,
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
    iconKey: "book",
    isDefault: true,
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
    iconKey: "exercise",
    isDefault: true,
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
    iconKey: "writing",
    isDefault: true,
  },
];

export const QUESTS = DEFAULT_TASKS;
