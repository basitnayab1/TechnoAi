"use client";

import dynamic from "next/dynamic";
import { AmbientBackdrop } from "@/components/layout/AmbientBackdrop";
import { HeroOverlay } from "@/components/layout/HeroOverlay";
import { Navbar } from "@/components/layout/Navbar";

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
    <main className="relative h-screen w-full overflow-x-hidden overflow-hidden bg-transparent">
      <AmbientBackdrop />
      <Navbar />
      <div className="absolute inset-0 z-0 h-full w-full">
        <SceneCanvas className="h-full w-full" overlay={<HeroOverlay />}>
          <HeroModel />
        </SceneCanvas>
      </div>
    </main>
  );
}
