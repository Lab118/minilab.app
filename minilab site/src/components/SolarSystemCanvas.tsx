import React, { useEffect, useRef } from 'react';
import { PLANETS_REGISTRY } from '../config/planetsRegistry';
import { PlanetConfig, PlanetId, ThemeMode } from '../types/solarSystem';
import {
  clamp,
  getParkedHorizontalSide,
  lerp,
  projectOrbitalPoint
} from '../utils/orbitalMath';

interface SolarSystemCanvasProps {
  theme: ThemeMode;
  scrollProgress: number; // 0 to 1 across entire page
  sectionProgress: number; // 0 to (N - 1) continuous section index
  activeSectionIndex: number;
  selectedPlanetId: PlanetId | null;
  onSelectPlanet: (planetId: PlanetId) => void;
}

interface HitTarget {
  id: PlanetId;
  x: number;
  y: number;
  radius: number;
}

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  theme,
  scrollProgress,
  sectionProgress,
  activeSectionIndex,
  selectedPlanetId,
  onSelectPlanet
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hitTargetsRef = useRef<HitTarget[]>([]);
  const hoveredPlanetRef = useRef<PlanetId | null>(null);

  // Smoothly animated camera state stored in ref for 60fps requestAnimationFrame loop
  const animStateRef = useRef({
    pitchDeg: 90,
    zoomMultiplier: 1,
    focusX: 0,
    focusY: 0,
    focusZ: 0,
    screenCenterX: 0,
    screenCenterY: 0,
    ambientTime: 0,
    initialized: false
  });

  // Keep latest props accessible inside the rAF loop without re-binding canvas
  const latestPropsRef = useRef({
    theme,
    scrollProgress,
    sectionProgress,
    activeSectionIndex,
    selectedPlanetId
  });

  useEffect(() => {
    latestPropsRef.current = {
      theme,
      scrollProgress,
      sectionProgress,
      activeSectionIndex,
      selectedPlanetId
    };
  }, [theme, scrollProgress, sectionProgress, activeSectionIndex, selectedPlanetId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Helper: Draw a circle/ellipse with progressive Blueprint-to-Galileo-Sketch styling
    const drawHybridEllipse = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      rotation: number,
      sketchFactor: number,
      strokeColor: string,
      baseAlpha: number,
      lineWidth: number,
      seed: number,
      dashed = false
    ) => {
      if (rx <= 0.5 || ry <= 0.5) return;
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.globalAlpha = baseAlpha;
      ctx.lineWidth = lineWidth;

      if (dashed) {
        ctx.setLineDash([4, 5]);
      }

      // Pass 1: Clean geometric blueprint ellipse
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, rotation, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pass 2: Progressive Galileo hand-drawn sketch contour as user scrolls down
      if (sketchFactor > 0.04) {
        ctx.globalAlpha = baseAlpha * sketchFactor * 0.65;
        ctx.lineWidth = Math.max(0.7, lineWidth * 0.85);
        ctx.beginPath();
        const steps = 44;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          const jitter =
            sketchFactor *
            1.65 *
            (Math.sin(theta * 5 + seed * 1.7) * 0.6 +
              Math.cos(theta * 9 - seed * 2.3) * 0.4);
          const px = (rx + jitter) * Math.cos(theta);
          const py = (ry + jitter * 0.8) * Math.sin(theta);
          const rotX = px * Math.cos(rotation) - py * Math.sin(rotation);
          const rotY = px * Math.sin(rotation) + py * Math.cos(rotation);
          if (i === 0) {
            ctx.moveTo(cx + rotX, cy + rotY);
          } else {
            ctx.lineTo(cx + rotX, cy + rotY);
          }
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    // Helper: Draw planetary sphere with CAD wireframe + progressive Galileo cross-hatching
    const drawCelestialBody = (
      sx: number,
      sy: number,
      radius: number,
      sketchFactor: number,
      sunAngle: number,
      primaryInk: string,
      secondaryInk: string,
      accentColor: string,
      bgFill: string,
      isHighlighted: boolean,
      isSol: boolean,
      seed: number
    ) => {
      ctx.save();

      // Solid background occlusion disk so orbit lines behind the planet are cleanly masked
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.fillStyle = bgFill;
      ctx.fill();

      if (isSol) {
        // Helios Core radial blueprint rays + warm accent core
        const grad = ctx.createRadialGradient(
          sx,
          sy,
          radius * 0.1,
          sx,
          sy,
          radius * 2.4
        );
        grad.addColorStop(0, accentColor);
        grad.addColorStop(1, 'transparent');
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sx, sy, radius * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Solar compass ticks
        const tickCount = 16;
        ctx.strokeStyle = isHighlighted ? accentColor : primaryInk;
        ctx.lineWidth = 1;
        for (let i = 0; i < tickCount; i++) {
          const a = (i / tickCount) * Math.PI * 2 + seed * 0.08;
          const innerR = radius * 1.14;
          const outerR =
            i % 4 === 0 ? radius * 1.48 : radius * (1.26 + sketchFactor * 0.1);
          ctx.globalAlpha = i % 4 === 0 ? 0.75 : 0.4;
          ctx.beginPath();
          ctx.moveTo(sx + Math.cos(a) * innerR, sy + Math.sin(a) * innerR);
          ctx.lineTo(sx + Math.cos(a) * outerR, sy + Math.sin(a) * outerR);
          ctx.stroke();
        }
      }

      // Blueprint internal latitude/longitude wireframe arcs
      ctx.save();
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = isHighlighted ? accentColor : secondaryInk;
      ctx.lineWidth = 0.75;
      ctx.globalAlpha = 0.42;

      // Equatorial & meridian blueprint ellipses
      ctx.beginPath();
      ctx.ellipse(sx, sy, radius, radius * 0.38, 0.25, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(sx, sy, radius * 0.42, radius, 0.25, 0, Math.PI * 2);
      ctx.stroke();

      // Galileo Sketch Crescent Cross-Hatching (intensifies with scrollProgress)
      if (!isSol && sketchFactor > 0.05) {
        const hatchCount = Math.floor(6 + sketchFactor * 10);
        ctx.strokeStyle = isHighlighted ? accentColor : primaryInk;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = clamp(sketchFactor * 0.68, 0.08, 0.68);

        const shadowDir = sunAngle; // Opposite away from Sol (0,0)
        const perpDir = shadowDir + Math.PI / 2;

        for (let i = -hatchCount; i <= hatchCount; i++) {
          const t = i / hatchCount;
          const offsetAlongPerp = t * radius * 0.92;
          const halfChord = Math.sqrt(
            Math.max(0, radius * radius - offsetAlongPerp * offsetAlongPerp)
          );
          // Start hatching on the night-side crescent
          const crescentStart = lerp(radius * 0.25, -radius * 0.15, sketchFactor);
          const x0 =
            sx +
            Math.cos(perpDir) * offsetAlongPerp +
            Math.cos(shadowDir) * crescentStart;
          const y0 =
            sy +
            Math.sin(perpDir) * offsetAlongPerp +
            Math.sin(shadowDir) * crescentStart;
          const x1 =
            sx +
            Math.cos(perpDir) * offsetAlongPerp +
            Math.cos(shadowDir) * halfChord;
          const y1 =
            sy +
            Math.sin(perpDir) * offsetAlongPerp +
            Math.sin(shadowDir) * halfChord;

          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }

        // Secondary diagonal cross-hatch pass at high scroll values (> 50%)
        if (sketchFactor > 0.45) {
          const crossAlpha = (sketchFactor - 0.45) * 0.7;
          ctx.globalAlpha = crossAlpha;
          const diagDir = shadowDir + 0.55;
          const diagPerp = diagDir + Math.PI / 2;
          for (let i = -6; i <= 6; i++) {
            const offset = (i / 6) * radius * 0.85;
            const x0 =
              sx + Math.cos(diagPerp) * offset + Math.cos(diagDir) * (radius * 0.1);
            const y0 =
              sy + Math.sin(diagPerp) * offset + Math.sin(diagDir) * (radius * 0.1);
            const x1 =
              sx + Math.cos(diagPerp) * offset + Math.cos(diagDir) * (radius * 0.95);
            const y1 =
              sy + Math.sin(diagPerp) * offset + Math.sin(diagDir) * (radius * 0.95);
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
          }
        }
      }

      ctx.restore();

      // Outer circumference contour (Blueprint + Galileo double-pass)
      drawHybridEllipse(
        sx,
        sy,
        radius,
        radius,
        0,
        sketchFactor,
        isHighlighted ? accentColor : primaryInk,
        isHighlighted ? 1 : 0.9,
        isHighlighted ? 1.85 : 1.3,
        seed
      );

      // Precision center reticle dot
      ctx.fillStyle = isHighlighted ? accentColor : primaryInk;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(sx, sy, isHighlighted ? 2.2 : 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTimestamp) / 1000);
      lastTimestamp = now;

      const {
        theme: currentTheme,
        scrollProgress: curScroll,
        sectionProgress: curSectionProg,
        activeSectionIndex: curActiveIdx,
        selectedPlanetId: curSelectedId
      } = latestPropsRef.current;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPhonePortrait = width < 540;
      const isTablet = width >= 540 && width < 900;

      // Theme palette tokens (Dusk default dark vs Dawn light)
      const palette =
        currentTheme === 'dusk'
          ? {
              bg: '#070E1C',
              primaryInk: '#67E8F9',
              secondaryInk: '#94A3B8',
              accent: '#FF6B4A',
              gridHairline: 'rgba(103, 232, 249, 0.08)',
              orbitLine: '#67E8F9',
              calloutBg: 'rgba(7, 14, 28, 0.88)'
            }
          : {
              bg: '#FBF6EE',
              primaryInk: '#1C1917',
              secondaryInk: '#57534E',
              accent: '#D94826',
              gridHairline: 'rgba(28, 25, 23, 0.07)',
              orbitLine: '#1C1917',
              calloutBg: 'rgba(251, 246, 238, 0.92)'
            };

      const anim = animStateRef.current;
      anim.ambientTime += dt * 0.22;

      // Compute responsive base scale so all 8 orbits fit cleanly in the parked half of the screen
      const maxSystemRadius = 355;
      const baseResponsiveScale = isPhonePortrait
        ? clamp((Math.min(width, height * 0.56) * 0.44) / maxSystemRadius, 0.34, 0.56)
        : isTablet
          ? clamp((Math.min(width * 0.54, height * 0.76) * 0.48) / maxSystemRadius, 0.48, 0.78)
          : clamp((Math.min(width * 0.56, height * 0.84) * 0.52) / maxSystemRadius, 0.64, 1.08);

      // Compute each planet's instantaneous 3D world position (scroll-driven + gentle ambient drift)
      const planetWorldMap = new Map<
        PlanetId,
        { wx: number; wy: number; wz: number; angle: number; config: PlanetConfig }
      >();

      for (const planet of PLANETS_REGISTRY) {
        const scrollAngleOffset = curScroll * Math.PI * 1.65 * planet.orbitalSpeed;
        const ambientOffset = anim.ambientTime * planet.orbitalSpeed * 0.35;
        const totalAngle = planet.baseAngle + scrollAngleOffset + ambientOffset;
        const wx = Math.cos(totalAngle) * planet.orbitRadius;
        const wz = Math.sin(totalAngle) * planet.orbitRadius;
        const wy = 0;
        planetWorldMap.set(planet.id, { wx, wy, wz, angle: totalAngle, config: planet });
      }

      // Determine target camera state:
      // - Default (no planet selected): 90° Top-Down Plan View, parked on the opposite side of active card
      // - Planet Selected: 25° 3D Perspective View, zoomed 2.8x onto selected planet
      const parkedSide = getParkedHorizontalSide(curSectionProg); // +1 right, -1 left

      let targetCenterX: number;
      let targetCenterY: number;
      let targetPitchDeg = 90;
      let targetZoomMultiplier = 1.0;
      let targetFocusX = 0;
      let targetFocusY = 0;
      let targetFocusZ = 0;

      if (curSelectedId) {
        const selectedWorld = planetWorldMap.get(curSelectedId);
        if (selectedWorld) {
          targetFocusX = selectedWorld.wx;
          targetFocusY = selectedWorld.wy;
          targetFocusZ = selectedWorld.wz;
        }
        targetPitchDeg = 25; // Angled 3D Perspective View
        targetZoomMultiplier = 2.8;

        // Position the focused 3D planet cleanly opposite the open Mini-App Sandbox Drawer
        if (isPhonePortrait) {
          targetCenterX = width * 0.5;
          targetCenterY = height * 0.27;
        } else {
          targetCenterX = width * 0.33;
          targetCenterY = height * 0.48;
        }
      } else {
        if (isPhonePortrait) {
          // Android & iOS Portrait Phones (< 540px): upper-opposite quadrant
          targetCenterX = width * 0.5 + parkedSide * (width * 0.15);
          targetCenterY = height * 0.32;
        } else {
          // Desktop (>= 900px) & iPad/Tablets (540px-899px): opposite horizontal side
          targetCenterX = width * 0.5 + parkedSide * (width * 0.2);
          targetCenterY = height * 0.5;
        }
      }

      if (!anim.initialized) {
        anim.screenCenterX = targetCenterX;
        anim.screenCenterY = targetCenterY;
        anim.pitchDeg = targetPitchDeg;
        anim.zoomMultiplier = targetZoomMultiplier;
        anim.focusX = targetFocusX;
        anim.focusY = targetFocusY;
        anim.focusZ = targetFocusZ;
        anim.initialized = true;
      } else {
        const smoothSpeed = Math.min(1, dt * 6.5);
        anim.screenCenterX = lerp(anim.screenCenterX, targetCenterX, smoothSpeed);
        anim.screenCenterY = lerp(anim.screenCenterY, targetCenterY, smoothSpeed);
        anim.pitchDeg = lerp(anim.pitchDeg, targetPitchDeg, smoothSpeed);
        anim.zoomMultiplier = lerp(anim.zoomMultiplier, targetZoomMultiplier, smoothSpeed);
        anim.focusX = lerp(anim.focusX, targetFocusX, smoothSpeed);
        anim.focusY = lerp(anim.focusY, targetFocusY, smoothSpeed);
        anim.focusZ = lerp(anim.focusZ, targetFocusZ, smoothSpeed);
      }

      const effectiveScale = baseResponsiveScale * anim.zoomMultiplier;
      const sketchFactor = clamp(curScroll, 0, 1);

      // Clear background
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      // 1. Subtle architectural CAD coordinate grid & crosshairs
      ctx.save();
      ctx.strokeStyle = palette.gridHairline;
      ctx.lineWidth = 1;
      const gridStep = isPhonePortrait ? 64 : 88;
      for (let x = (anim.screenCenterX % gridStep); x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = (anim.screenCenterY % gridStep); y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Ecliptic origin axes passing through Sol
      const solProj = projectOrbitalPoint(
        0,
        0,
        0,
        anim.screenCenterX,
        anim.screenCenterY,
        anim.pitchDeg,
        effectiveScale,
        anim.focusX,
        anim.focusY,
        anim.focusZ
      );
      ctx.strokeStyle = palette.primaryInk;
      ctx.globalAlpha = 0.11;
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.moveTo(0, solProj.screenY);
      ctx.lineTo(width, solProj.screenY);
      ctx.moveTo(solProj.screenX, 0);
      ctx.lineTo(solProj.screenX, height);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 2. Render concentric planetary orbits (foreshortened by pitchDeg when in 25° 3D mode)
      const pitchRad = (anim.pitchDeg * Math.PI) / 180;
      const sinPitch = Math.sin(pitchRad);

      for (const planet of PLANETS_REGISTRY) {
        if (planet.orbitRadius <= 0) continue;
        const isSectionActive = planet.sectionIndex === curActiveIdx;
        const isPlanetSelected = planet.id === curSelectedId;

        const rx = planet.orbitRadius * effectiveScale;
        const ry = planet.orbitRadius * effectiveScale * sinPitch;

        drawHybridEllipse(
          solProj.screenX,
          solProj.screenY,
          rx,
          ry,
          0,
          sketchFactor,
          isPlanetSelected || isSectionActive ? palette.accent : palette.orbitLine,
          isPlanetSelected ? 0.72 : isSectionActive ? 0.52 : 0.22,
          isPlanetSelected || isSectionActive ? 1.25 : 0.85,
          planet.sectionIndex + 1,
          planet.id === 'outer'
        );
      }

      // 3. Project and sort planets by depth for accurate 3D occlusion
      const projectedPlanets = PLANETS_REGISTRY.map((planet) => {
        const w = planetWorldMap.get(planet.id)!;
        const proj = projectOrbitalPoint(
          w.wx,
          w.wy,
          w.wz,
          anim.screenCenterX,
          anim.screenCenterY,
          anim.pitchDeg,
          effectiveScale,
          anim.focusX,
          anim.focusY,
          anim.focusZ
        );
        return {
          planet,
          world: w,
          proj
        };
      }).sort((a, b) => b.proj.depth - a.proj.depth);

      const newHitTargets: HitTarget[] = [];

      // 4. Draw each planet, its rings, its orbiting moons, and its Heron-style redline callout flag
      for (const item of projectedPlanets) {
        const { planet, world, proj } = item;
        const isActiveSection = planet.sectionIndex === curActiveIdx;
        const isSelected = planet.id === curSelectedId;
        const isHovered = planet.id === hoveredPlanetRef.current;
        const isHighlighted = isSelected || isActiveSection || isHovered;

        const visualRadius = Math.max(
          planet.id === 'sol' ? 11 : 4.5,
          planet.bodyRadius * proj.scale
        );

        // Record hit target for click/tap selection
        newHitTargets.push({
          id: planet.id,
          x: proj.screenX,
          y: proj.screenY,
          radius: Math.max(20, visualRadius + 10)
        });

        // Draw planetary rings (Saturn & Outer System)
        if (planet.hasRings && planet.ringInnerRadius && planet.ringOuterRadius) {
          const ringOuter = planet.ringOuterRadius * proj.scale;
          const ringInner = planet.ringInnerRadius * proj.scale;
          const ringTiltAspect = clamp(sinPitch * 0.55 + 0.28, 0.28, 0.82);

          drawHybridEllipse(
            proj.screenX,
            proj.screenY,
            ringOuter,
            ringOuter * ringTiltAspect,
            -0.28,
            sketchFactor,
            isHighlighted ? palette.accent : palette.primaryInk,
            isHighlighted ? 0.85 : 0.5,
            isHighlighted ? 1.3 : 0.95,
            planet.sectionIndex * 10 + 1
          );
          drawHybridEllipse(
            proj.screenX,
            proj.screenY,
            ringInner,
            ringInner * ringTiltAspect,
            -0.28,
            sketchFactor,
            isHighlighted ? palette.accent : palette.secondaryInk,
            isHighlighted ? 0.7 : 0.4,
            0.85,
            planet.sectionIndex * 10 + 2,
            true
          );
        }

        // Draw the planet sphere
        drawCelestialBody(
          proj.screenX,
          proj.screenY,
          visualRadius,
          sketchFactor,
          world.angle,
          palette.primaryInk,
          palette.secondaryInk,
          palette.accent,
          palette.bg,
          isHighlighted,
          planet.id === 'sol',
          planet.sectionIndex + 1
        );

        // Draw 3D Axial Tilt Axis when in 3D Perspective View (`pitch < 75°`)
        if (anim.pitchDeg < 75 && (isSelected || isActiveSection)) {
          const tiltRad = (planet.axialTiltDeg * Math.PI) / 180;
          const axisLen = visualRadius * 1.65;
          ctx.save();
          ctx.strokeStyle = palette.accent;
          ctx.globalAlpha = 0.65;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(
            proj.screenX - Math.sin(tiltRad) * axisLen,
            proj.screenY - Math.cos(tiltRad) * axisLen
          );
          ctx.lineTo(
            proj.screenX + Math.sin(tiltRad) * axisLen,
            proj.screenY + Math.cos(tiltRad) * axisLen
          );
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        // Draw Orbiting Moons (Luna, Phobos, Deimos, Io, Europa, Ganymede, Callisto, Titan, Triton)
        if (planet.moons.length > 0) {
          for (let mIdx = 0; mIdx < planet.moons.length; mIdx++) {
            const moon = planet.moons[mIdx];
            const moonOrbitR = moon.orbitRadius * proj.scale;
            const moonOrbitRy = moonOrbitR * clamp(sinPitch, 0.36, 1);

            // Moon orbit path (visible when highlighted or zoomed in)
            if (isHighlighted || anim.zoomMultiplier > 1.3) {
              drawHybridEllipse(
                proj.screenX,
                proj.screenY,
                moonOrbitR,
                moonOrbitRy,
                0,
                sketchFactor,
                isSelected ? palette.accent : palette.secondaryInk,
                isSelected ? 0.5 : 0.28,
                0.75,
                planet.sectionIndex * 20 + mIdx,
                true
              );
            }

            const moonAngle =
              moon.baseAngle +
              curScroll * Math.PI * 2.4 * moon.orbitalSpeed +
              anim.ambientTime * moon.orbitalSpeed * 0.9;
            const mx = proj.screenX + Math.cos(moonAngle) * moonOrbitR;
            const my = proj.screenY + Math.sin(moonAngle) * moonOrbitRy;
            const mRadius = Math.max(1.8, moon.radius * proj.scale * 0.85);

            ctx.save();
            ctx.fillStyle = palette.bg;
            ctx.beginPath();
            ctx.arc(mx, my, mRadius + 1, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = isHighlighted ? palette.accent : palette.primaryInk;
            ctx.fillStyle = isHighlighted ? palette.accent : palette.primaryInk;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(mx, my, mRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Moon label when selected in 3D Perspective Mode
            if (isSelected && anim.zoomMultiplier > 1.6) {
              ctx.font = '500 9px "JetBrains Mono", monospace';
              ctx.fillStyle = palette.primaryInk;
              ctx.globalAlpha = 0.9;
              ctx.fillText(
                `[${moon.code}] ${moon.name.toUpperCase()}`,
                mx + mRadius + 5,
                my + 3
              );
            }
            ctx.restore();
          }
        }

        // Heron AI Redline Leader-Line Callout Flag
        const showFullCallout = isSelected || isActiveSection || isHovered;
        const showCompactTag = !isPhonePortrait && !curSelectedId;

        if (showFullCallout || showCompactTag) {
          ctx.save();
          const dirX = proj.screenX >= anim.screenCenterX ? 1 : -1;
          const dirY = proj.screenY >= anim.screenCenterY ? 1 : -1;
          const elbowLen = showFullCallout ? 18 : 10;
          const shelfLen = showFullCallout ? (isPhonePortrait ? 92 : 128) : 54;

          const startX = proj.screenX + dirX * (visualRadius + 3);
          const startY = proj.screenY + dirY * (visualRadius * 0.5);
          const elbowX = startX + dirX * elbowLen;
          const elbowY = startY + dirY * elbowLen;
          const endX = elbowX + dirX * shelfLen;

          ctx.strokeStyle = showFullCallout ? palette.accent : palette.secondaryInk;
          ctx.lineWidth = showFullCallout ? 1.15 : 0.75;
          ctx.globalAlpha = showFullCallout ? 0.95 : 0.45;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(endX, elbowY);
          ctx.stroke();

          // Terminal node square
          ctx.fillStyle = showFullCallout ? palette.accent : palette.secondaryInk;
          ctx.fillRect(startX - 1.5, startY - 1.5, 3, 3);

          // Callout text
          ctx.font = showFullCallout
            ? '600 10px "JetBrains Mono", monospace'
            : '500 9px "JetBrains Mono", monospace';
          ctx.textAlign = dirX > 0 ? 'left' : 'right';
          ctx.fillStyle = showFullCallout ? palette.accent : palette.secondaryInk;

          const labelText = showFullCallout
            ? `[${planet.canvasCallout}]`
            : planet.name.split(' ')[0];
          const textX = elbowX + dirX * 4;
          ctx.fillText(labelText, textX, elbowY - 4);

          if (showFullCallout && !isPhonePortrait) {
            ctx.font = '400 8.5px "JetBrains Mono", monospace';
            ctx.fillStyle = palette.secondaryInk;
            ctx.fillText(planet.telemetryCoords, textX, elbowY + 10);
          }

          ctx.restore();
        }
      }

      hitTargetsRef.current = newHitTargets;

      // 5. Bottom-corner CAD Telemetry Readout (Camera Pitch, Parked State & Sketch Mode)
      if (!isPhonePortrait) {
        ctx.save();
        ctx.font = '500 10px "JetBrains Mono", monospace';
        ctx.fillStyle = palette.secondaryInk;
        ctx.globalAlpha = 0.72;
        const camModeLabel = curSelectedId
          ? `3D PERSPECTIVE LOCK // PITCH ${anim.pitchDeg.toFixed(0)}° // ZOOM ${anim.zoomMultiplier.toFixed(1)}X`
          : `90° TOP-DOWN PLAN VIEW // PARKED ${parkedSide >= 0 ? 'RIGHT' : 'LEFT'} // SKETCH ${Math.round(sketchFactor * 100)}%`;
        ctx.fillText(`[CAM // ${camModeLabel}]`, 24, height - 68);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let matched: PlanetId | null = null;
    for (const target of hitTargetsRef.current) {
      const dx = x - target.x;
      const dy = y - target.y;
      if (dx * dx + dy * dy <= target.radius * target.radius) {
        matched = target.id;
        break;
      }
    }
    hoveredPlanetRef.current = matched;
    e.currentTarget.style.cursor = matched ? 'pointer' : 'default';
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const target of hitTargetsRef.current) {
      const dx = x - target.x;
      const dy = y - target.y;
      if (dx * dx + dy * dy <= target.radius * target.radius) {
        onSelectPlanet(target.id);
        return;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="solar-system-canvas"
      onPointerMove={handlePointerMove}
      onClick={handleCanvasClick}
      aria-label="Interactive 3D Solar System Blueprint and Galileo Sketch Canvas"
    />
  );
};
