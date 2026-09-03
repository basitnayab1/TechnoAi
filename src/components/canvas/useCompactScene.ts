"use client";
import { useEffect, useState } from "react";
export function useCompactScene() {
  const [compact, setCompact] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return compact;
}
export const HERO_PLACEMENT = {
  compact: { position: [0, 0.12, 0] as [number, number, number], scale: 1 },
  desktop: { position: [2, 0.06, 0] as [number, number, number], scale: 0.8 },
} as const;
