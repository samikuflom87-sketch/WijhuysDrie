import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import LessonScreen from "./screens/LessonScreen";
import { useProgress } from "./hooks/useProgress";

function App() {
  const { progress, completeLesson } = useProgress();

  return (
    <Routes>
      <Route path="/" element={<Home progress={progress} />} />
      <Route
        path="/lesson/:id"
        element={
          <LessonScreen onCompleteLesson={completeLesson} />
        }
      />
    </Routes>
  );
}

export default App;
