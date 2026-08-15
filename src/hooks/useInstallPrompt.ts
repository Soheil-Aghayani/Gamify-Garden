import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isStandaloneMode(): boolean {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  const displayModeMatches = typeof window.matchMedia === "function"
    && window.matchMedia("(display-mode: standalone)").matches;
  return displayModeMatches || navigatorWithStandalone.standalone === true;
}

function isIosDevice(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isMobileDevice(): boolean {
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 1 && window.innerWidth < 900);
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsInstalled(isStandaloneMode());
    setIsIos(isIosDevice());
    setIsMobile(isMobileDevice());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return choice.outcome === "accepted";
  };

  return {
    canInstall: Boolean(deferredPrompt),
    install,
    isInstalled,
    isIos,
    isMobile,
  };
}
