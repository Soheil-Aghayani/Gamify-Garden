import { useEffect, useRef, useState } from "react";
import { QUESTS } from "./data/quests";
import { getDayKey } from "./lib/date";
import {
  getDayState,
  setProfile,
  setTodayEnergy,
  setTodayReward,
  toggleQuest,
} from "./lib/game";
import { loadGameState, saveGameState } from "./lib/storage";
import type { EnergyLevel, GameState, Profile, QuestId } from "./types/game";
import { EnergyPicker } from "./components/EnergyPicker";
import { GardenHeader } from "./components/GardenHeader";
import { GrowthScene } from "./components/GrowthScene";
import { QuestGrid } from "./components/QuestGrid";
import { RewardBanner } from "./components/RewardBanner";
import { SettingsDrawer } from "./components/SettingsDrawer";
import "./styles.css";

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const todayKey = getDayKey();
  const today = getDayState(gameState, todayKey);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    document.title = `باغ ${gameState.profile.displayName}`;
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
  }, [gameState.profile.displayName]);

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
    setGameState((current) => {
      const result = toggleQuest(current, questId, todayKey);
      if (result.blocked) {
        showToast("سه قدم برای امروز کافیه؛ باغت همین حالا هم خوشحاله 🌱");
        return current;
      }

      const nextToday = getDayState(result.state, todayKey);
      if (nextToday.dailyWin && !today.dailyWin) {
        showToast("باغ امروز شکوفه زد؛ آفرین بهت ✨");
      }
      return result.state;
    });
  };

  const handleReward = (reward: string) => {
    setGameState((current) => setTodayReward(current, reward, todayKey));
    showToast("انتخاب قشنگی بود 💛");
  };

  const handleProfileSave = (profile: Profile) => {
    setGameState((current) => setProfile(current, profile));
    showToast("باغت با سلیقه‌ی تو ذخیره شد 🌷");
  };

  return (
    <div className="app-shell" data-palette={gameState.profile.palette}>
      <div className="background-orb background-orb--one" aria-hidden="true" />
      <div className="background-orb background-orb--two" aria-hidden="true" />
      <main className="page-shell">
        <GardenHeader
          displayName={gameState.profile.displayName}
          totalWins={gameState.totalWins}
          gentleStreak={gameState.gentleStreak}
          onSettings={() => setSettingsOpen(true)}
        />

        <div className="page-content">
          <EnergyPicker value={today.energy} onChange={handleEnergyChange} />
          <GrowthScene completedCount={today.completedQuestIds.length} totalWins={gameState.totalWins} />
          <QuestGrid
            quests={QUESTS}
            energy={today.energy}
            completedQuestIds={today.completedQuestIds}
            onToggle={handleQuestToggle}
          />
          <RewardBanner
            dailyWin={today.dailyWin}
            selectedReward={today.rewardChoice}
            onChoose={handleReward}
          />
        </div>

        <footer className="page-footer">
          <span className="footer-leaf" aria-hidden="true">✦</span>
          <span>آرام و کم‌کم؛ همین‌طوری باغ‌ها ساخته می‌شن.</span>
        </footer>
      </main>

      <SettingsDrawer
        open={settingsOpen}
        profile={gameState.profile}
        onClose={() => setSettingsOpen(false)}
        onSave={handleProfileSave}
      />

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
