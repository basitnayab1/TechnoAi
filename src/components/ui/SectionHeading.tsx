import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-balance text-base text-foreground/60 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
