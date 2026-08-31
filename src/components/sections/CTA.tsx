"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

export function CTA() {
  const ref = useFadeInOnScroll<HTMLDivElement>();

  return (
    <section id="company" className="relative py-24 sm:py-32">
      <Container>
        <div
          ref={ref}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-surface to-surface p-10 text-center sm:p-16"
        >
          <div className="absolute inset-0 bg-radial-fade" />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to put TechnoAI into production?
            </h2>
            <p className="max-w-xl text-balance text-foreground/60">
              Talk to our team about model access, dedicated capacity, or a
              custom deployment — most teams are live within a week.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" className="group px-7 py-3.5">
                Talk to sales
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button variant="secondary" className="px-7 py-3.5">
                Read the docs
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
