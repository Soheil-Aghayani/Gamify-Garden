import { Check, Palette, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { PaletteId, Profile } from "../types/game";

interface SettingsDrawerProps {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onSave: (profile: Profile) => void;
}

const PALETTES: Array<{ id: PaletteId; label: string; colors: string[] }> = [
  { id: "mint", label: "نعنایی", colors: ["#a9e3c8", "#e5dcff", "#ffd9c8"] },
  { id: "lilac", label: "یاسی", colors: ["#d8c8ff", "#f1d9ec", "#ffe7bb"] },
  { id: "peach", label: "هلویی", colors: ["#ffc8b6", "#ffe3b9", "#c7e9dc"] },
];

export function SettingsDrawer({ open, profile, onClose, onSave }: SettingsDrawerProps) {
  const [draftName, setDraftName] = useState(profile.displayName);
  const [draftPalette, setDraftPalette] = useState<PaletteId>(profile.palette);

  useEffect(() => {
    if (open) {
      setDraftName(profile.displayName);
      setDraftPalette(profile.palette);
    }
  }, [open, profile.displayName, profile.palette]);

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
      displayName: draftName.trim() || "دوست من",
      palette: draftPalette,
    });
    onClose();
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

        <button type="button" className="primary-button drawer-save" onClick={save}>ذخیره‌ی تغییرات</button>
      </aside>
    </div>
  );
}
