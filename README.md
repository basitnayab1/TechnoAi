# TechnoAI

Marketing site for **TechnoAI**, an AI company building foundation models and
agent infrastructure. Built with Next.js 14 (App Router), TypeScript, and
Tailwind CSS, with an interactive WebGL hero built on three.js /
`@react-three/fiber` / `@react-three/drei`, GSAP-powered scroll reveals, and
`lucide-react` icons.

## Stack

- **Next.js 14** — App Router, React Server Components
- **TypeScript** — strict mode
- **Tailwind CSS** — custom dark theme, gradients, grid backdrop
- **three** / **@react-three/fiber** / **@react-three/drei** — the animated
  "AI core" hero scene
- **gsap** (+ `ScrollTrigger`) — entrance animation and scroll-triggered
  section reveals
- **lucide-react** — icon set used throughout the UI

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on [http://localhost:4417](http://localhost:4417).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

## Project structure

```
src/
  app/
    layout.tsx          Root layout: fonts, metadata, global styles
    page.tsx             Home page composition
    globals.css          Tailwind layers + theme tokens
  components/
    canvas/               three.js / react-three-fiber scene
      Scene.tsx            <Canvas> setup (camera, lights, suspense)
      HeroCanvas.tsx        Client-only wrapper (dynamic import, ssr: false)
      AICore.tsx            Distorted sphere + wireframe shell "AI core"
      ParticleField.tsx     Ambient drifting particle backdrop
    layout/
      Navbar.tsx            Sticky nav with mobile menu
      Footer.tsx             Site footer with link columns
    sections/
      Hero.tsx               Hero copy + CTA + 3D scene, GSAP intro animation
      Features.tsx            Platform capability grid (lucide icons)
      About.tsx                Company pillars / stats
      CTA.tsx                  Bottom call-to-action band
    ui/
      Button.tsx               Primary/secondary/ghost button variants
      Container.tsx            Max-width page container
      SectionHeading.tsx        Eyebrow + title + description heading block
  hooks/
    useFadeInOnScroll.ts     GSAP ScrollTrigger fade/slide-up reveal hook
  lib/
    gsap.ts                   gsap + ScrollTrigger registration (client-only)
    utils.ts                   `cn()` class-name helper
```

## Notes

- The 3D scene lives behind `next/dynamic` with `ssr: false` (see
  `HeroCanvas.tsx`) since three.js/WebGL requires the browser `window`/canvas
  APIs and must never run during server rendering.
- `useFadeInOnScroll` centralizes the GSAP `ScrollTrigger` reveal pattern so
  new sections can opt in with a single hook call.
- Update copy, colors (see `tailwind.config.ts` `primary`/`accent` palettes),
  and section content in `src/components/sections` to extend the page.
