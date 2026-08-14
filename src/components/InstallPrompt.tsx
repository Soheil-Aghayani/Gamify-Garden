import { Download, ExternalLink, X } from "lucide-react";

interface InstallPromptProps {
  canInstall: boolean;
  isIos: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallPrompt({ canInstall, isIos, onInstall, onDismiss }: InstallPromptProps) {
  if (!canInstall && !isIos) return null;

  return (
    <aside className="install-prompt" aria-label="نصب باغ Apricity">
      <span className="install-prompt__icon" aria-hidden="true"><Download size={19} /></span>
      <span className="install-prompt__copy">
        <strong>باغت را روی گوشی نگه دار</strong>
        <small>{isIos && !canInstall ? "از Share گزینه‌ی Add to Home Screen را بزن" : "مثل یک اپ کوچک، همیشه دم دستت باشد"}</small>
      </span>
      {canInstall && (
        <button type="button" className="install-prompt__action" onClick={onInstall}>
          نصب
        </button>
      )}
      {isIos && !canInstall && <ExternalLink className="install-prompt__ios-icon" size={17} aria-hidden="true" />}
      <button type="button" className="install-prompt__close" onClick={onDismiss} aria-label="بستن پیشنهاد نصب">
        <X size={17} />
      </button>
    </aside>
  );
}
