import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import LessonScreen from "./screens/LessonScreen";
import Settings from "./screens/Settings";
import Achievements from "./screens/Achievements";
import { useProgress } from "./hooks/useProgress";
import { useWordStats } from "./hooks/useWordStats";
import { SettingsProvider } from "./context/SettingsContext";

function App() {
  const { progress, completeLesson, unlockBadges, updateSetting, resetProgress } = useProgress();
  const { stats, introduce, record } = useWordStats();

  return (
    <SettingsProvider>
      <Routes>
        <Route
          path="/"
          element={<Home progress={progress} wordStats={stats} />}
        />
        <Route
          path="/lesson/:id"
          element={
            <LessonScreen
              progress={progress}
              wordStats={stats}
              onCompleteLesson={completeLesson}
              onIntroduceWord={introduce}
              onRecordAttempt={record}
              onUnlockBadges={unlockBadges}
            />
          }
        />
        <Route
          path="/review"
          element={
            <LessonScreen
              progress={progress}
              wordStats={stats}
              onCompleteLesson={completeLesson}
              onIntroduceWord={introduce}
              onRecordAttempt={record}
              onUnlockBadges={unlockBadges}
              isReview
            />
          }
        />
        <Route
          path="/settings"
          element={
            <Settings
              progress={progress}
              onUpdateProgressField={updateSetting}
              onResetProgress={resetProgress}
            />
          }
        />
        <Route
          path="/achievements"
          element={<Achievements progress={progress} wordStats={stats} />}
        />
      </Routes>
    </SettingsProvider>
  );
}

export default App;
