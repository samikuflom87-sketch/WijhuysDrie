import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT_FAST } from "./lib/motion";
import { setAppBadge } from "./lib/appBadge";
import Home from "./screens/Home";
import LessonScreen from "./screens/LessonScreen";
import Settings from "./screens/Settings";
import Achievements from "./screens/Achievements";
import WordCollection from "./screens/WordCollection";
import { useProgress } from "./hooks/useProgress";
import { useWordStats } from "./hooks/useWordStats";
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

function AnimatedRoutes({ progress, stats, completeLesson, unlockBadges, unlockAccessories, addXp, updateSetting, resetProgress, introduce, record }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home progress={progress} wordStats={stats} />
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
                isReview
              />
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
  const { progress, completeLesson, unlockBadges, unlockAccessories, addXp, updateSetting, resetProgress } = useProgress();
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
        updateSetting={updateSetting}
        resetProgress={resetProgress}
        introduce={introduce}
        record={record}
      />
    </SettingsProvider>
  );
}

export default App;
