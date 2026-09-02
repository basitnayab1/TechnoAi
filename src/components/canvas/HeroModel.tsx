"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, useGLTF } from "@react-three/drei";
import { Box3, MathUtils, Vector3, type Group } from "three";
import { X } from "lucide-react";
import { cn, glassHover, glassPad, glassPanel } from "@/lib/utils";
import { siteContent } from "@/lib/content";
import { useExploreOptional } from "./ExploreSequence";
import { HERO_PLACEMENT, useCompactScene } from "./useCompactScene";

const DRONE_MODEL_PATH = "/models/drone.glb";
const BASE_SCALE = 1;
const HOVER_SCALE = 1.08;
/** Normalized bounding size so the drone reads clearly at every camera distance. */
const TARGET_SIZE = 2.6;

interface HotspotData {
  id: string;
  code: string;
  title: string;
  description: string;
  /** Local position in the (unscaled) outer group's coordinate space. */
  position: [number, number, number];
  /**
   * Which side the detail card opens toward. Hotspots anchored low on the
   * model open "up" so their card can't get clipped by the canvas's bottom
   * edge — the canvas is only `45vh` tall on mobile (see SceneCanvas.tsx).
   */
  cardPlacement: "up" | "down";
}

const HOTSPOTS: HotspotData[] = [
  {
    id: "ai-core",
    code: "01",
    title: siteContent.domains[0].title,
    description: siteContent.domains[0].description,
    position: [0, 0.95, 0.25],
    cardPlacement: "down",
  },
  {
    id: "sensors",
    code: "02",
    title: siteContent.domains[1].title,
    description: siteContent.domains[1].description,
    position: [1.35, 0.05, 0.45],
    cardPlacement: "down",
  },
  {
    id: "engines",
    code: "03",
    title: siteContent.domains[2].title,
    description: siteContent.domains[2].description,
    position: [-1.2, -0.35, -0.5],
    cardPlacement: "up",
  },
];

function HeroShape() {
  const outerRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const { scene } = useGLTF(DRONE_MODEL_PATH);
  const [hovered, setHovered] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const explore = useExploreOptional();
  const compact = useCompactScene();
  const placement = compact ? HERO_PLACEMENT.compact : HERO_PLACEMENT.desktop;

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    clone.position.sub(center);
    clone.traverse((child) => {
      if ("isMesh" in child && child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const maxDim = Math.max(size.x, size.y, size.z);
    const normalizedScale = TARGET_SIZE / maxDim;

    return { node: clone, normalizedScale };
  }, [scene]);

  useFrame((_, delta) => {
    const outer = outerRef.current;
    const model3d = modelRef.current;
    if (!outer || !model3d) return;

    if (!explore?.isSequencing) {
      outer.rotation.y += delta * 0.22;
    }

    const currentMultiplier = model3d.scale.x / model.normalizedScale;
    const nextMultiplier = MathUtils.lerp(
      currentMultiplier,
      hovered ? HOVER_SCALE : BASE_SCALE,
      delta * 6
    );
    const scale = model.normalizedScale * nextMultiplier;
    model3d.scale.setScalar(scale);
  });

  return (
    <group position={placement.position} scale={placement.scale}>
      <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.1}>
        <group ref={outerRef} rotation={[0.08, 0.55, 0]}>
          <group
            ref={modelRef}
            scale={model.normalizedScale}
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
            <primitive object={model.node} />
          </group>

          {HOTSPOTS.map((hotspot) => (
            <Hotspot
              key={hotspot.id}
              hotspot={hotspot}
              isActive={activeHotspot === hotspot.id}
              onToggle={() =>
                setActiveHotspot((current) =>
                  current === hotspot.id ? null : hotspot.id
                )
              }
            />
          ))}
        </group>
      </Float>
    </group>
  );
}

/**
 * A 3D-anchored HTML hotspot: a pulsing neon badge that tracks the drone's
 * position/rotation, and toggles a glassmorphism detail card on click.
 */
function Hotspot({
  hotspot,
  isActive,
  onToggle,
}: {
  hotspot: HotspotData;
  isActive: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const highlighted = hovered || isActive;

  return (
    <Html position={hotspot.position} center zIndexRange={[60, 0]}>
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          aria-label={`${hotspot.title} hotspot`}
          aria-expanded={isActive}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
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
          className={cn(
            "relative flex h-8 w-8 select-none items-center justify-center rounded-full border border-cyan-400/60 bg-black/40 font-mono text-xs font-bold tracking-widest text-cyan-300 backdrop-blur-sm transition-all duration-300 ease-out lg:text-sm",
            "shadow-[0_0_12px_2px_rgba(0,240,255,0.25)]",
            highlighted &&
              "scale-125 border-cyan-400 bg-cyan-400/20 text-white shadow-[0_0_26px_6px_rgba(0,240,255,0.55)]"
          )}
        >
          <span
            className={cn(
              "pointer-events-none absolute -inset-1 rounded-full border border-cyan-400/30 animate-ping",
              isActive && "pause-anim"
            )}
          />
          <span className="relative">{hotspot.code}</span>
        </button>

        {isActive && (
          <div
            role="dialog"
            aria-label={hotspot.title}
            className={cn(
              glassPanel,
              glassHover,
              glassPad,
              "pointer-events-auto absolute left-1/2 z-50 w-44 max-w-[65vw] -translate-x-1/2 animate-fade-up text-left sm:w-52 sm:max-w-[60vw] md:w-56",
              hotspot.cardPlacement === "up"
                ? "bottom-full mb-3"
                : "top-full mt-3"
            )}
          >
            <button
              type="button"
              aria-label="Close details"
              onClick={(event) => {
                event.stopPropagation();
                onToggle();
              }}
              className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full text-foreground/50 hover:text-foreground sm:right-2.5 sm:top-2.5 sm:h-5 sm:w-5"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="font-mono text-xs font-bold tracking-widest text-cyan-300 lg:text-sm">
              {hotspot.code}
            </p>
            <h4 className="mt-1 pr-4 text-xs font-semibold leading-snug text-white sm:text-sm">
              {hotspot.title}
            </h4>
            <p className="mt-1 text-[11px] leading-relaxed text-foreground/65 sm:mt-1.5 sm:text-xs">
              {hotspot.description}
            </p>
          </div>
        )}
      </div>
    </Html>
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
 * Interactive hero centerpiece: a floating drone GLTF with three glowing
 * HTML hotspots ("01" AI Core, "02" Sensors, "03" Engines) that stay
 * anchored to the model as it rotates and float. Clicking a hotspot opens a
 * glassmorphism detail card. Drop it directly inside a `<Canvas>` — it
 * carries its own `<Suspense>` boundary and neon loader fallback.
 */
export function HeroModel() {
  return (
    <Suspense fallback={<HeroModelLoader />}>
      <HeroShape />
    </Suspense>
  );
}

export { HeroModelLoader };

useGLTF.preload(DRONE_MODEL_PATH);
