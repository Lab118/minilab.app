export type ThemeMode = 'dusk' | 'dawn';

export type PlanetId =
  | 'sol'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'outer';

export type CardAlignment = 'left' | 'right';

export interface MoonSpec {
  id: string;
  name: string;
  code: string;
  orbitRadius: number;
  radius: number;
  baseAngle: number;
  orbitalSpeed: number;
  roleLabel: string;
}

export interface MiniAppInputField {
  key: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  options?: string[];
}

export interface PlanetMiniApp {
  id: string;
  title: string;
  tag: string;
  status: 'LIVE SANDBOX' | 'PROTOTYPE' | 'ORBITAL SLOT';
  moonHost?: string;
  description: string;
  actionLabel: string;
  inputs: MiniAppInputField[];
  sampleOutputs: Record<string, string[]>;
}

export interface TrajectoryMilestone {
  code: string;
  era: string;
  role: string;
  context: string;
  highlight?: boolean;
}

export interface PlanetConfig {
  id: PlanetId;
  sectionIndex: number;
  code: string;
  name: string;
  subtitle: string;
  orbitTitle: string;
  cardSide: CardAlignment;
  /**Parked side for the Solar System when this section is active ('right' if card is 'left', 'left' if card is 'right')*/
  solarSystemParkedSide: CardAlignment;
  /**Base orbital radius in scene units (0 for Sol)*/
  orbitRadius: number;
  /**Visual body radius in scene units*/
  bodyRadius: number;
  /**Initial orbital angle in radians*/
  baseAngle: number;
  /**Angular velocity multiplier during scroll + ambient drift*/
  orbitalSpeed: number;
  /**Axial tilt in degrees for 3D perspective inspection*/
  axialTiltDeg: number;
  /**Has planetary rings (Saturn / Outer)*/
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  /**Telemetry callout tag rendered on the 3D canvas leader line*/
  canvasCallout: string;
  /**Short coordinates / telemetry readout*/
  telemetryCoords: string;
  /**Concise editorial description for the HUD section card*/
  summary: string;
  /**Key specs or bullet highlights displayed inside the compact HUD card*/
  specs: { label: string; value: string }[];
  /**Optional trajectory milestones (used on Sol & Earth/NYC)*/
  trajectory?: TrajectoryMilestone[];
  /**Orbiting moons*/
  moons: MoonSpec[];
  /**Modular AI Mini-Apps hosted on this planet's orbit*/
  miniApps: PlanetMiniApp[];
}
