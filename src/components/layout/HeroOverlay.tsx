"use client";

import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  Crosshair,
  Menu,
  Radar,
  RotateCcw,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useExploreOptional } from "@/components/canvas/ExploreSequence";

const NAV_LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Contact", href: "#contact" },
] as const;

const SPECS = [
  {
    icon: Crosshair,
    value: "99.9%",
    label: "Precision",
  },
  {
    icon: Zap,
    value: "Real-Time",
    label: "Processing",
  },
  {
    icon: Workflow,
    value: "Multi-Agent",
    label: "Systems",
  },
] as const;

function scrollToHash(hash: string) {
  const id = hash.replace("#", "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const interactive = "pointer-events-auto";

/**
 * Full-viewport HUD over the WebGL canvas. The root is `pointer-events-none`
 * so orbit-drag still reaches the canvas; only nav, CTAs, and dialogs opt
 * back in with `pointer-events-auto`.
 */
export function HeroOverlay() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex min-w-0 max-w-full flex-col overflow-x-clip">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full max-w-full bg-gradient-to-b from-[#030712]/80 via-[#030712]/45 to-[#030712]/75 lg:bg-gradient-to-r lg:from-[#030712]/85 lg:via-[#030712]/40 lg:to-transparent lg:w-[min(58%,40rem)]" />

      <OverlayNav
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onCloseMenu={() => setMenuOpen(false)}
        onGetStarted={() => {
          setMenuOpen(false);
          setDemoOpen(true);
        }}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-6 overflow-x-clip overflow-y-auto px-4 pb-5 pt-[4.75rem] sm:gap-8 sm:px-6 sm:pb-8 sm:pt-24 lg:px-10 lg:pb-10 lg:pt-28">
        <HeroCopy
          onExploreMenuClose={() => setMenuOpen(false)}
          onBookDemo={() => setDemoOpen(true)}
        />
        <SpecsRow />
      </div>

      {demoOpen && <DemoPanel onClose={() => setDemoOpen(false)} />}
    </div>
  );
}

function OverlayNav({
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onGetStarted,
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onGetStarted: () => void;
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 w-full min-w-0 max-w-full px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:gap-4 sm:px-5 sm:py-3">
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={cn(
            interactive,
            "flex min-w-0 shrink items-center gap-2 font-semibold tracking-tight sm:gap-2.5"
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-300 shadow-[0_0_16px_rgba(109,91,255,0.45)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm sm:text-base">
            Techno<span className="text-primary-300">AI</span>
          </span>
        </a>

        <nav className="hidden min-w-0 items-center gap-5 lg:flex xl:gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => {
                event.preventDefault();
                scrollToHash(link.href);
              }}
              className={cn(
                interactive,
                "text-sm text-foreground/70 transition-colors hover:text-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            onClick={onGetStarted}
            className={cn(
              interactive,
              "hidden px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] shadow-[0_0_24px_rgba(109,91,255,0.55)] lg:inline-flex"
            )}
          >
            Get Started
          </Button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={onToggleMenu}
            className={cn(
              interactive,
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground/80 lg:hidden"
            )}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className={cn(
            interactive,
            "mx-auto mt-2 w-full max-w-7xl rounded-2xl border border-white/10 bg-[#030712]/90 p-4 backdrop-blur-xl lg:hidden"
          )}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  onCloseMenu();
                  scrollToHash(link.href);
                }}
                className="rounded-lg px-3 py-2.5 text-sm text-foreground/80 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <Button
              type="button"
              variant="primary"
              onClick={onGetStarted}
              className="mt-2 w-full uppercase tracking-[0.16em]"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroCopy({
  onExploreMenuClose,
  onBookDemo,
}: {
  onExploreMenuClose: () => void;
  onBookDemo: () => void;
}) {
  const explore = useExploreOptional();
  const state = explore?.state ?? "idle";
  const isBusy = explore?.isBusy ?? false;
  const isExploring = state === "exploring";

  const exploreLabel =
    state === "flying" || state === "returning"
      ? "Flying…"
      : isExploring
        ? "Reset View"
        : "Explore AI Models";

  return (
    <div className="flex w-full min-w-0 max-w-xl flex-col items-start gap-4 sm:gap-6 lg:max-w-lg xl:max-w-xl">
      <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent shadow-[0_0_18px_rgba(0,229,199,0.2)] sm:px-3 sm:text-[11px] sm:tracking-[0.22em]">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent" />
        <span className="truncate">Powering Next-Gen AI</span>
      </span>

      <h1 className="max-w-full text-balance break-words text-[1.75rem] font-semibold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem]">
        Transforming Businesses with{" "}
        <span className="text-gradient animate-gradient-shift bg-[length:200%_auto]">
          Intelligent AI Solutions
        </span>
      </h1>

      <p className="max-w-md text-pretty text-sm leading-relaxed text-foreground/65 sm:text-base">
        TechnoAI is an AI solutions provider building foundation models,
        multi-agent systems, and real-time inference — so enterprises can
        deploy intelligence they can actually trust in production.
      </p>

      <div className="flex w-full min-w-0 max-w-full flex-col gap-3 sm:max-w-md sm:flex-row">
        <Button
          type="button"
          variant={isExploring ? "secondary" : "primary"}
          disabled={isBusy}
          onClick={() => {
            onExploreMenuClose();
            explore?.trigger();
          }}
          aria-busy={isBusy}
          className={cn(
            interactive,
            "w-full min-w-0 px-5 py-3 text-sm shadow-[0_0_24px_rgba(109,91,255,0.4)] sm:w-auto sm:px-6"
          )}
        >
          {isExploring ? (
            <RotateCcw className="h-4 w-4" />
          ) : (
            <Radar className={cn("h-4 w-4", isBusy && "animate-spin")} />
          )}
          {exploreLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onBookDemo}
          className={cn(
            interactive,
            "w-full min-w-0 border-white/15 bg-white/5 px-5 py-3 text-sm backdrop-blur-md sm:w-auto sm:px-6"
          )}
        >
          <Calendar className="h-4 w-4" />
          Book Demo
        </Button>
      </div>
    </div>
  );
}

function SpecsRow() {
  return (
    <ul className="grid w-full min-w-0 max-w-xl grid-cols-1 gap-2 sm:grid-cols-3">
      {SPECS.map((spec) => {
        const Icon = spec.icon;
        return (
          <li
            key={spec.label}
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-3 backdrop-blur-xl"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-300">
              <Icon className="h-4 w-4" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold leading-tight">
                {spec.value}
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-foreground/50">
                {spec.label}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function DemoPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Dismiss demo dialog"
        className={cn(interactive, "absolute inset-0 bg-[#030712]/50")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-labelledby="demo-title"
        className={cn(
          interactive,
          "relative w-full min-w-0 max-w-md rounded-3xl border border-white/10 bg-[#0b0d18]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8"
        )}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-foreground/60 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Book a demo
        </p>
        <h2 id="demo-title" className="mt-2 text-2xl font-semibold tracking-tight">
          See TechnoAI in production
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/60">
          A 30-minute walkthrough of our models, agent orchestration, and a
          deployment plan tailored to your stack. Most teams are live within
          a week.
        </p>
        <a
          href="mailto:sales@technoai.com?subject=Demo%20request"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-[0_0_24px_rgba(109,91,255,0.45)] transition-colors hover:bg-primary-600"
        >
          Email sales@technoai.com
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
