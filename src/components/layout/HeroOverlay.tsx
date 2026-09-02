"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Globe2,
  Radar,
  RotateCcw,
  Workflow,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  cn,
  ctaMotion,
  ctaPrimary,
  ctaSecondary,
  glassHover,
  glassPad,
  glassPanel,
} from "@/lib/utils";
import { fadeUp, springSoft, useMotionPrefs } from "@/lib/motion";
import { useExploreOptional } from "@/components/canvas/ExploreSequence";
import { BOOK_DEMO_EVENT } from "@/components/layout/Navbar";
import { siteContent } from "@/lib/content";

const SPEC_ICONS = [Globe2, Radar, Workflow] as const;

const interactive = "pointer-events-auto";

function ButtonShine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
    >
      <span className="absolute inset-y-0 left-[-45%] w-[40%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 group-hover:left-[110%] group-hover:opacity-100" />
    </span>
  );
}

/**
 * Full-viewport HUD over the WebGL canvas. The root is `pointer-events-none`
 * so orbit-drag still reaches the canvas; only nav, CTAs, and dialogs opt
 * back in with `pointer-events-auto`.
 */
export function HeroOverlay() {
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const openDemo = () => setDemoOpen(true);
    window.addEventListener(BOOK_DEMO_EVENT, openDemo);
    return () => window.removeEventListener(BOOK_DEMO_EVENT, openDemo);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex min-w-0 max-w-full flex-col overflow-x-clip">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55vh] w-full max-w-full bg-gradient-to-t from-[#0b0f17]/90 via-[#0b0f17]/55 to-transparent md:inset-y-0 md:left-0 md:top-0 md:h-full md:w-[min(58%,40rem)] md:bg-gradient-to-r md:from-[#0b0f17]/85 md:via-[#0b0f17]/40 md:to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[55vh] min-h-0 min-w-0 flex-col justify-center gap-3 overflow-x-clip overflow-y-auto px-4 pb-4 pt-3 sm:gap-4 sm:px-5 sm:pb-5 md:relative md:h-auto md:flex-1 md:justify-between md:gap-6 md:px-6 md:pb-8 md:pt-24 lg:px-10 lg:pb-10 lg:pt-28">
        <HeroCopy onBookDemo={() => setDemoOpen(true)} />
        <SpecsRow />
      </div>

      <AnimatePresence>
        {demoOpen && <DemoPanel onClose={() => setDemoOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function HeroCopy({
  onBookDemo,
}: {
  onBookDemo: () => void;
}) {
  const explore = useExploreOptional();
  const { fade, spring } = useMotionPrefs();
  const state = explore?.state ?? "idle";
  const isBusy = explore?.isBusy ?? false;
  const isExploring = state === "exploring";

  const exploreLabel =
    state === "flying" || state === "returning"
      ? "Flying…"
      : isExploring
        ? "Reset View"
        : siteContent.hero.secondaryCta;

  return (
    <div className="flex w-full min-w-0 max-w-xl flex-col items-start gap-2.5 sm:gap-4 md:gap-6 lg:max-w-lg xl:max-w-xl">
      <motion.span
        {...fade}
        transition={{ ...spring, delay: 0.05 }}
        className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-900/60 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md sm:gap-2"
      >
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent" />
        <span className="truncate">{siteContent.hero.eyebrow}</span>
      </motion.span>

      <motion.h1
        {...fade}
        transition={{ ...spring, delay: 0.16 }}
        className="max-w-full text-balance break-words text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl md:font-extrabold md:leading-[1.15] lg:text-6xl"
      >
        {siteContent.hero.title} {siteContent.hero.titleAccent}
      </motion.h1>

      <motion.p
        {...fade}
        transition={{ ...spring, delay: 0.28 }}
        className="max-w-full truncate text-pretty text-xs leading-snug text-slate-400 sm:hidden sm:text-sm"
      >
        {siteContent.hero.descriptionShort}
      </motion.p>
      <motion.p
        {...fade}
        transition={{ ...spring, delay: 0.28 }}
        className="hidden max-w-xl text-pretty text-base leading-relaxed text-slate-300 sm:block lg:text-lg"
      >
        {siteContent.hero.description}
      </motion.p>

      <motion.div
        {...fade}
        transition={{ ...spring, delay: 0.4 }}
        className="relative flex w-full min-w-0 max-w-full flex-col gap-2 sm:max-w-md sm:flex-row sm:gap-3"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -left-6 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl sm:-right-4"
        />
        <Button
          type="button"
          variant={isExploring ? "secondary" : "primary"}
          disabled={isBusy}
          onClick={() => {
            explore?.trigger();
          }}
          aria-busy={isBusy}
          className={cn(
            interactive,
            ctaMotion,
            isExploring ? ctaSecondary : ctaPrimary,
            "relative z-10 w-full min-w-0 px-5 py-3 text-xs sm:w-auto sm:text-sm"
          )}
        >
          {!isExploring && <ButtonShine />}
          {isExploring ? (
            <RotateCcw className="relative h-4 w-4" />
          ) : (
            <Radar
              className={cn("relative h-4 w-4", isBusy && "animate-spin")}
            />
          )}
          <span className="relative">{exploreLabel}</span>
          {!isExploring && (
            <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onBookDemo}
          className={cn(
            interactive,
            ctaMotion,
            ctaSecondary,
            "relative z-10 w-full min-w-0 px-5 py-3 text-xs sm:w-auto sm:text-sm"
          )}
        >
          <Calendar className="h-4 w-4" />
          {siteContent.hero.primaryCta}
        </Button>
      </motion.div>
    </div>
  );
}

function SpecsRow() {
  const { fade, spring } = useMotionPrefs();

  return (
    <ul className="grid w-full min-w-0 max-w-xl grid-cols-3 gap-1.5 sm:gap-2 md:gap-2.5">
      {siteContent.hero.specs.map((spec, index) => {
        const Icon = SPEC_ICONS[index] ?? Globe2;
        return (
          <motion.li
            key={spec.label}
            {...fade}
            transition={{ ...spring, delay: index * 0.2 }}
            className={cn(
              interactive,
              glassPanel,
              glassHover,
              glassPad,
              "flex min-w-0 items-center gap-1.5 will-change-transform sm:gap-2.5 md:gap-3"
            )}
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary-300 sm:h-8 sm:w-8 md:h-9 md:w-9 md:rounded-xl">
              <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-mono text-xs font-bold tracking-widest text-cyan-300 lg:text-sm">
                {spec.value}
              </span>
              <span className="truncate text-[8px] uppercase tracking-[0.08em] text-foreground/50 sm:text-[10px] sm:tracking-[0.1em] md:text-[11px] md:tracking-[0.14em]">
                {spec.label}
              </span>
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}

function DemoPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
    >
      <button
        type="button"
        aria-label="Dismiss demo dialog"
        className={cn(interactive, "absolute inset-0 bg-[#030712]/50")}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-labelledby="demo-title"
        {...fadeUp}
        transition={springSoft}
        className={cn(
          interactive,
          glassPanel,
          glassPad,
          "relative w-full min-w-0 max-w-md md:p-8"
        )}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={cn(
            interactive,
            ctaMotion,
            ctaSecondary,
            "absolute right-4 top-4 flex h-8 w-8 items-center justify-center"
          )}
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          {siteContent.hero.primaryCta}
        </p>
        <h2 id="demo-title" className="mt-2 text-2xl font-semibold tracking-tight">
          {siteContent.sections.cta.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/60">
          {siteContent.sections.cta.description}
        </p>
        <a
          href="mailto:info@technoai.ae?subject=Project%20inquiry"
          className={cn(
            interactive,
            ctaMotion,
            ctaPrimary,
            "group relative mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm"
          )}
        >
          <ButtonShine />
          <span className="relative">Email info@technoai.ae</span>
          <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </motion.div>
    </motion.div>
  );
}
