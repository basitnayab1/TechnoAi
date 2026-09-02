"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { cn, navBarShell, navCta, navLink } from "@/lib/utils";
import { springSoft } from "@/lib/motion";
import { siteContent } from "@/lib/content";

const links = siteContent.nav;

/** Hero overlay listens for this to open the project/demo dialog. */
export const BOOK_DEMO_EVENT = "technoai:book-demo";

export function requestBookDemo() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BOOK_DEMO_EVENT));
}

function scrollToHash(hash: string) {
  const id = hash.replace("#", "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  const onCta = () => {
    setOpen(false);
    requestBookDemo();
  };

  return (
    <header className={navBarShell}>
      <div className="relative mx-auto flex w-full min-w-0 max-w-7xl items-center justify-between gap-3">
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            setOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-white"
        >
          <Sparkles className="h-6 w-6 shrink-0 animate-pulse text-cyan-400" />
          <span>TechnoAI</span>
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => {
                event.preventDefault();
                scrollToHash(link.href);
              }}
              className={navLink}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCta}
            className={cn(navCta, "hidden md:inline-flex")}
          >
            {siteContent.hero.primaryCta}
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg border border-slate-700/80 p-2 text-slate-200 shadow-[0_0_12px_rgba(0,240,255,0.12)] transition-all hover:border-cyan-500/60 hover:text-cyan-300 hover:shadow-[0_0_18px_rgba(0,240,255,0.28)] md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springSoft}
            className="mx-auto mt-3 w-full max-w-7xl rounded-2xl border border-slate-800/60 bg-[#030712]/90 p-3 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    setOpen(false);
                    scrollToHash(link.href);
                  }}
                  className={cn(navLink, "rounded-lg px-3 py-2.5 hover:bg-white/5")}
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={onCta}
                className={cn(navCta, "mt-2 w-full")}
              >
                {siteContent.hero.primaryCta}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
