
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
export const glassPanel =
  "bg-[rgba(11,15,23,0.75)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]";
export const glassHover =
  "hover:border-[rgba(0,240,255,0.2)] hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300";
export const glassPad = "p-3 sm:p-5";
export const ctaMotion =
  "pointer-events-auto rounded-xl font-semibold tracking-wide hover:scale-[1.03] active:scale-[0.98] transition-all duration-300";
export const ctaPrimary =
  "bg-gradient-to-r from-[#00F0FF] to-[#2563EB] hover:from-[#5AF0FF] hover:to-[#3B82F6] text-white shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]";
export const ctaSecondary =
  "bg-[rgba(11,15,23,0.75)] hover:bg-[#0B0F17] text-[#F9FAFB] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,240,255,0.2)] backdrop-blur-md";
export const navBarShell =
  "fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-8 bg-[#030712]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] transition-all duration-300";
export const navLink =
  "text-sm font-medium tracking-wide text-[#9CA3AF] transition-colors duration-200 hover:text-[#00F0FF]";
export const navCta =
  "rounded-full bg-gradient-to-r from-[#00F0FF] to-[#2563EB] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all hover:from-[#5AF0FF] hover:to-[#3B82F6] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]";
