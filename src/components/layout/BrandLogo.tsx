import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_ASPECT = 1451 / 704;

interface BrandLogoProps {
  className?: string;
  height?: number;
  priority?: boolean;
}

export function BrandLogo({
  className,
  height = 32,
  priority = false,
}: BrandLogoProps) {
  const width = Math.round(height * LOGO_ASPECT);

  return (
    <Image
      src="/logo.png"
      alt="TechnoAi"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-8 w-auto object-contain object-left sm:h-9", className)}
    />
  );
}
