"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

interface ButtonProps extends NativeButtonProps {
  variant?: "primary" | "secondary" | "ghost";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-600 shadow-lg shadow-primary/25",
  secondary:
    "bg-white/5 text-foreground border border-white/10 hover:bg-white/10",
  ghost: "text-foreground/80 hover:text-foreground hover:bg-white/5",
};

export function Button({
  variant = "primary",
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={reduce || disabled ? undefined : { scale: 1.05 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      transition={springSnappy}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:opacity-50",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
