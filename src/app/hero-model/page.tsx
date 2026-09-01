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
    <div className="h-[100dvh] w-full overflow-hidden">
      <SceneCanvas
        className="h-full w-full"
        overlay={<HeroOverlay />}
      >
        <HeroModel />
      </SceneCanvas>
    </div>
  );
}
