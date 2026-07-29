import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./screens/Home";
import LessonScreen from "./screens/LessonScreen";
import Settings from "./screens/Settings";
import Achievements from "./screens/Achievements";
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
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes({ progress, stats, completeLesson, unlockBadges, updateSetting, resetProgress, introduce, record }) {
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
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { progress, completeLesson, unlockBadges, updateSetting, resetProgress } = useProgress();
  const { stats, introduce, record } = useWordStats();

  return (
    <SettingsProvider>
      <AnimatedRoutes
        progress={progress}
        stats={stats}
        completeLesson={completeLesson}
        unlockBadges={unlockBadges}
        updateSetting={updateSetting}
        resetProgress={resetProgress}
        introduce={introduce}
        record={record}
      />
    </SettingsProvider>
  );
}

export default App;
