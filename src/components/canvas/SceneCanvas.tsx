"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles, Stars } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  ExploreProvider,
  ExploreRig,
  useExploreOptional,
} from "./ExploreSequence";

const BACKDROP_COLOR = "#030712";

interface SceneCanvasProps {
  /** 3D subject rendered inside the studio. Falls back to a demo AI orb. */
  children?: ReactNode;
  /** HUD composed by the page (e.g. HeroOverlay). Rendered over the canvas. */
  overlay?: ReactNode;
  className?: string;
  /** Wheel-zoom. Off on the marketing homepage so the page can scroll. */
  enableZoom?: boolean;
}

function useCompactScene() {
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

/**
 * Studio WebGL scene. Layout is always `width/height: 100%` of the parent —
 * never `100vw` — so it cannot introduce a horizontal scrollbar.
 */
export function SceneCanvas({
  children,
  overlay,
  className,
  enableZoom = true,
}: SceneCanvasProps) {
  const subjectRef = useRef<Group>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const compact = useCompactScene();

  return (
    <ExploreProvider>
      <div
        className={`relative h-full w-full min-w-0 overflow-hidden ${className ?? ""}`}
        style={{ background: BACKDROP_COLOR }}
      >
        <Canvas
          shadows={!compact}
          dpr={compact ? [1, 1.25] : [1, 1.75]}
          camera={{ position: compact ? [0, 1.8, 7.2] : [0, 2.2, 8], fov: 45 }}
          gl={{
            antialias: !compact,
            alpha: false,
            powerPreference: compact ? "low-power" : "high-performance",
          }}
          className="absolute inset-0 block h-full w-full touch-none"
          style={{ width: "100%", height: "100%" }}
        >
          <color attach="background" args={[BACKDROP_COLOR]} />
          <fog attach="fog" args={[BACKDROP_COLOR, compact ? 8 : 10, 32]} />

          <ambientLight intensity={0.35} color="#8892b0" />
          <directionalLight
            castShadow={!compact}
            position={[5, 8, 4]}
            intensity={1.4}
            color="#ffffff"
            shadow-mapSize-width={compact ? 1024 : 2048}
            shadow-mapSize-height={compact ? 1024 : 2048}
            shadow-camera-near={0.5}
            shadow-camera-far={30}
            shadow-bias={-0.0005}
          />
          <pointLight
            position={[-4.5, 2, 3.5]}
            intensity={compact ? 12 : 18}
            distance={14}
            decay={2}
            color="#22d3ee"
          />
          <pointLight
            position={[4.5, 1.5, -3]}
            intensity={compact ? 12 : 18}
            distance={14}
            decay={2}
            color="#a855f7"
          />

          <Ground />

          <Sparkles
            count={compact ? 70 : 220}
            scale={[20, 10, 20]}
            size={compact ? 1.6 : 2.2}
            speed={0.3}
            opacity={0.6}
            color="#8a6fff"
          />
          <Stars
            radius={60}
            depth={40}
            count={compact ? 600 : 2800}
            factor={compact ? 2.2 : 3}
            saturation={0}
            fade
            speed={0.4}
          />

          <group ref={subjectRef}>
            <Suspense fallback={null}>{children ?? <DemoOrb />}</Suspense>
          </group>

          <ExploreRig subjectRef={subjectRef} controlsRef={controlsRef} />

          <SceneControls controlsRef={controlsRef} enableZoom={enableZoom} />
        </Canvas>

        {overlay}
      </div>
    </ExploreProvider>
  );
}

function SceneControls({
  controlsRef,
  enableZoom,
}: {
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
  enableZoom: boolean;
}) {
  const explore = useExploreOptional();
  const interactive =
    !explore || explore.state === "idle" || explore.state === "exploring";

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={interactive}
      enableDamping
      dampingFactor={0.06}
      enablePan={false}
      enableZoom={enableZoom}
      minDistance={explore?.state === "exploring" ? 2.2 : 3.5}
      maxDistance={16}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2 - 0.05}
    />
  );
}

function Ground() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#05070d" metalness={0.25} roughness={0.85} />
    </mesh>
  );
}

function DemoOrb() {
  const ref = useRef<Mesh>(null);
  const explore = useExploreOptional();

  useFrame((_, delta) => {
    if (ref.current && !explore?.isSequencing) {
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
