/**
 * Joins class name fragments, skipping any falsy values.
 * A tiny local stand-in for `clsx` so the project doesn't need an extra dependency.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Glassmorphism panel matching technoai.ae floating containers. */
export const glassPanel =
  "bg-[#0b0f17]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]";

/** Cyan glow used on hoverable stat/feature cards. */
export const glassHover =
  "hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300";

/** Compact card padding that stays sleek on small viewports. */
export const glassPad = "p-3 sm:p-5";
