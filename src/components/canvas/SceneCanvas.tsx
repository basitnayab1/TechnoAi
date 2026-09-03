"use client";

import {
  Suspense,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles, Stars } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2, type Group, type Mesh } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  ExploreProvider,
  ExploreRig,
  useExploreOptional,
} from "./ExploreSequence";
import { CameraFocusProvider, CameraFocusRig, useCameraFocusOptional } from "./CameraFocus";
import { CameraZoomProvider, CameraZoomRig, useCameraZoomOptional } from "./CameraZoom";
import { DEFAULT_CAMERA } from "./hotspots";
import { useCompactScene } from "./useCompactScene";

interface SceneCanvasProps {
  /** 3D subject rendered inside the studio. Falls back to a demo AI orb. */
  children?: ReactNode;
  /** HUD composed by the page (e.g. HeroOverlay). Rendered over the canvas. */
  overlay?: ReactNode;
  className?: string;
  /** Wheel-zoom. Off on the marketing homepage so the page can scroll. */
  enableZoom?: boolean;
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
  const chromaticOffset = useMemo(
    () => new Vector2(compact ? 0.0003 : 0.0006, compact ? 0.0003 : 0.0006),
    [compact]
  );

  return (
    <ExploreProvider>
    <CameraFocusProvider>
    <CameraZoomProvider>
      {/*
       * Root stacking context for the studio. On mobile this behaves as a
       * flex column: the canvas wrapper below claims a fixed `45vh` at the
       * top, and the (absolutely positioned) `overlay` lays its text panel
       * out in the remaining `55vh` beneath it. On desktop the canvas
       * wrapper grows to `h-screen` and the overlay resumes its classic
       * full-bleed split look — see HeroOverlay.tsx.
       */}
      <div
        className={`relative flex h-full w-full min-w-0 flex-col overflow-hidden bg-transparent ${className ?? ""}`}
      >
        {/* Canvas wrapper: relative, full width, h-[45vh] on mobile so the
         * drone stays fully visible above the text panel; h-screen on
         * desktop restores the full-bleed backdrop behind the split overlay. */}
        <div className="relative h-[45vh] w-full md:h-screen">
          <Canvas
            shadows={!compact}
            dpr={compact ? [1, 1.25] : [1, 2]}
            camera={{
              position: compact ? [0, 0.35, 5.2] : DEFAULT_CAMERA,
              fov: compact ? 60 : 45,
            }}
            gl={{
              antialias: true,
              alpha: true,
              premultipliedAlpha: true,
              powerPreference: compact ? "low-power" : "high-performance",
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
            className="absolute inset-0 z-[2] block h-full w-full touch-none bg-transparent"
            style={{ width: "100%", height: "100%", background: "transparent" }}
          >
          <fog attach="fog" args={["#030712", compact ? 14 : 18, 40]} />

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
            count={compact ? 50 : 120}
            scale={[20, 10, 20]}
            size={compact ? 1.6 : 2.2}
            speed={0.3}
            opacity={0.45}
            color="#8a6fff"
          />
          <Stars
            radius={60}
            depth={40}
            count={compact ? 220 : 900}
            factor={compact ? 2.2 : 3}
            saturation={0}
            fade
            speed={0.4}
          />

          <group ref={subjectRef}>
            <Suspense fallback={null}>{children ?? <DemoOrb />}</Suspense>
          </group>

          <ExploreRig subjectRef={subjectRef} controlsRef={controlsRef} />
          <CameraFocusRig controlsRef={controlsRef} />
          <CameraZoomRig controlsRef={controlsRef} />

          <SceneControls controlsRef={controlsRef} enableZoom={enableZoom} />

          {/*
           * Single-pass post-processing stack. `postprocessing` merges
           * Bloom + ChromaticAberration + Vignette into one shared fragment
           * shader, so adding all three here costs roughly the same as one
           * effect. Mobile ("compact") drops MSAA and renders the effect
           * buffer at a reduced resolution to keep frame time low; desktop
           * gets a touch more antialiasing since it has GPU headroom.
           */}
          <EffectComposer
            multisampling={compact ? 0 : 4}
            resolutionScale={compact ? 0.75 : 1}
            enableNormalPass={false}
          >
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              intensity={1.2}
              mipmapBlur
              radius={0.55}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={chromaticOffset}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.4} darkness={0.45} />
          </EffectComposer>
          </Canvas>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem]"
          />
        </div>

        {overlay}
      </div>
    </CameraZoomProvider>
    </CameraFocusProvider>
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
  const focus = useCameraFocusOptional();
  const zoom = useCameraZoomOptional();
  const compact = useCompactScene();
  const interactive =
    (!explore || explore.state === "idle" || explore.state === "exploring") &&
    !focus?.isAnimating &&
    !focus?.orbitLocked &&
    !focus?.activeHotspot &&
    !zoom?.isZooming;
  const minDistance = focus?.activeHotspot
    ? 1.4
    : zoom?.minDistance ?? (explore?.state === "exploring" ? 2.2 : 3.5);
  const maxDistance = zoom?.maxDistance ?? 16;

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={interactive}
      enableDamping
      dampingFactor={0.06}
      enablePan={false}
      enableZoom={enableZoom}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2 - 0.05}
      target={compact ? [0, 0.2, 0] : [2, 0.2, 0]}
    />
  );
}

function Ground() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[80, 80]} />
      <shadowMaterial transparent opacity={0.32} />
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
