import { useEffect, useRef, useState } from "react";
import { getDailyAvatar } from "./lib/avatar";
import { getDayKey, getPersianDateSummary } from "./lib/date";
import { toPersianDigits } from "./lib/format";
import {
  addTask,
  addReward,
  getDailyTarget,
  getDayState,
  getFlowStep,
  markIntroSeen,
  removeTask,
  removeReward,
  restoreTask,
  setProfile,
  setTodayEnergy,
  setTodayReward,
  toggleQuest,
} from "./lib/game";
import { loadGameState, saveGameState } from "./lib/storage";
import type { EnergyLevel, FlowStep, GameState, Profile, QuestId, TaskDefinition } from "./types/game";
import { EnergyPicker } from "./components/EnergyPicker";
import { GardenHeader } from "./components/GardenHeader";
import { GrowthScene } from "./components/GrowthScene";
import { GuideDrawer } from "./components/GuideDrawer";
import { InstallPrompt } from "./components/InstallPrompt";
import { QuestGrid } from "./components/QuestGrid";
import { RewardBanner } from "./components/RewardBanner";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { TaskManagerDrawer } from "./components/TaskManagerDrawer";
import { WeekMemory } from "./components/WeekMemory";
import { useBodyScrollLock } from "./hooks/useBodyScrollLock";
import { useInstallPrompt } from "./hooks/useInstallPrompt";
import "./styles.css";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastState {
  message: string;
  action?: ToastAction;
}

function prefersDarkMode(): boolean {
  return typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [taskManagerOpen, setTaskManagerOpen] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(prefersDarkMode);
  const [todayKey, setTodayKey] = useState(() => getDayKey());
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const energyRef = useRef<HTMLElement | null>(null);
  const questsRef = useRef<HTMLElement | null>(null);
  const rewardRef = useRef<HTMLElement | null>(null);
  const previousFlowStep = useRef<FlowStep | null>(null);
  const today = getDayState(gameState, todayKey);
  const target = getDailyTarget(gameState);
  const flowStep = getFlowStep(gameState, todayKey);
  const todaySummary = getPersianDateSummary();
  const dailyAvatar = getDailyAvatar(gameState.profile.avatarSeed, todayKey);
  const installPrompt = useInstallPrompt();
  const isDrawerOpen = guideOpen || settingsOpen || taskManagerOpen;
  const resolvedTheme = gameState.profile.theme === "system"
    ? (systemPrefersDark ? "dark" : "light")
    : gameState.profile.theme;

  useBodyScrollLock(isDrawerOpen);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    document.title = `${gameState.profile.nickname} | باغ قدم‌های کوچک`;
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [gameState.profile.nickname, resolvedTheme]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    mediaQuery.addListener?.(handleChange);
    return () => mediaQuery.removeListener?.(handleChange);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    const dayTimer = window.setInterval(() => {
      const nextDayKey = getDayKey();
      setTodayKey((currentDayKey) => currentDayKey === nextDayKey ? currentDayKey : nextDayKey);
    }, 60_000);
    return () => window.clearInterval(dayTimer);
  }, []);

  useEffect(() => {
    if (!gameState.hasSeenIntro) setGuideOpen(true);
  }, [gameState.hasSeenIntro]);

  const focusSection = (sectionRef: typeof energyRef) => {
    const section = sectionRef.current;
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => section.focus({ preventScroll: true }), 360);
  };

  useEffect(() => {
    const previousStep = previousFlowStep.current;
    if (previousStep !== null && previousStep !== flowStep) {
      if (flowStep === "energy") focusSection(energyRef);
      if (flowStep === "tasks") focusSection(questsRef);
      if (flowStep === "reward" || flowStep === "done") focusSection(rewardRef);
    }
    previousFlowStep.current = flowStep;
  }, [flowStep]);

  const showToast = (message: string, action?: ToastAction) => {
    setToast({ message, action });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), action ? 5000 : 2600);
  };

  const handleInstall = async () => {
    const accepted = await installPrompt.install();
    if (accepted) showToast("باغت روی گوشی‌ات نشست 🌱");
  };

  const handleGuideClose = () => {
    if (!gameState.hasSeenIntro) setGameState((current) => markIntroSeen(current));
    setGuideOpen(false);
  };

  const handleEnergyChange = (energy: EnergyLevel) => {
    setGameState((current) => setTodayEnergy(current, energy, todayKey));
  };

  const handleQuestToggle = (questId: QuestId) => {
    const result = toggleQuest(gameState, questId, todayKey);
    if (result.blocked) {
      showToast(target === 0 ? "اول یک کار به باغت اضافه کن 🌱" : "برای امروز همین‌قدر کافیه؛ باغت خوشحاله 🌱");
      return;
    }

    const nextToday = getDayState(result.state, todayKey);
    if (nextToday.dailyWin && !today.dailyWin) {
      showToast("باغ امروز شکوفه زد؛ آفرین بهت ✨");
    } else if (nextToday.completedQuestIds.length > today.completedQuestIds.length) {
      const remaining = target - nextToday.completedQuestIds.length;
      showToast(remaining > 0 ? `${toPersianDigits(remaining)} قدم کوچیک دیگه تا شکوفه 🌱` : "قدم قشنگی بود 🌱");
    }
    setGameState(result.state);
  };

  const handleReward = (reward: string) => {
    setGameState((current) => setTodayReward(current, reward, todayKey));
    showToast("انتخاب قشنگی بود 💛");
  };

  const handleProfileSave = (profile: Profile) => {
    setGameState((current) => setProfile(current, profile));
    showToast("باغت با سلیقه‌ی تو ذخیره شد 🌷");
  };

  const handleAddTask = (task: TaskDefinition) => {
    setGameState((current) => addTask(current, task));
    showToast(`${task.title} به باغ اضافه شد 🌱`);
  };

  const handleAddReward = (reward: string) => {
    setGameState((current) => addReward(current, reward));
    showToast(`${reward} به جایزه‌ها اضافه شد 💛`);
  };

  const handleRemoveReward = (reward: string) => {
    setGameState((current) => removeReward(current, reward));
    showToast(`${reward} از جایزه‌ها کنار رفت`);
  };

  const handleRemoveTask = (taskId: string) => {
    const task = gameState.tasks.find((item) => item.id === taskId);
    const completedBeforeRemoval = Object.fromEntries(
      Object.entries(gameState.days).map(([dayKey, day]) => [dayKey, day.completedQuestIds.includes(taskId)]),
    );
    setGameState((current) => removeTask(current, taskId));
    if (task) {
      showToast(`${task.title} از باغ بیرون رفت`, {
        label: "برگردان",
        onClick: () => {
          setGameState((current) => restoreTask(current, task, completedBeforeRemoval));
          if (toastTimer.current) window.clearTimeout(toastTimer.current);
          setToast(null);
        },
      });
    }
  };

  return (
    <div
      className="app-shell"
      data-palette={gameState.profile.palette}
      data-theme={resolvedTheme}
      onContextMenu={(event) => {
        const target = event.target as HTMLElement;
        if (!target.closest("input, textarea, [contenteditable='true']")) event.preventDefault();
      }}
      onDragStart={(event) => {
        const target = event.target as HTMLElement;
        if (!target.closest("input, textarea, [contenteditable='true']")) event.preventDefault();
      }}
    >
      <div className="background-orb background-orb--one" aria-hidden="true" />
      <div className="background-orb background-orb--two" aria-hidden="true" />
      <main className="page-shell">
        <GardenHeader
          displayName={gameState.profile.displayName}
          nickname={gameState.profile.nickname}
          avatarSeed={dailyAvatar.seed}
          avatarVariant={dailyAvatar.variant}
          palette={gameState.profile.palette}
          plantStage={gameState.plantStage}
          totalWins={gameState.totalWins}
          gentleStreak={gameState.gentleStreak}
          todayWeekday={todaySummary.weekday}
          todayDate={todaySummary.date}
          onGuide={() => setGuideOpen(true)}
          onSettings={() => setSettingsOpen(true)}
        />

        <div className="page-content">
          <EnergyPicker
            value={today.energy}
            confirmed={today.energyConfirmed}
            isNext={flowStep === "energy"}
            sectionRef={energyRef}
            onChange={handleEnergyChange}
          />
          <GrowthScene
            completedCount={today.completedQuestIds.length}
            target={target}
            totalWins={gameState.totalWins}
            avatarSeed={dailyAvatar.seed}
            avatarVariant={dailyAvatar.variant}
            palette={gameState.profile.palette}
          />
          <WeekMemory days={gameState.days} todayKey={todayKey} />
          <QuestGrid
            quests={gameState.tasks}
            energy={today.energy}
            completedQuestIds={today.completedQuestIds}
            target={target}
            isNext={flowStep === "tasks" || flowStep === "manage"}
            sectionRef={questsRef}
            onManage={() => setTaskManagerOpen(true)}
            onToggle={handleQuestToggle}
          />
          <RewardBanner
            dailyWin={today.dailyWin}
            target={target}
            dayKey={todayKey}
            rewards={gameState.rewards}
            selectedReward={today.rewardChoice}
            isNext={flowStep === "reward"}
            sectionRef={rewardRef}
            onChoose={handleReward}
          />
        </div>

      <footer className="page-footer">
          <span className="footer-leaf" aria-hidden="true">✦</span>
          <span>Apricity؛ گرمای کوچکی برای روزهای سرد.</span>
        </footer>
      </main>

      {!installDismissed && !installPrompt.isInstalled && (
        <InstallPrompt
          canInstall={installPrompt.canInstall}
          isIos={installPrompt.isIos}
          isMobile={installPrompt.isMobile}
          onInstall={handleInstall}
          onDismiss={() => setInstallDismissed(true)}
        />
      )}

      <GuideDrawer open={guideOpen} onClose={handleGuideClose} />
      <SettingsDrawer
        open={settingsOpen}
        profile={gameState.profile}
        rewards={gameState.rewards}
        onClose={() => setSettingsOpen(false)}
        onSave={handleProfileSave}
        onAddReward={handleAddReward}
        onRemoveReward={handleRemoveReward}
      />
      <TaskManagerDrawer
        open={taskManagerOpen}
        tasks={gameState.tasks}
        onClose={() => setTaskManagerOpen(false)}
        onAdd={handleAddTask}
        onRemove={handleRemoveTask}
      />

      {toast && (
        <div className="toast" role="status">
          <span>{toast.message}</span>
          {toast.action && (
            <button type="button" className="toast__action" onClick={toast.action.onClick}>
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
