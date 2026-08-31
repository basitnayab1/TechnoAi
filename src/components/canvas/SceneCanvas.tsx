"use client";

import { Suspense, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles, Stars } from "@react-three/drei";
import type { Mesh } from "three";

const BACKDROP_COLOR = "#030712";

interface SceneCanvasProps {
  /** Content to render inside the scene. Falls back to a demo AI orb. */
  children?: ReactNode;
  className?: string;
}

/**
 * A reusable, full-screen `@react-three/fiber` canvas wired up as a small
 * "studio" environment: neutral ambient fill, a shadow-casting key light,
 * two neon accent point lights, a shadow-catching ground plane, a subtle
 * particle/star backdrop, and damped orbit controls that can't dip below
 * the ground.
 */
export function SceneCanvas({ children, className }: SceneCanvasProps) {
  return (
    <div
      className={className ?? "h-screen w-screen"}
      style={{ background: BACKDROP_COLOR }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 2.2, 8], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[BACKDROP_COLOR]} />
        <fog attach="fog" args={[BACKDROP_COLOR, 10, 32]} />

        {/* Studio lighting */}
        <ambientLight intensity={0.35} color="#8892b0" />
        <directionalLight
          castShadow
          position={[5, 8, 4]}
          intensity={1.4}
          color="#ffffff"
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={30}
          shadow-bias={-0.0005}
        />
        {/* Cyan neon accent */}
        <pointLight
          position={[-4.5, 2, 3.5]}
          intensity={18}
          distance={14}
          decay={2}
          color="#22d3ee"
        />
        {/* Purple neon accent */}
        <pointLight
          position={[4.5, 1.5, -3]}
          intensity={18}
          distance={14}
          decay={2}
          color="#a855f7"
        />

        <Ground />

        {/* Particle / space backdrop for an AI vibe */}
        <Sparkles
          count={220}
          scale={[20, 10, 20]}
          size={2.2}
          speed={0.3}
          opacity={0.6}
          color="#8a6fff"
        />
        <Stars
          radius={60}
          depth={40}
          count={2800}
          factor={3}
          saturation={0}
          fade
          speed={0.4}
        />

        <Suspense fallback={null}>{children ?? <DemoOrb />}</Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          enablePan={false}
          minDistance={3.5}
          maxDistance={16}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
    </div>
  );
}

/** Large shadow-catching ground plane beneath the scene. */
function Ground() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#05070d" metalness={0.25} roughness={0.85} />
    </mesh>
  );
}

/** Default centerpiece shown when no children are supplied, mostly to
 * demonstrate the shadow-casting lighting setup. */
function DemoOrb() {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <mesh ref={ref} castShadow position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.3, 1]} />
      <meshStandardMaterial
        color="#6d5bff"
        metalness={0.7}
        roughness={0.2}
        emissive="#3a2bd1"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}
