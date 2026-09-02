import dynamic from "next/dynamic";
import { Footer } from "@/components/layout/Footer";
import { HeroOverlay } from "@/components/layout/HeroOverlay";
import { Navbar } from "@/components/layout/Navbar";
import { Features } from "@/components/sections/Features";
import { About } from "@/components/sections/About";
import { CTA } from "@/components/sections/CTA";

const SceneCanvas = dynamic(
  () => import("@/components/canvas/SceneCanvas").then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[#030712]" aria-hidden />
    ),
  }
);

const HeroModel = dynamic(
  () => import("@/components/canvas/HeroModel").then((mod) => mod.HeroModel),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-clip">
      <Navbar />
      <section
        id="top"
        className="relative h-[100dvh] w-full min-w-0 max-w-full overflow-hidden"
      >
        <SceneCanvas
          className="absolute inset-0 h-full w-full"
          enableZoom={false}
          overlay={<HeroOverlay />}
        >
          <HeroModel />
        </SceneCanvas>
      </section>

      <main className="w-full min-w-0 max-w-full overflow-x-clip">
        <Features />
        <About />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
