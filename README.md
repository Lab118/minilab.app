# `minilab.app` — Spatial Solar System AI Lab & NYC Portfolio

Interactive 3D/2D Solar System AI laboratory and creative technology portfolio created by **Lucas Leite** (`Brooklyn, New York City` — `lucas.lab118@gmail.com`).

## 1. Creator Profile & Trajectory
- **Primary Emphasis (Current Role)**: **Art Department Production Assistant (Art PA) for a Netflix series in NYC**, operating at the intersection of physical set production, visual continuity, and creative technology.
- **Previous Experience (High-Level Summary)**: 10+ years in high-volume General & Administrative Operations, budget/vendor logistics, and B2B Google Cloud consulting, grounded in an early career foundation in audiovisual videography and editing.

## 2. Spatial & Visual Architecture
- **Editorial Minimalist HUD**: Inspired by `heronaiapp.com` — compact cards (`max-width: 355px`), monospace bracketed tags (`[03 // TERRA-NYC]`), and redline callout leader lines anchored to 3D planetary coordinates.
- **Dawn & Dusk Theme Toggle**:
  - **Dusk Mode (`☾ DUSK`, Default Dark)**: Deep Twilight Indigo (`#070E1C`), Starlight Cyan-Silver orbits (`#67E8F9`), and Warm Dusk Coral accents (`#FF6B4A`).
  - **Dawn Mode (`☀ DAWN`, Light)**: Warm Sunrise Vellum (`#FBF6EE`), Deep Espresso Graphite linework (`#1C1917`), and Sunrise Terracotta accents (`#D94826`).
- **Scroll-Driven Blueprint-to-Sketch Linework**: Scrolling down the page advances planets and moons along their orbits while progressively enriching the stroke style from clean **Geometric Blueprint Wireframes** (`0%` scroll) into **Hand-Drawn Galileo Sketch Strokes** (`100%` scroll — double-pass pencil contours and crescent night-side cross-hatching).
- **90° Plan View Default & Parked Dwell Curve (`getParkedHorizontalSide`)**:
  - Locked overhead (`pitch = 90°`) by default so all orbits appear as concentric blueprint circles.
  - Cards alternate **Left** and **Right** across sections while the Solar System stays stationary on the opposite side for ~70% of each section.
- **3D Perspective Shift (`pitch = 25°`, `zoom = 2.8x`) & Mini-App Drawer**:
  - Clicking any planet on the canvas, in the bottom dock, or via **"Launch Planet Mini-App"** tilts the camera to a `25°` 3D Perspective View centered on that planet and its moons/rings, opening its modular **Mini-App Sandbox Drawer**.

## 3. Antigravity Workspace Customizations
- **Custom Agent**: [`.agents/agents/minilab-architect/agent.md`](.agents/agents/minilab-architect/agent.md)
- **Workspace Rules**: [`AGENTS.md`](AGENTS.md)
- **Reusable Skill**: [`.agents/skills/add-planet-miniapp/SKILL.md`](.agents/skills/add-planet-miniapp/SKILL.md)

## 4. Development & Build
```bash
npm install
npm run dev
npm run build
```
