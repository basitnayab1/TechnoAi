"use client";

import dynamic from "next/dynamic";
import { HeroOverlay } from "@/components/layout/HeroOverlay";

const SceneCanvas = dynamic(
  () => import("@/components/canvas/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false }
);
const HeroModel = dynamic(
  () => import("@/components/canvas/HeroModel").then((mod) => mod.HeroModel),
  { ssr: false }
);

export default function HeroModelDemoPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 z-0 h-full w-full">
        <SceneCanvas className="h-full w-full">
          <HeroModel />
        </SceneCanvas>
      </div>

      <div className="relative z-10 h-full w-full pointer-events-none">
        <HeroOverlay />
      </div>
    </main>
  );
}
