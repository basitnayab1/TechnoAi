"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AICore } from "./AICore";
import { ParticleField } from "./ParticleField";

/**
 * The full-bleed 3D scene rendered behind the hero content. Wrapped in
 * `Suspense` so drei's async material/geometry loading never blocks paint.
 */
export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <AICore />
        <ParticleField />
      </Suspense>
    </Canvas>
  );
}
