"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { useThree } from "@react-three/fiber";
import { Radar, RotateCcw } from "lucide-react";
import type { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { HERO_PLACEMENT, useCompactScene } from "./useCompactScene";

export type ExploreState = "idle" | "flying" | "exploring" | "returning";

interface ExploreContextValue {
  state: ExploreState;
  isBusy: boolean;
  isSequencing: boolean;
  trigger: () => void;
  complete: () => void;
}

const ExploreContext = createContext<ExploreContextValue | null>(null);

export function useExplore() {
  const ctx = useContext(ExploreContext);
  if (!ctx) {
    throw new Error("useExplore must be used within ExploreProvider");
  }
  return ctx;
}

export function useExploreOptional() {
  return useContext(ExploreContext);
}

export function ExploreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExploreState>("idle");
  const stateRef = useRef(state);
  stateRef.current = state;

  const trigger = useCallback(() => {
    const current = stateRef.current;
    if (current === "flying" || current === "returning") return;
    setState(current === "idle" ? "flying" : "returning");
  }, []);

  const complete = useCallback(() => {
    const current = stateRef.current;
    if (current === "flying") setState("exploring");
    if (current === "returning") setState("idle");
  }, []);

  const value = useMemo<ExploreContextValue>(
    () => ({
      state,
      isBusy: state === "flying" || state === "returning",
      isSequencing: state === "flying" || state === "returning",
      trigger,
      complete,
    }),
    [state, trigger, complete]
  );

  return (
    <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>
  );
}

const REST_CAMERA = { x: 0, y: 2.2, z: 8 } as const;
const LOOK_AT_COMPACT = { x: 0, y: 0.2, z: 0 } as const;

/** Mid-arc drone waypoint, then a tight 3/4 close-up. */
const FLY_WAYPOINT_COMPACT = { x: 3.35, y: 1.75, z: 5.6 } as const;
const FLY_CLOSE_COMPACT = { x: 1.55, y: 0.72, z: 3.55 } as const;

interface ExploreRigProps {
  subjectRef: MutableRefObject<Group | null>;
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
}

/**
 * GSAP-driven fly-in / reset. Lives inside the R3F tree so it can tween
 * `camera.position` and the subject group's rotation with a shared
 * `power3.inOut` timeline.
 */
export function ExploreRig({ subjectRef, controlsRef }: ExploreRigProps) {
  const { camera } = useThree();
  const { state, complete } = useExplore();
  const compact = useCompactScene();
  const timelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const lookAt = useMemo(
    () =>
      compact
        ? LOOK_AT_COMPACT
        : {
            x: HERO_PLACEMENT.desktop.position[0],
            y: HERO_PLACEMENT.desktop.position[1] + 0.15,
            z: HERO_PLACEMENT.desktop.position[2],
          },
    [compact]
  );
  const flyWaypoint = compact
    ? FLY_WAYPOINT_COMPACT
    : { x: 4.15, y: 1.7, z: 5.4 };
  const flyClose = compact
    ? FLY_CLOSE_COMPACT
    : { x: 3.15, y: 0.7, z: 3.7 };

  useEffect(() => {
    const subject = subjectRef.current;
    const controls = controlsRef.current;
    if (!subject) return;

    timelineRef.current?.kill();

    const look = () => {
      camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
      controls?.update();
    };

    if (state === "flying") {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          controls?.target.set(lookAt.x, lookAt.y, lookAt.z);
          controls?.update();
          complete();
        },
      });

      tl.to(
        camera.position,
        { ...flyWaypoint, duration: 1.15, onUpdate: look },
        0
      );
      tl.to(
        camera.position,
        { ...flyClose, duration: 1.25, onUpdate: look },
        0.95
      );
      tl.to(
        subject.rotation,
        { y: subject.rotation.y + Math.PI * 2, duration: 2.4 },
        0
      );
      tl.to(subject.position, { y: 0.28, duration: 2.4 }, 0);
      tl.to(subject.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 2.4 }, 0);

      timelineRef.current = tl;
    }

    if (state === "returning") {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          controls?.target.set(lookAt.x, lookAt.y, lookAt.z);
          controls?.update();
          complete();
        },
      });

      tl.to(
        camera.position,
        { ...REST_CAMERA, duration: 1.8, onUpdate: look },
        0
      );
      tl.to(subject.position, { y: 0, duration: 1.8 }, 0);
      tl.to(subject.scale, { x: 1, y: 1, z: 1, duration: 1.8 }, 0);

      timelineRef.current = tl;
    }

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [camera, complete, controlsRef, flyClose, flyWaypoint, lookAt, state, subjectRef]);

  return null;
}

const LABELS: Record<ExploreState, string> = {
  idle: "EXPLORE",
  flying: "FLY",
  exploring: "RESET",
  returning: "FLY",
};

export function ExploreButton({ className }: { className?: string }) {
  const { state, isBusy, trigger } = useExplore();
  const label = LABELS[state];
  const Icon = state === "exploring" ? RotateCcw : Radar;

  return (
    <Button
      type="button"
      variant={state === "exploring" ? "secondary" : "primary"}
      disabled={isBusy}
      onClick={trigger}
      aria-label={
        state === "exploring"
          ? "Reset camera"
          : "Fly the camera in and rotate the model"
      }
      aria-busy={isBusy}
      className={cn(
        "pointer-events-auto min-w-[9.5rem] tracking-[0.18em] uppercase",
        isBusy && "opacity-80",
        className
      )}
    >
      <Icon
        className={cn("h-4 w-4", isBusy && "animate-spin")}
        aria-hidden
      />
      {label}
    </Button>
  );
}
