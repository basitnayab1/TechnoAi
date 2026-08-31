"use client";

import {
  BrainCircuit,
  Network,
  ShieldCheck,
  Gauge,
  Workflow,
  Blocks,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

const features = [
  {
    icon: BrainCircuit,
    title: "Foundation models",
    description:
      "Frontier language, vision, and multimodal models tuned for reasoning, retrieval, and long-context tasks.",
  },
  {
    icon: Workflow,
    title: "Agent orchestration",
    description:
      "Compose reliable multi-step agents with built-in memory, tool-calling, and human-in-the-loop review.",
  },
  {
    icon: Gauge,
    title: "Low-latency inference",
    description:
      "Global inference clusters route every request to the fastest available GPU, automatically.",
  },
  {
    icon: Network,
    title: "Composable pipelines",
    description:
      "Chain models, tools, and data sources through a visual pipeline builder or a single API call.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade trust",
    description:
      "SOC 2 Type II, private VPC deployments, and fine-grained data governance out of the box.",
  },
  {
    icon: Blocks,
    title: "Open integrations",
    description:
      "Drop-in SDKs for TypeScript, Python, and Go, plus connectors for the tools your team already uses.",
  },
];

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  const ref = useFadeInOnScroll<HTMLDivElement>();
  const Icon = feature.icon;

  return (
    <div
      ref={ref}
      className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/40"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-300 transition-colors group-hover:bg-primary/20">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="text-lg font-semibold">{feature.title}</h3>
      <p className="text-sm text-foreground/60">{feature.description}</p>
    </div>
  );
}

export function Features() {
  return (
    <section id="solutions" className="relative scroll-mt-8 py-24 sm:py-32">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="Platform"
          title="Everything you need to ship AI products"
          description="From raw model access to fully managed agents, TechnoAI gives your team one platform for the entire AI lifecycle."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}
