# Workspace Rules — `minilab.app` (Solar System AI Lab & Spatial Portfolio)

## 1. Identity, Language & Creator Profile
- **Domain**: `minilab.app`
- **Strict English Policy**: All UI copy, code identifiers, comments, telemetry readouts, and documentation must be strictly in English.
- **Creator**: **Lucas Leite** (`Brooklyn, New York City` — `lucas.lab118@gmail.com`).
- **Creator Trajectory Representation**:
  - **Primary Emphasis (Current Role)**: **Art Department Production Assistant (Art PA) for a Netflix series in NYC**, operating at the intersection of physical set production, visual continuity, and creative technology.
  - **Previous Experience (High-Level Summary)**: 10+ years in high-volume General & Administrative Operations, budget/vendor logistics, and B2B Google Cloud consulting, grounded in an early career foundation in audiovisual videography and editing.
  - Keep biographical copy concise, architectural, and free of corporate buzzword clutter.

## 2. Visual & Spatial Architecture (Heron AI Editorial HUD + Dawn/Dusk Themes)
- **Editorial Minimalist HUD**: Inspired by `heronaiapp.com` — ultra-clean, compact cards (`max-width: 355px`), monospace bracketed tags (`[03 // TERRA-NYC]`), technical redline callout flags attached via leader lines to 3D celestial bodies, and zero visual clutter.
- **Dawn & Dusk Theme Toggle**:
  - **Dusk Mode (`☾ DUSK`, Default Dark)**: Deep Twilight Indigo (`#070E1C`), Starlight Cyan-Silver orbits (`#67E8F9`), and Warm Dusk Coral accents (`#FF6B4A`).
  - **Dawn Mode (`☀ DAWN`, Light)**: Warm Sunrise Vellum (`#FBF6EE`), Deep Espresso Graphite linework (`#1C1917`), and Sunrise Terracotta accents (`#D94826`).
- **Scroll-Driven Blueprint-to-Sketch Linework**:
  - Scrolling down the page (`scrollProgress` from `0` to `1`) gently advances planets and moons along their orbits while progressively enriching stroke style from clean **Geometric Blueprint Wireframes** (`0%` scroll) into **Hand-Drawn Galileo Sketch Strokes** (`100%` scroll — double-pass pencil contours, organic wobble, and crescent night-side cross-hatching), without overriding the active Dawn/Dusk background palette.

## 3. Camera, Parked Section Dwell & Cross-Device Responsiveness
- **90° Top-Down Plan View by Default**: Keep the camera locked directly overhead (`pitch = 90°`) during normal scrolling so all planetary orbits render as true concentric blueprint circles.
- **Parked Section Dwell Curve (`getParkedHorizontalSide`)**:
  - Never use a continuous sine wave that zig-zags the Solar System nonstop.
  - Use the plateau step function `getParkedHorizontalSide(sectionProgress)` so the Solar System stays **stationary on the opposite side of the active section card** for ~70% of each section (`0.15` to `0.85` local progress), smoothly gliding across only during the 30% inter-section transition window.
- **Universal Responsive Layout (Desktop, iPad, Android & iOS)**:
  - **Never collapse cards into a single centered column** on mobile or tablet viewports.
  - **Desktop (`>= 900px`) & iPad/Tablets (`540px–899px`)**: Section cards alternate Left/Right (`width: min(350px, 44vw)`) while the Solar System parks on the opposite horizontal side (`cx = 50%vw ± 20%vw`, `cy = 50%vh`).
  - **Android & iOS Portrait Phones (`< 540px`)**: Section cards (`width: min(80vw, 295px)`) hug the Left or Right margin in the lower half of each section while the Solar System parks in the upper-opposite quadrant (`cx = 50%vw ± 15%vw`, `cy = 32%vh`), paired with `100dvh`, `env(safe-area-inset-*)`, and a single-row horizontally swipeable bottom planet bar.
- **3D Perspective Shift & Mini-App Drawer on Planet Selection**:
  - **Only when a planet is explicitly selected** (via canvas click/tap, bottom dock button, or "Launch Planet Mini-App" CTA inside its section card), smoothly interpolate the camera into an angled **3D Perspective View (`pitch = 25°`, `zoom = 2.8x`)** centered on that planet and its moons/rings, and open its interactive **Mini-App Sandbox Drawer**.
  - Closing the Mini-App Drawer or clicking `[RETURN TO 90° PLAN VIEW]` smoothly restores the 90° overhead blueprint view.

## 4. Modular Planetary Mini-App Registry
- All celestial bodies (`SOL`, `MERCURY`, `VENUS`, `EARTH`, `MARS`, `JUPITER`, `SATURN`, `OUTER`) and their hosted interactive AI mini-apps must be registered in `src/config/planetsRegistry.ts`.
- When adding a new mini-app to any planet or moon, follow `.agents/skills/add-planet-miniapp/SKILL.md`.
