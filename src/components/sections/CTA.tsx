"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { fadeUp, springSoft } from "@/lib/motion";
import { siteContent } from "@/lib/content";
import { cn, glassPad, glassPanel } from "@/lib/utils";
export function CTA() {
  const { title, description, primaryCta, secondaryCta } =
    siteContent.sections.cta;
  return (
    <section id="products" className="relative scroll-mt-8 py-24 sm:py-32">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.35 }}
          transition={springSoft}
          className={cn(
            glassPanel,
            glassPad,
            "relative overflow-hidden text-center md:p-16"
          )}
        >
          <div className="absolute inset-0 bg-radial-fade" />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="max-w-2xl text-balance bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
              {title}
            </h2>
            <p className="max-w-xl text-balance text-[#9CA3AF]">
              {description}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#contact">
                <Button
                  variant="primary"
                  className="group px-7 py-3.5 md:animate-glow-pulse"
                >
                  {primaryCta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </a>
              <a href="#solutions">
                <Button variant="secondary" className="px-7 py-3.5">
                  {secondaryCta}
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
