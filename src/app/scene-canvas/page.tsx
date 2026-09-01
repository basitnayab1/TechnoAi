"use client";

import dynamic from "next/dynamic";

const SceneCanvas = dynamic(
  () => import("@/components/canvas/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function SceneCanvasDemoPage() {
  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <SceneCanvas className="h-full w-full" />
    </div>
  );
}
