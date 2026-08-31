"use client";

import dynamic from "next/dynamic";

/**
 * `Scene` touches `window`/WebGL through three.js, so it is dynamically
 * imported with SSR disabled and rendered only on the client.
 */
const Scene = dynamic(() => import("./Scene").then((mod) => mod.Scene), {
  ssr: false,
});

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-10">
      <Scene />
    </div>
  );
}
