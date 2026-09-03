"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points as ThreePoints } from "three";

interface ParticleFieldProps {
  count?: number;
  radius?: number;
}

/**
 * A drifting field of points used as an ambient "data particles" backdrop
 * behind the AI core.
 */
export function ParticleField({ count = 800, radius = 6 }: ParticleFieldProps) {
  const pointsRef = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00F0FF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
