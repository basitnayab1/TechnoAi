"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface FadeInOptions {
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
}

/**
 * Attaches a GSAP + ScrollTrigger fade/slide-up reveal to the returned ref.
 * Elements animate once when they enter the viewport.
 */
export function useFadeInOnScroll<T extends HTMLElement = HTMLDivElement>(
  options: FadeInOptions = {}
) {
  const ref = useRef<T | null>(null);
  const { y = 32, duration = 0.9, delay = 0, start = "top 85%" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, duration, delay, start]);

  return ref;
}
