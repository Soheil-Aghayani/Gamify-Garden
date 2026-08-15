export type LoveCapsuleTone = "comfort" | "admiration" | "memory" | "future";

export interface LoveCapsule {
  id: string;
  tone: LoveCapsuleTone;
  label: string;
  title: string;
  message: string;
  emoji: string;
}

/**
 * These are intentionally short and warm so the capsule feels like a note,
 * not another task. They can become editable from settings in a later pass.
 */
export const LOVE_CAPSULES: readonly LoveCapsule[] = [
  {
    id: "warmth-01",
    tone: "comfort",
    label: "برای روزهای خسته",
    title: "امروز هم کافی هستی",
    message: "لازم نیست امروز قهرمان باشی؛ فقط با خودت همان‌قدر مهربان باش که با آدم‌های دوست‌داشتنی زندگی‌ات هستی.",
    emoji: "🌤️",
  },
  {
    id: "warmth-02",
    tone: "admiration",
    label: "یک چیز دوست‌داشتنی",
    title: "گرمای تو واقعی است",
    message: "تو خیلی وقت‌ها بدون اینکه بفهمی، حال آدم‌های اطرافت را بهتر می‌کنی. این یکی از قشنگ‌ترین چیزهای توست.",
    emoji: "✨",
  },
  {
    id: "warmth-03",
    tone: "comfort",
    label: "اجازه‌ی استراحت",
    title: "امروز می‌شود آهسته رفت",
    message: "اگر فقط یک قدم کوچک برداشتی یا حتی فقط نفسی کشیدی، باز هم ارزشمند است. قرار نیست همیشه با سرعت جلو بروی.",
    emoji: "🫖",
  },
  {
    id: "warmth-04",
    tone: "admiration",
    label: "برای فاطمه‌ی قوی",
    title: "من تلاش کوچکت را می‌بینم",
    message: "حتی وقتی نتیجه هنوز معلوم نیست، همین که دوباره شروع می‌کنی شجاعانه است. بهت افتخار می‌کنم.",
    emoji: "🌱",
  },
  {
    id: "warmth-05",
    tone: "memory",
    label: "یک یادآوری کوچک",
    title: "تو برای من خانه‌ای",
    message: "در شلوغ‌ترین روزها، فکرکردن به تو یک جای آرام در ذهنم می‌سازد؛ همان جایی که می‌شود کمی نفس کشید.",
    emoji: "🏡",
  },
  {
    id: "warmth-06",
    tone: "future",
    label: "برای قرار بعدی",
    title: "یک شب آرام دونفره",
    message: "یک چای یا قهوه، یک فیلم که تو انتخابش کنی، و هیچ عجله‌ای برای تمام‌کردن شب. این قرار کوچک ذخیره است.",
    emoji: "🍵",
  },
  {
    id: "warmth-07",
    tone: "admiration",
    label: "یک حقیقت کوچک",
    title: "لازم نیست بی‌نقص باشی",
    message: "دوست‌داشتنی‌بودنت به تعداد کارهای انجام‌شده، روزهای خوب یا انرژی امروزت وابسته نیست.",
    emoji: "💛",
  },
  {
    id: "warmth-08",
    tone: "comfort",
    label: "برای وقتی که سنگین است",
    title: "تنها نیستی",
    message: "اگر امروز سخت گذشت، لازم نیست همه‌اش را تنهایی حمل کنی. من اینجا هستم؛ حتی برای یک سکوت آرام.",
    emoji: "🤍",
  },
  {
    id: "warmth-09",
    tone: "memory",
    label: "از طرف Apricity",
    title: "همان گرمای همیشگی",
    message: "برای من، تو شبیه گرمای نور خورشید در زمستانی؛ آرام، واقعی و درست وقتی که بیشتر از همیشه لازم است.",
    emoji: "☀️",
  },
  {
    id: "warmth-10",
    tone: "future",
    label: "یک برنامه‌ی کوچک",
    title: "امروز را جشن می‌گیریم",
    message: "هر وقت آماده بودی، برای یک کار کوچک و دوست‌داشتنی وقت می‌گذاریم؛ حتی اگر فقط قدم‌زدن و حرف‌زدن باشد.",
    emoji: "🎈",
  },
  {
    id: "warmth-11",
    tone: "comfort",
    label: "یک بغل مجازی",
    title: "بیا کمی نزدیک‌تر",
    message: "این کپسول یک بغل نرم دارد؛ از آن‌هایی که لازم نیست چیزی برایشان توضیح بدهی.",
    emoji: "🫂",
  },
  {
    id: "warmth-12",
    tone: "admiration",
    label: "برای قلب مهربانت",
    title: "بودنت مهم است",
    message: "نه فقط به‌خاطر کارهایی که انجام می‌دهی؛ به‌خاطر خودت، با تمام لطافت و پیچیدگی قشنگت.",
    emoji: "💌",
  },
] as const;
