"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroCanvas } from "@/components/canvas/HeroCanvas";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const targets = rootRef.current.querySelectorAll("[data-animate]");
    gsap.fromTo(
      targets,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      }
    );
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 bg-grid-pattern bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-radial-fade" />
      <HeroCanvas />

      <Container className="relative z-10 flex flex-col items-center gap-8 py-24 text-center">
        <div
          data-animate
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-1.5 text-xs text-foreground/70"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Now shipping TechnoAI Model v3
        </div>

        <h1
          data-animate
          className="max-w-4xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl"
        >
          Intelligence, engineered for{" "}
          <span className="text-gradient bg-[length:200%_auto] animate-gradient-shift">
            the real world
          </span>
        </h1>

        <p
          data-animate
          className="max-w-2xl text-balance text-lg text-foreground/60"
        >
          TechnoAI builds foundation models, agent infrastructure, and
          developer tools that let teams ship reliable AI products in days,
          not quarters.
        </p>

        <div data-animate className="flex flex-col gap-4 sm:flex-row">
          <Button variant="primary" className="group px-7 py-3.5 text-base">
            Start building free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button variant="secondary" className="px-7 py-3.5 text-base">
            <PlayCircle className="h-4 w-4" />
            Watch the film
          </Button>
        </div>

        <div
          data-animate
          className="grid w-full max-w-2xl grid-cols-3 gap-6 pt-10 text-left"
        >
          {[
            ["120B+", "parameters trained"],
            ["99.98%", "platform uptime"],
            ["4,200+", "teams shipping on TechnoAI"],
          ].map(([stat, label]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-2xl font-semibold sm:text-3xl">{stat}</span>
              <span className="text-xs text-foreground/50 sm:text-sm">
                {label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
