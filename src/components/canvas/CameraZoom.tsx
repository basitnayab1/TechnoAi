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
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { gsap } from "@/lib/gsap";
import { useExploreOptional } from "./ExploreSequence";
import { useCameraFocusOptional } from "./CameraFocus";
import { useCompactScene } from "./useCompactScene";

/** Closest the camera may sit to the orbit target. */
export const ZOOM_MIN_DESKTOP = 2.05;
export const ZOOM_MIN_COMPACT = 2.35;
/** Farthest pull-back. */
export const ZOOM_MAX = 11;
const ZOOM_IN_FACTOR = 0.78;
const ZOOM_OUT_FACTOR = 1.28;
const TWEEN_DURATION = 0.42;

interface CameraZoomContextValue {
  distance: number;
  minDistance: number;
  maxDistance: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  isBusy: boolean;
  isZooming: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  setDistance: (next: number) => void;
}

const CameraZoomContext = createContext<CameraZoomContextValue | null>(null);

export function useCameraZoom() {
  const ctx = useContext(CameraZoomContext);
  if (!ctx) {
    throw new Error("useCameraZoom must be used within CameraZoomProvider");
  }
  return ctx;
}

export function useCameraZoomOptional() {
  return useContext(CameraZoomContext);
}

function clampDistance(value: number, min: number, max: number) {
  return MathUtils.clamp(value, min, max);
}

interface ZoomCommandBridge {
  command: { id: number; target: number; immediate?: boolean } | null;
  reportDistance: (next: number) => void;
  clearCommand: () => void;
}

const CameraZoomCommandContext = createContext<ZoomCommandBridge | null>(null);

export function CameraZoomProvider({ children }: { children: ReactNode }) {
  const compact = useCompactScene();
  const minDistance = compact ? ZOOM_MIN_COMPACT : ZOOM_MIN_DESKTOP;
  const [distance, setDistanceState] = useState(compact ? 5.2 : 6);
  const [command, setCommand] = useState<{
    id: number;
    target: number;
    immediate?: boolean;
  } | null>(null);
  const commandId = useRef(0);
  const distanceRef = useRef(distance);
  distanceRef.current = distance;

  const explore = useExploreOptional();
  const focus = useCameraFocusOptional();
  const isBusy = Boolean(explore?.isSequencing || focus?.isAnimating);

  const requestDistance = useCallback(
    (next: number, immediate = false) => {
      if (isBusy) return;
      const target = clampDistance(next, minDistance, ZOOM_MAX);
      if (Math.abs(target - distanceRef.current) < 0.02) return;
      commandId.current += 1;
      setCommand({ id: commandId.current, target, immediate });
    },
    [isBusy, minDistance]
  );

  const zoomIn = useCallback(() => {
    requestDistance(distanceRef.current * ZOOM_IN_FACTOR);
  }, [requestDistance]);

  const zoomOut = useCallback(() => {
    requestDistance(distanceRef.current * ZOOM_OUT_FACTOR);
  }, [requestDistance]);

  const setDistance = useCallback(
    (next: number) => {
      requestDistance(next, true);
    },
    [requestDistance]
  );

  const reportDistance = useCallback((next: number) => {
    const rounded = Math.round(next * 40) / 40;
    if (Math.abs(rounded - distanceRef.current) < 0.02) return;
    setDistanceState(rounded);
  }, []);

  const value = useMemo<CameraZoomContextValue>(
    () => ({
      distance,
      minDistance,
      maxDistance: ZOOM_MAX,
      canZoomIn: !isBusy && distance > minDistance + 0.04,
      canZoomOut: !isBusy && distance < ZOOM_MAX - 0.04,
      isBusy,
      isZooming: command !== null,
      zoomIn,
      zoomOut,
      setDistance,
    }),
    [command, distance, isBusy, minDistance, setDistance, zoomIn, zoomOut]
  );

  const commandBridge = useMemo<ZoomCommandBridge>(
    () => ({
      command,
      reportDistance,
      clearCommand: () => setCommand(null),
    }),
    [command, reportDistance]
  );

  return (
    <CameraZoomContext.Provider value={value}>
      <CameraZoomCommandContext.Provider value={commandBridge}>
        {children}
      </CameraZoomCommandContext.Provider>
    </CameraZoomContext.Provider>
  );
}

function useZoomCommand() {
  const ctx = useContext(CameraZoomCommandContext);
  if (!ctx) {
    throw new Error("CameraZoomRig must be used within CameraZoomProvider");
  }
  return ctx;
}

const scratchOffset = new Vector3();

function applyDistance(
  camera: { position: Vector3; lookAt: (x: number, y: number, z: number) => void },
  target: Vector3,
  distance: number,
  controls: OrbitControlsImpl | null
) {
  scratchOffset.copy(camera.position).sub(target);
  if (scratchOffset.lengthSq() < 1e-6) {
    scratchOffset.set(0, 0, 1);
  }
  scratchOffset.setLength(distance);
  camera.position.copy(target).add(scratchOffset);
  camera.lookAt(target.x, target.y, target.z);
  if (controls) {
    controls.target.copy(target);
    controls.update();
  }
}

interface CameraZoomRigProps {
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
}

/**
 * Applies HUD / pinch zoom by dollying the camera along the look vector.
 * Wheel zoom stays off on the marketing page so the document can scroll.
 */
export function CameraZoomRig({ controlsRef }: CameraZoomRigProps) {
  const { camera, gl } = useThree();
  const { command, reportDistance, clearCommand } = useZoomCommand();
  const { minDistance } = useCameraZoom();
  const explore = useExploreOptional();
  const focus = useCameraFocusOptional();
  const compact = useCompactScene();
  const tweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);
  const pinchStart = useRef<{ span: number; distance: number } | null>(null);

  const restTarget = useMemo(
    () =>
      compact ? new Vector3(0, 0.2, 0) : new Vector3(2, 0.2, 0),
    [compact]
  );

  const currentTarget = useCallback(() => {
    return controlsRef.current?.target ?? restTarget;
  }, [controlsRef, restTarget]);

  const currentDistance = useCallback(() => {
    return camera.position.distanceTo(currentTarget());
  }, [camera, currentTarget]);

  useFrame(() => {
    if (tweenRef.current || pinchStart.current) return;
    reportDistance(currentDistance());
  });

  useEffect(() => {
    if (!command) return;

    tweenRef.current?.kill();
    const target = currentTarget().clone();

    if (command.immediate) {
      applyDistance(camera, target, command.target, controlsRef.current);
      reportDistance(command.target);
      clearCommand();
      return;
    }

    const proxy = { distance: currentDistance() };

    tweenRef.current = gsap.to(proxy, {
      distance: command.target,
      duration: TWEEN_DURATION,
      ease: "power3.out",
      onUpdate: () => {
        applyDistance(camera, target, proxy.distance, controlsRef.current);
        reportDistance(proxy.distance);
      },
      onComplete: () => {
        applyDistance(camera, target, command.target, controlsRef.current);
        reportDistance(command.target);
        clearCommand();
      },
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [camera, clearCommand, command, controlsRef, currentDistance, currentTarget, reportDistance]);

  useEffect(() => {
    if (explore?.isSequencing || focus?.isAnimating) {
      tweenRef.current?.kill();
      pinchStart.current = null;
    }
  }, [explore?.isSequencing, focus?.isAnimating]);

  useEffect(() => {
    const el = gl.domElement;
    const busy = () => Boolean(explore?.isSequencing || focus?.isAnimating);

    const touchSpan = (event: TouchEvent) => {
      const [a, b] = [event.touches[0], event.touches[1]];
      if (!a || !b) return 0;
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2 || busy()) {
        pinchStart.current = null;
        return;
      }
      tweenRef.current?.kill();
      pinchStart.current = {
        span: touchSpan(event),
        distance: currentDistance(),
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      const start = pinchStart.current;
      if (!start || event.touches.length !== 2 || busy()) return;
      event.preventDefault();
      const span = touchSpan(event);
      if (span < 8 || start.span < 8) return;
      const next = clampDistance(
        start.distance * (start.span / span),
        minDistance,
        ZOOM_MAX
      );
      applyDistance(camera, currentTarget().clone(), next, controlsRef.current);
      reportDistance(next);
    };

    const onTouchEnd = () => {
      pinchStart.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [
    camera,
    controlsRef,
    currentDistance,
    currentTarget,
    explore?.isSequencing,
    focus?.isAnimating,
    gl.domElement,
    minDistance,
    reportDistance,
  ]);

  return null;
}
