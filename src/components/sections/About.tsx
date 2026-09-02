"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  ShoppingCart,
  Truck,
  Wrench,
  ClipboardList,
  Headset,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, springSoft, useMotionPrefs } from "@/lib/motion";
import { siteContent } from "@/lib/content";
import { cn, glassHover, glassPad, glassPanel } from "@/lib/utils";

const SERVICE_ICONS: LucideIcon[] = [
  Wallet,
  ShoppingCart,
  Truck,
  Wrench,
  ClipboardList,
  Headset,
];

export function About() {
  const { fade, spring } = useMotionPrefs();
  const { eyebrow, title, description, body } = siteContent.sections.services;

  return (
    <section id="services" className="relative scroll-mt-8 overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[#0b0f17]" />
      <div className="absolute inset-0 bg-radial-fade opacity-60" />

      <Container className="relative z-10 grid gap-16 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-6">
          <SectionHeading
            align="left"
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <motion.p
            {...fade}
            transition={{ ...spring, delay: 0.18 }}
            className="text-sm leading-relaxed text-foreground/70"
          >
            {body}
          </motion.p>
          <ul className="flex flex-col gap-4 text-sm text-foreground/70">
            {siteContent.whyChoose.map((item, index) => (
              <motion.li
                key={item.title}
                {...fade}
                transition={{ ...spring, delay: 0.24 + index * 0.1 }}
                className="flex gap-3"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span>
                  <span className="font-medium text-foreground">
                    {item.title}.{" "}
                  </span>
                  {item.description}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4">
          {siteContent.services.map((service, index) => {
            const Icon = SERVICE_ICONS[index] ?? Wrench;
            return (
              <motion.div
                key={service.title}
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ ...springSoft, delay: index * 0.12 }}
                className={cn(
                  glassPanel,
                  glassHover,
                  glassPad,
                  "flex items-start gap-4 will-change-transform sm:gap-5"
                )}
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-lg font-semibold">{service.title}</div>
                  <p className="mt-1 text-sm text-foreground/60">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
