/**
 * Joins class name fragments, skipping any falsy values.
 * A tiny local stand-in for `clsx` so the project doesn't need an extra dependency.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
