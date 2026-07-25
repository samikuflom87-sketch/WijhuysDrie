import { useCallback, useEffect, useState } from "react";
import { loadProgress, saveProgress, applyLessonComplete } from "../lib/storage";

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeLesson = useCallback((lessonId, xpEarned) => {
    setProgress((prev) => applyLessonComplete(prev, lessonId, xpEarned));
  }, []);

  return { progress, completeLesson };
}
