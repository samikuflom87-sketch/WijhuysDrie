import { useEffect } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT_FAST } from "./lib/motion";
import { setAppBadge } from "./lib/appBadge";
import Home from "./screens/Home";
import LessonScreen from "./screens/LessonScreen";
import Settings from "./screens/Settings";
import Achievements from "./screens/Achievements";
import WordCollection from "./screens/WordCollection";
import Mistakes from "./screens/Mistakes";
import Quests from "./screens/Quests";
import PlacementTest from "./screens/PlacementTest";
import PracticeHub from "./screens/PracticeHub";
import Shop from "./screens/Shop";
import { useProgress } from "./hooks/useProgress";
import { useWordStats } from "./hooks/useWordStats";
import { pickReviewWords } from "./lib/wordStats";
import lessonsData from "./data/lessons.json";
import { SettingsProvider } from "./context/SettingsContext";
import { useSettingsContext } from "./context/SettingsContext";

function PageTransition({ children }) {
  const { settings } = useSettingsContext();
  if (settings.reducedMotion) return children;
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={EASE_OUT_FAST}
    >
      {children}
    </motion.div>
  );
}

function PracticeModeLesson(props) {
  const { mode } = useParams();
  return <LessonScreen {...props} practiceMode={mode} />;
}

function AnimatedRoutes({
  progress,
  stats,
  completeLesson,
  unlockBadges,
  unlockAccessories,
  addXp,
  spendGems,
  repairStreak,
  dismissStreakRepairBanner,
  claimQuest,
  purchaseAccessory,
  applyPlacement,
  updateSetting,
  resetProgress,
  introduce,
  record,
}) {
  const location = useLocation();
  const hasReviewWords = pickReviewWords(stats, lessonsData.lessons, 1).length > 0;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home
                progress={progress}
                wordStats={stats}
                onSetGoal={(goal) => updateSetting("goal", goal)}
                onRepairStreak={repairStreak}
                onDismissStreakRepair={dismissStreakRepairBanner}
              />
            </PageTransition>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <PageTransition>
              <LessonScreen
                progress={progress}
                wordStats={stats}
                onCompleteLesson={completeLesson}
                onIntroduceWord={introduce}
                onRecordAttempt={record}
                onUnlockBadges={unlockBadges}
                onUnlockAccessories={unlockAccessories}
                onAddXp={addXp}
                onSpendGems={spendGems}
              />
            </PageTransition>
          }
        />
        <Route
          path="/review"
          element={
            <PageTransition>
              <LessonScreen
                progress={progress}
                wordStats={stats}
                onCompleteLesson={completeLesson}
                onIntroduceWord={introduce}
                onRecordAttempt={record}
                onUnlockBadges={unlockBadges}
                onUnlockAccessories={unlockAccessories}
                onAddXp={addXp}
                onSpendGems={spendGems}
                isReview
              />
            </PageTransition>
          }
        />
        <Route
          path="/practice"
          element={
            <PageTransition>
              <PracticeHub hasReviewWords={hasReviewWords} />
            </PageTransition>
          }
        />
        <Route
          path="/practice/:mode"
          element={
            <PageTransition>
              <PracticeModeLesson
                progress={progress}
                wordStats={stats}
                onCompleteLesson={completeLesson}
                onIntroduceWord={introduce}
                onRecordAttempt={record}
                onUnlockBadges={unlockBadges}
                onUnlockAccessories={unlockAccessories}
                onAddXp={addXp}
                onSpendGems={spendGems}
              />
            </PageTransition>
          }
        />
        <Route
          path="/placement"
          element={
            <PageTransition>
              <PlacementTest onFinish={applyPlacement} />
            </PageTransition>
          }
        />
        <Route
          path="/quests"
          element={
            <PageTransition>
              <Quests progress={progress} onClaimQuest={claimQuest} />
            </PageTransition>
          }
        />
        <Route
          path="/mistakes"
          element={
            <PageTransition>
              <Mistakes wordStats={stats} />
            </PageTransition>
          }
        />
        <Route
          path="/shop"
          element={
            <PageTransition>
              <Shop progress={progress} onPurchase={purchaseAccessory} />
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition>
              <Settings
                progress={progress}
                onUpdateProgressField={updateSetting}
                onResetProgress={resetProgress}
              />
            </PageTransition>
          }
        />
        <Route
          path="/achievements"
          element={
            <PageTransition>
              <Achievements progress={progress} wordStats={stats} />
            </PageTransition>
          }
        />
        <Route
          path="/words"
          element={
            <PageTransition>
              <WordCollection wordStats={stats} />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const {
    progress,
    completeLesson,
    unlockBadges,
    unlockAccessories,
    addXp,
    spendGems,
    repairStreak,
    dismissStreakRepairBanner,
    claimQuest,
    purchaseAccessory,
    applyPlacement,
    updateSetting,
    resetProgress,
  } = useProgress();
  const { stats, introduce, record } = useWordStats();

  useEffect(() => {
    setAppBadge(progress.streak);
  }, [progress.streak]);

  return (
    <SettingsProvider>
      <AnimatedRoutes
        progress={progress}
        stats={stats}
        completeLesson={completeLesson}
        unlockBadges={unlockBadges}
        unlockAccessories={unlockAccessories}
        addXp={addXp}
        spendGems={spendGems}
        repairStreak={repairStreak}
        dismissStreakRepairBanner={dismissStreakRepairBanner}
        claimQuest={claimQuest}
        purchaseAccessory={purchaseAccessory}
        applyPlacement={applyPlacement}
        updateSetting={updateSetting}
        resetProgress={resetProgress}
        introduce={introduce}
        record={record}
      />
    </SettingsProvider>
  );
}

export default App;
