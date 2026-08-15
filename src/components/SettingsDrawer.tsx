import { Check, Monitor, Moon, Palette, Plus, Settings2, Sun, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { PaletteId, Profile, ThemeMode } from "../types/game";

interface SettingsDrawerProps {
  open: boolean;
  profile: Profile;
  rewards: readonly string[];
  onClose: () => void;
  onSave: (profile: Profile) => void;
  onAddReward: (reward: string) => void;
  onRemoveReward: (reward: string) => void;
}

const PALETTES: Array<{ id: PaletteId; label: string; colors: string[] }> = [
  { id: "mint", label: "نعنایی", colors: ["#a9e3c8", "#e5dcff", "#ffd9c8"] },
  { id: "lilac", label: "یاسی", colors: ["#d8c8ff", "#f1d9ec", "#ffe7bb"] },
  { id: "peach", label: "هلویی", colors: ["#ffc8b6", "#ffe3b9", "#c7e9dc"] },
];

const THEMES: Array<{ id: ThemeMode; label: string; description: string; Icon: typeof Sun }> = [
  { id: "light", label: "روز روشن", description: "نرم و نورانی", Icon: Sun },
  { id: "dark", label: "شب آرام", description: "تیره و پاستیلی", Icon: Moon },
  { id: "system", label: "هماهنگ", description: "با تنظیم گوشی", Icon: Monitor },
];

export function SettingsDrawer({ open, profile, rewards, onClose, onSave, onAddReward, onRemoveReward }: SettingsDrawerProps) {
  const [draftName, setDraftName] = useState(profile.displayName);
  const [draftNickname, setDraftNickname] = useState(profile.nickname);
  const [draftPalette, setDraftPalette] = useState<PaletteId>(profile.palette);
  const [draftTheme, setDraftTheme] = useState<ThemeMode>(profile.theme);
  const [draftReward, setDraftReward] = useState("");

  useEffect(() => {
    if (open) {
      setDraftName(profile.displayName);
      setDraftNickname(profile.nickname);
      setDraftPalette(profile.palette);
      setDraftTheme(profile.theme);
      setDraftReward("");
    }
  }, [open, profile.displayName, profile.nickname, profile.palette, profile.theme]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const save = () => {
    onSave({
      displayName: draftName.trim() || "فاطمه",
      nickname: draftNickname.trim() || "Apricity",
      avatarSeed: profile.avatarSeed,
      palette: draftPalette,
      theme: draftTheme,
    });
    onClose();
  };

  const addReward = () => {
    const cleanReward = draftReward.trim();
    if (!cleanReward) return;
    onAddReward(cleanReward);
    setDraftReward("");
  };

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="settings-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-title">
            <span className="drawer-title__icon"><Settings2 size={19} /></span>
            <div>
              <p className="eyebrow">یک گوشه‌ی دنج</p>
              <h2 id="settings-title">تنظیمات باغ</h2>
            </div>
          </div>
          <button type="button" className="icon-button icon-button--small" onClick={onClose} aria-label="بستن تنظیمات">
            <X size={18} />
          </button>
        </div>

        <label className="field-label" htmlFor="display-name">دوست داری با چه اسمی صدات کنیم؟</label>
        <input
          id="display-name"
          className="text-input"
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
          maxLength={24}
          autoComplete="off"
        />

        <label className="field-label" htmlFor="garden-nickname">اسم صمیمی باغ</label>
        <input
          id="garden-nickname"
          className="text-input"
          value={draftNickname}
          onChange={(event) => setDraftNickname(event.target.value)}
          maxLength={24}
          autoComplete="off"
        />

        <div className="field-label"><Palette size={16} /> رنگ باغ</div>
        <div className="palette-options" role="group" aria-label="انتخاب رنگ باغ">
          {PALETTES.map((palette) => {
            const selected = palette.id === draftPalette;
            return (
              <button
                className={`palette-option${selected ? " is-selected" : ""}`}
                type="button"
                key={palette.id}
                onClick={() => setDraftPalette(palette.id)}
                aria-pressed={selected}
              >
                <span className="palette-swatches" aria-hidden="true">
                  {palette.colors.map((color) => <span key={color} style={{ backgroundColor: color }} />)}
                </span>
                <span>{palette.label}</span>
                {selected && <Check size={16} />}
              </button>
            );
          })}
        </div>

        <div className="settings-divider" />
        <div className="field-label"><Moon size={16} /> حال‌وهوای نمایش</div>
        <div className="theme-options" role="group" aria-label="انتخاب حالت نمایش">
          {THEMES.map(({ id, label, description, Icon }) => {
            const selected = id === draftTheme;
            return (
              <button
                className={`theme-option${selected ? " is-selected" : ""}`}
                type="button"
                key={id}
                onClick={() => setDraftTheme(id)}
                aria-pressed={selected}
              >
                <span className="theme-option__icon"><Icon size={17} /></span>
                <span className="theme-option__copy">
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
                {selected && <Check size={15} />}
              </button>
            );
          })}
        </div>

        <div className="settings-divider" />
        <div className="field-label"><HeartIcon /> جایزه‌های مهربانانه</div>
        <p className="settings-hint">چیزهای کوچیکی که بعد از سه قدم حالت را خوب می‌کنند.</p>
        <div className="reward-manager">
          <div className="reward-manager__input">
            <input
              id="custom-reward"
              className="text-input"
              value={draftReward}
              onChange={(event) => setDraftReward(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") addReward(); }}
              placeholder="مثلاً: چای و موسیقی"
              maxLength={42}
              autoComplete="off"
            />
            <button type="button" className="icon-button icon-button--small" onClick={addReward} disabled={!draftReward.trim()} aria-label="اضافه‌کردن جایزه">
              <Plus size={17} />
            </button>
          </div>
          <div className="reward-manager__list">
            {rewards.map((reward) => (
              <div className="reward-manager__item" key={reward}>
                <span>{reward}</span>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onRemoveReward(reward)}
                  disabled={rewards.length <= 1}
                  aria-label={`حذف جایزه ${reward}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="button" className="primary-button drawer-save" onClick={save}>ذخیره‌ی تغییرات</button>
      </aside>
    </div>
  );
}

function HeartIcon() {
  return <span aria-hidden="true">♡</span>;
}
