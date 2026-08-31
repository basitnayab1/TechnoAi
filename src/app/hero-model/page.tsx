"use client";

import dynamic from "next/dynamic";

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
    <SceneCanvas>
      <HeroModel />
    </SceneCanvas>
  );
}
