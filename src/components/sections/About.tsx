"use client";

import { Cpu, Globe2, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

const pillars = [
  {
    icon: Cpu,
    stat: "3.2M",
    label: "inferences served daily across our GPU fleet",
  },
  {
    icon: Globe2,
    stat: "14",
    label: "regions with dedicated low-latency inference clusters",
  },
  {
    icon: Users,
    stat: "180+",
    label: "researchers and engineers building the platform",
  },
];

export function About() {
  const contentRef = useFadeInOnScroll<HTMLDivElement>();

  return (
    <section id="services" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 bg-radial-fade opacity-60" />

      <Container className="relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center">
        <div ref={contentRef} className="flex flex-col gap-6">
          <SectionHeading
            align="left"
            eyebrow="Why TechnoAI"
            title="Research-grade models, production-grade infrastructure"
            description="We spent the last three years building the model training stack, the inference network, and the safety tooling most teams never get to see — so you can focus on the product on top."
          />
          <ul className="flex flex-col gap-4 text-sm text-foreground/70">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
              Continuous evaluation pipelines catch regressions before they
              reach production traffic.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
              Dedicated capacity guarantees for enterprise workloads, with
              transparent usage-based pricing.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
              A research team publishing openly on interpretability, safety,
              and alignment.
            </li>
          </ul>
        </div>

        <div className="grid gap-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.label}
                className="flex items-center gap-5 rounded-2xl border border-border bg-background/60 p-6 backdrop-blur"
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-2xl font-semibold">{pillar.stat}</div>
                  <p className="text-sm text-foreground/60">{pillar.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
