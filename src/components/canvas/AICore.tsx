"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import type { Mesh } from "three";

/**
 * The animated "AI core" — a distorted, glowing sphere with an orbiting
 * wireframe shell. Meant to read as a living neural / AI presence.
 */
export function AICore() {
  const coreRef = useRef<Mesh>(null);
  const shellRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15;
      coreRef.current.rotation.x += delta * 0.05;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * 0.08;
      shellRef.current.rotation.z += delta * 0.03;
    }
  });

  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
        <Sphere ref={coreRef} args={[1.35, 128, 128]}>
          <MeshDistortMaterial
            color="#00F0FF"
            emissive="#2563EB"
            emissiveIntensity={0.4}
            distort={0.45}
            speed={2.2}
            roughness={0.15}
            metalness={0.6}
          />
        </Sphere>

        <mesh ref={shellRef} scale={1.9}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#06B6D4"
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>
      </Float>

      <pointLight position={[3, 2, 4]} intensity={40} color="#00F0FF" />
      <pointLight position={[-4, -2, -3]} intensity={25} color="#2563EB" />
    </group>
  );
}
