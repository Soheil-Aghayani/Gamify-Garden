import { Download, ExternalLink, X } from "lucide-react";

interface InstallPromptProps {
  canInstall: boolean;
  isIos: boolean;
  isMobile: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallPrompt({ canInstall, isIos, isMobile, onInstall, onDismiss }: InstallPromptProps) {
  if (!canInstall && !isIos && !isMobile) return null;

  const copy = isIos && !canInstall
    ? "از Share گزینه‌ی Add to Home Screen را بزن"
    : canInstall
      ? "با یک لمس، مثل یک اپ روی صفحه اصلی‌ات می‌نشیند"
      : "از منوی مرورگر، گزینه‌ی نصب برنامه را انتخاب کن";

  return (
    <aside className="install-prompt" aria-label="نصب باغ Apricity">
      <span className="install-prompt__icon" aria-hidden="true"><Download size={19} /></span>
      <span className="install-prompt__copy">
        <strong>Apricity را روی صفحه اصلی بگذار</strong>
        <small>{copy}</small>
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
