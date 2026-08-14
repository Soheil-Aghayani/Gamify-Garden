import { useEffect, useRef, useState } from "react";
import { getDayKey } from "./lib/date";
import {
  addTask,
  getDailyTarget,
  getDayState,
  removeTask,
  setProfile,
  setTodayEnergy,
  setTodayReward,
  toggleQuest,
} from "./lib/game";
import { loadGameState, saveGameState } from "./lib/storage";
import type { EnergyLevel, GameState, Profile, QuestId, TaskDefinition } from "./types/game";
import { EnergyPicker } from "./components/EnergyPicker";
import { GardenHeader } from "./components/GardenHeader";
import { GrowthScene } from "./components/GrowthScene";
import { GuideDrawer } from "./components/GuideDrawer";
import { QuestGrid } from "./components/QuestGrid";
import { RewardBanner } from "./components/RewardBanner";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { TaskManagerDrawer } from "./components/TaskManagerDrawer";
import "./styles.css";

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [taskManagerOpen, setTaskManagerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const todayKey = getDayKey();
  const today = getDayState(gameState, todayKey);
  const target = getDailyTarget(gameState);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    document.title = `${gameState.profile.nickname} | باغ قدم‌های کوچک`;
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
  }, [gameState.profile.nickname]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
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

  const handleRemoveTask = (taskId: string) => {
    const task = gameState.tasks.find((item) => item.id === taskId);
    setGameState((current) => removeTask(current, taskId));
    if (task) showToast(`${task.title} از باغ بیرون رفت`);
  };

  return (
    <div className="app-shell" data-palette={gameState.profile.palette}>
      <div className="background-orb background-orb--one" aria-hidden="true" />
      <div className="background-orb background-orb--two" aria-hidden="true" />
      <main className="page-shell">
        <GardenHeader
          displayName={gameState.profile.displayName}
          nickname={gameState.profile.nickname}
          totalWins={gameState.totalWins}
          gentleStreak={gameState.gentleStreak}
          onGuide={() => setGuideOpen(true)}
          onSettings={() => setSettingsOpen(true)}
        />

        <div className="page-content">
          <EnergyPicker value={today.energy} onChange={handleEnergyChange} />
          <GrowthScene completedCount={today.completedQuestIds.length} target={target} totalWins={gameState.totalWins} />
          <QuestGrid
            quests={gameState.tasks}
            energy={today.energy}
            completedQuestIds={today.completedQuestIds}
            target={target}
            onManage={() => setTaskManagerOpen(true)}
            onToggle={handleQuestToggle}
          />
          <RewardBanner
            dailyWin={today.dailyWin}
            target={target}
            selectedReward={today.rewardChoice}
            onChoose={handleReward}
          />
        </div>

        <footer className="page-footer">
          <span className="footer-leaf" aria-hidden="true">✦</span>
          <span>Apricity؛ گرمای کوچکی برای روزهای سرد.</span>
        </footer>
      </main>

      <GuideDrawer open={guideOpen} onClose={() => setGuideOpen(false)} />
      <SettingsDrawer
        open={settingsOpen}
        profile={gameState.profile}
        onClose={() => setSettingsOpen(false)}
        onSave={handleProfileSave}
      />
      <TaskManagerDrawer
        open={taskManagerOpen}
        tasks={gameState.tasks}
        onClose={() => setTaskManagerOpen(false)}
        onAdd={handleAddTask}
        onRemove={handleRemoveTask}
      />

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
