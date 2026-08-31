import { Footer } from "@/components/layout/Footer";
import { HeroScene } from "@/components/sections/HeroScene";
import { Features } from "@/components/sections/Features";
import { About } from "@/components/sections/About";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <HeroScene />
      <main>
        <Features />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
