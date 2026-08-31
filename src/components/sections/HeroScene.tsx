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

/** Full-viewport 3D hero used on the marketing homepage. */
export function HeroScene() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <SceneCanvas className="h-full w-full" enableZoom={false}>
        <HeroModel />
      </SceneCanvas>
    </section>
  );
}
