"use client";

import { Suspense, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import { MathUtils, type Mesh, type MeshPhysicalMaterial } from "three";
import { useExploreOptional } from "./ExploreSequence";

const BASE_SCALE = 1;
const HOVER_SCALE = 1.16;
const BASE_GLOW = 0.35;
const HOVER_GLOW = 1.1;

/**
 * Procedural metallic torus-knot standing in for the hero's 3D asset.
 *
 * This is intentionally geometry-only (no `useGLTF`) so it renders
 * instantly with zero network requests. Once a real GLTF is ready, swap
 * the `<mesh>` body below for `useGLTF("/models/hero.glb")` — the
 * `Float` wrapper, hover interactions, and the `<Suspense>` boundary in
 * `HeroModel` (which will then actually suspend on the asset fetch) can
 * stay exactly as they are.
 */
function HeroShape() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshPhysicalMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const explore = useExploreOptional();

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    if (!explore?.isSequencing) {
      mesh.rotation.x += delta * 0.22;
      mesh.rotation.y += delta * 0.32;
    }

    const targetScale = hovered ? HOVER_SCALE : BASE_SCALE;
    const nextScale = MathUtils.lerp(mesh.scale.x, targetScale, delta * 6);
    mesh.scale.setScalar(nextScale);

    const targetGlow = hovered ? HOVER_GLOW : BASE_GLOW;
    material.emissiveIntensity = MathUtils.lerp(
      material.emissiveIntensity,
      targetGlow,
      delta * 6
    );
  });

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh
        ref={meshRef}
        castShadow
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <torusKnotGeometry args={[1, 0.32, 220, 32]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#6d5bff"
          emissive="#00e5c7"
          emissiveIntensity={BASE_GLOW}
          metalness={0.9}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.12}
          reflectivity={0.6}
        />
      </mesh>
    </Float>
  );
}

/** Minimalist neon ring spinner, rendered as DOM content positioned in 3D
 * space via drei's `<Html>` so it can act as a valid `<Suspense>` fallback
 * inside the R3F scene graph. */
function HeroModelLoader() {
  return (
    <Html center>
      <div
        role="status"
        aria-label="Loading 3D model"
        className="h-12 w-12 animate-spin rounded-full border-2 border-primary-300/20 border-t-accent shadow-[0_0_18px_2px_rgba(0,229,199,0.45)]"
      />
    </Html>
  );
}

/**
 * Interactive hero centerpiece: a metallic, glowing torus knot that floats
 * continuously and reacts to hover with a scale bump + brighter glow.
 * Drop it directly inside a `<Canvas>` — it carries its own `<Suspense>`
 * boundary and neon loader fallback.
 */
export function HeroModel() {
  return (
    <Suspense fallback={<HeroModelLoader />}>
      <HeroShape />
    </Suspense>
  );
}

export { HeroModelLoader };
