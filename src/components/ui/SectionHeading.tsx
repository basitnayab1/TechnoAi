"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, springSoft, staggerContainer, useMotionPrefs } from "@/lib/motion";
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
  const { reduce } = useMotionPrefs();
  return (
    <motion.div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.4 }}
      variants={reduce ? fadeUp : staggerContainer}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          transition={springSoft}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00F0FF]"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        transition={springSoft}
        className="text-balance bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          transition={springSoft}
          className="max-w-2xl text-balance text-base text-[#9CA3AF] sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
