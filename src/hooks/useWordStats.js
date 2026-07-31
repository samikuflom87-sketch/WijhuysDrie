import { useCallback, useEffect, useState } from "react";
import {
  loadWordStats,
  saveWordStats,
  markIntroduced,
  recordAttempt,
} from "../lib/wordStats";

export function useWordStats() {
  const [stats, setStats] = useState(loadWordStats);

  useEffect(() => {
    saveWordStats(stats);
  }, [stats]);

  const introduce = useCallback((id) => {
    setStats((prev) => markIntroduced(prev, id));
  }, []);

  const record = useCallback((id, wasCorrect) => {
    setStats((prev) => recordAttempt(prev, id, wasCorrect));
  }, []);

  return { stats, introduce, record };
}
