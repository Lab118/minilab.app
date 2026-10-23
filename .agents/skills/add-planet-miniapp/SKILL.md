---
name: add-planet-miniapp
description: >-
  Step-by-step workflow for creating and registering a new interactive AI mini-app
  inside any planet or moon slot in minilab.app (src/config/planetsRegistry.ts and
  src/components/MiniAppDrawer.tsx). Use whenever the user asks to add, prototype,
  or wire up a new mini-app, tool, or sub-agent experiment on a planet.
---

# Add a Planetary Mini-App (`minilab.app`)

Use this skill whenever adding or updating an interactive AI mini-app hosted on one of the 8 planetary orbits in `minilab.app`.

## 1. Identify the Target Planet Orbit

Each celestial section in `src/config/planetsRegistry.ts` hosts domain-specific mini-apps:

| Section | Planet ID | Code | Domain Focus |
| :--- | :--- | :--- | :--- |
| `00` | `sol` | `HELIOS-00` | Mission Control, System Telemetry & Creator Overview |
| `01` | `mercury` | `MERC-01` | Speed & Script Breakdown / Prompt Engineering |
| `02` | `venus` | `VEN-02` | AI Set & Visual Concepting / Moodboard & Lighting |
| `03` | `earth` | `TERRA-03 // NYC` | NYC Production Continuity, Call Sheet & Trajectory |
| `04` | `mars` | `MARS-04` | Production Logistics, Budget & Autonomous Ops |
| `05` | `jupiter` | `JOVE-05` | Multi-Agent Systems (`Io`, `Europa`, `Ganymede`, `Callisto`) |
| `06` | `saturn` | `SATURN-06` | 3D Spatial, Set Blueprint & CAD Shader Models |
| `07` | `outer` | `OUTER-07/08` | Future Frontier Orbits & Direct Contact Terminal |

## 2. Register the Mini-App Metadata in `src/config/planetsRegistry.ts`

1. Open `src/config/planetsRegistry.ts`.
2. Locate the target `PlanetConfig` entry in `PLANETS_REGISTRY`.
3. Add or update an entry in its `miniApps` array conforming to `PlanetMiniApp`:
   - `id`: Unique kebab-case identifier (e.g., `'nyc-script-breakdown'`).
   - `title`: Concise uppercase/editorial title.
   - `tag`: Monospace bracket code (e.g., `'APP-01 // SCRIPT'`).
   - `status`: `'LIVE SANDBOX' | 'PROTOTYPE' | 'ORBITAL SLOT'`.
   - `description`: 1–2 crisp sentences explaining what the mini-app does.
   - `moonHost` (optional): Attach the mini-app to a specific moon (e.g., `'Io'`, `'Luna'`, `'Titan'`).
   - `interactivePreset`: Configuration object powering the interactive controls in `MiniAppDrawer.tsx`.

## 3. Wire Custom Interactive UI in `src/components/MiniAppDrawer.tsx`

1. Open `src/components/MiniAppDrawer.tsx`.
2. Ensure the drawer renders the mini-app's interactive inputs, presets, live telemetry output, and moon-selector tabs while keeping the camera locked at `pitch = 25°`, `zoom = 2.8x` on the active planet.
3. Verify that all UI elements inherit Dawn (`☀ DAWN`) and Dusk (`☾ DUSK`) CSS variables (`--bg-primary`, `--ink-primary`, `--accent-primary`, `--border-hairline`).

## 4. Verification Checklist

1. Run `npm run build` to verify zero TypeScript or Vite bundling errors.
2. Confirm that clicking **"Launch Planet Mini-App"** on the planet's section card tilts the camera to `25°` perspective view and opens the new mini-app in the sandbox drawer.
3. Confirm responsive layout on Desktop (`>= 900px`), iPad (`540px–899px`), and Portrait Phone (`< 540px`).
