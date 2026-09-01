"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { fadeUp, springSoft } from "@/lib/motion";
import { siteContent } from "@/lib/content";

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
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-surface to-surface p-10 text-center sm:p-16"
        >
          <div className="absolute inset-0 bg-radial-fade" />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="max-w-xl text-balance text-foreground/60">
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
