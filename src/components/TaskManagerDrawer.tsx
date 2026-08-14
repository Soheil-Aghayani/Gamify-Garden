import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { TaskDefinition, TaskIconKey } from "../types/game";
import { toPersianDigits } from "../lib/format";
import { TASK_ICON_OPTIONS, TaskIcon } from "./taskIcons";

interface TaskManagerDrawerProps {
  open: boolean;
  tasks: readonly TaskDefinition[];
  onClose: () => void;
  onAdd: (task: TaskDefinition) => void;
  onRemove: (taskId: string) => void;
}

function createTaskId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `custom-${crypto.randomUUID()}`;
  return `custom-${Date.now()}`;
}

export function TaskManagerDrawer({ open, tasks, onClose, onAdd, onRemove }: TaskManagerDrawerProps) {
  const [title, setTitle] = useState("");
  const [minimumAction, setMinimumAction] = useState("");
  const [iconKey, setIconKey] = useState<TaskIconKey>("sparkles");

  useEffect(() => {
    if (open) {
      setTitle("");
      setMinimumAction("");
      setIconKey("sparkles");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const add = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const action = minimumAction.trim() || "یک قدم کوچک";
    onAdd({
      id: createTaskId(),
      title: cleanTitle.slice(0, 42),
      minimumAction: action.slice(0, 60),
      energyCopy: { 1: action, 2: action, 3: `${action} یا کمی بیشتر` },
      iconKey,
      isDefault: false,
      createdAt: Date.now(),
    });
    setTitle("");
    setMinimumAction("");
  };

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="settings-drawer task-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-manager-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-title">
            <span className="drawer-title__icon"><Plus size={19} /></span>
            <div>
              <p className="eyebrow">باغِ خودت</p>
              <h2 id="task-manager-title">مدیریت کارها</h2>
            </div>
          </div>
          <button type="button" className="icon-button icon-button--small" onClick={onClose} aria-label="بستن مدیریت کارها">
            <X size={18} />
          </button>
        </div>

        <div className="task-form">
          <label className="field-label" htmlFor="task-title">چه کاری را اضافه کنیم؟</label>
          <input
            id="task-title"
            className="text-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="مثلاً: مرتب‌کردن اتاق"
            maxLength={42}
            autoComplete="off"
          />
          <label className="field-label" htmlFor="task-action">نسخه‌ی خیلی کوچکش چیست؟</label>
          <input
            id="task-action"
            className="text-input"
            value={minimumAction}
            onChange={(event) => setMinimumAction(event.target.value)}
            placeholder="مثلاً: فقط پنج دقیقه"
            maxLength={60}
            autoComplete="off"
          />
          <div className="field-label">یک شکل برایش انتخاب کن</div>
          <div className="icon-picker" role="group" aria-label="انتخاب شکل مأموریت">
            {TASK_ICON_OPTIONS.map((option) => {
              const selected = option.key === iconKey;
              return (
                <button
                  type="button"
                  key={option.key}
                  className={`icon-picker__option${selected ? " is-selected" : ""}`}
                  onClick={() => setIconKey(option.key)}
                  aria-label={option.label}
                  aria-pressed={selected}
                >
                  <TaskIcon iconKey={option.key} size={18} />
                </button>
              );
            })}
          </div>
          <button type="button" className="primary-button" onClick={add} disabled={!title.trim()}>
            <Plus size={17} />
            اضافه‌کردن کار
          </button>
        </div>

        <div className="task-list-heading">
          <span className="field-label">کارهای باغ</span>
          <span className="tiny-badge">{toPersianDigits(tasks.length)} کار</span>
        </div>
        <div className="task-list">
          {tasks.length > 0 ? tasks.map((task) => (
            <div className="task-row" key={task.id}>
              <span className="task-row__icon" aria-hidden="true"><TaskIcon iconKey={task.iconKey} size={18} /></span>
              <span className="task-row__copy">
                <strong>{task.title}</strong>
                <small>{task.minimumAction}</small>
              </span>
              <button type="button" className="delete-button" onClick={() => onRemove(task.id)} aria-label={`حذف ${task.title}`}>
                <Trash2 size={16} />
              </button>
            </div>
          )) : (
            <div className="task-list__empty">هنوز کاری اضافه نکردی.</div>
          )}
        </div>
      </aside>
    </div>
  );
}
