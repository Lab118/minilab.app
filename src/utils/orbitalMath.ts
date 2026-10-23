/**
 * Clamps a numeric value between min and max.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Quintic smoothstep interpolation for silky transitions between parked plateaus.
 */
export function smootherStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Linear interpolation.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Parked Section Dwell Curve (`getParkedHorizontalSide`):
 *
 * Given continuous section progress `s` in `[0, totalSections - 1]`:
 * - Even sections (`0, 2, 4, 6`) have their HUD card on the LEFT, so the Solar System
 *   parks stationary on the RIGHT (`+1`).
 * - Odd sections (`1, 3, 5, 7`) have their HUD card on the RIGHT, so the Solar System
 *   parks stationary on the LEFT (`-1`).
 *
 * Within each section `k`, the Solar System remains 100% parked on its side for 70% of
 * the section scroll window (from `k - 0.35` to `k + 0.35`, i.e., `0.15` to `0.85` of
 * normalized section traversal), and only glides across during the 30% transition zone
 * (`k + 0.35` to `k + 0.65`) between sections `k` and `k + 1`.
 */
export function getParkedHorizontalSide(sectionProgress: number): number {
  const clamped = Math.max(0, sectionProgress);
  const k = Math.floor(clamped);
  const frac = clamped - k;

  const sideAtK = k % 2 === 0 ? 1 : -1;
  const sideAtNext = (k + 1) % 2 === 0 ? 1 : -1;

  // Plateau region: first 35% and middle 30% around integer section center k
  // Transition occurs between frac = 0.65 and frac = 0.95 so the system is parked
  // for 70% of every section's scroll height.
  const transitionStart = 0.65;
  const transitionEnd = 0.95;

  if (frac <= transitionStart) {
    return sideAtK;
  }
  if (frac >= transitionEnd) {
    return sideAtNext;
  }

  const t = smootherStep(transitionStart, transitionEnd, frac);
  return lerp(sideAtK, sideAtNext, t);
}

/**
 * Projects a 3D point `(x, y, z)` in orbital space onto 2D canvas screen coordinates.
 *
 * - In orbital space, the ecliptic plane is `(x, z)` and `y` is vertical elevation.
 * - When `pitchDeg = 90°` (default Plan View), `sin(90°) = 1`, `cos(90°) = 0`,
 *   so `(x, z)` maps directly onto `(screenX, screenY)` as true concentric circles.
 * - When `pitchDeg = 25°` (Selected Planet 3D Perspective View), the ecliptic foreshortens
 *   into a rich 3D angled perspective with vertical elevation relief.
 */
export interface ProjectedPoint {
  screenX: number;
  screenY: number;
  depth: number;
  scale: number;
}

export function projectOrbitalPoint(
  wx: number,
  wy: number,
  wz: number,
  cameraCenterX: number,
  cameraCenterY: number,
  pitchDeg: number,
  zoomScale: number,
  focusWorldX: number,
  focusWorldY: number,
  focusWorldZ: number
): ProjectedPoint {
  const rx = wx - focusWorldX;
  const ry = wy - focusWorldY;
  const rz = wz - focusWorldZ;

  const pitchRad = (pitchDeg * Math.PI) / 180;
  const sinP = Math.sin(pitchRad);
  const cosP = Math.cos(pitchRad);

  // Rotate around X axis by pitch angle:
  // At pitch = 90deg: sinP = 1, cosP = 0 -> y2d = rz, depth = -ry
  // At pitch = 25deg: foreshortened z + vertical y elevation
  const rotatedY = rz * sinP - ry * cosP;
  const rotatedDepth = rz * cosP + ry * sinP;

  // Subtle perspective foreshortening when pitched away from 90deg
  const perspectiveStrength = (1 - sinP) * 0.00055;
  const perspectiveFactor = 1 / Math.max(0.45, 1 + rotatedDepth * perspectiveStrength);

  const finalScale = zoomScale * perspectiveFactor;

  return {
    screenX: cameraCenterX + rx * finalScale,
    screenY: cameraCenterY + rotatedY * finalScale,
    depth: rotatedDepth,
    scale: finalScale
  };
}
