import React, { useCallback, useEffect, useState } from 'react';
import { BottomPlanetDock } from './components/BottomPlanetDock';
import { MiniAppDrawer } from './components/MiniAppDrawer';
import { PlanetSectionCard } from './components/PlanetSectionCard';
import { SolarSystemCanvas } from './components/SolarSystemCanvas';
import { TopHudHeader } from './components/TopHudHeader';
import { PLANETS_REGISTRY } from './config/planetsRegistry';
import { PlanetId, ThemeMode } from './types/solarSystem';
import { clamp } from './utils/orbitalMath';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('dusk');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [sectionProgress, setSectionProgress] = useState<number>(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [selectedPlanetId, setSelectedPlanetId] = useState<PlanetId | null>(null);

  // Sync Dawn / Dusk theme attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dusk' ? 'dawn' : 'dusk'));
  }, []);

  // Track window scroll to drive orbital positions, parked camera dwell curve, and Blueprint-to-Sketch stroke style
  useEffect(() => {
    const updateScrollTelemetry = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const norm = clamp(scrollTop / maxScroll, 0, 1);
      const totalSections = PLANETS_REGISTRY.length;
      const contSection = norm * (totalSections - 1);
      const nearestIndex = clamp(
        Math.round(contSection),
        0,
        totalSections - 1
      );

      setScrollProgress(norm);
      setSectionProgress(contSection);
      setActiveSectionIndex(nearestIndex);
    };

    updateScrollTelemetry();
    window.addEventListener('scroll', updateScrollTelemetry, { passive: true });
    window.addEventListener('resize', updateScrollTelemetry);
    return () => {
      window.removeEventListener('scroll', updateScrollTelemetry);
      window.removeEventListener('resize', updateScrollTelemetry);
    };
  }, []);

  // Keyboard Escape returns from 25° 3D Perspective View to 90° Top-Down Plan View
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPlanetId) {
        setSelectedPlanetId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedPlanetId]);

  const handleJumpToSection = useCallback((sectionIndex: number) => {
    const targetPlanet = PLANETS_REGISTRY[sectionIndex];
    if (!targetPlanet) return;
    const el = document.getElementById(`section-${targetPlanet.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectPlanet = useCallback((planetId: PlanetId) => {
    setSelectedPlanetId(planetId);
    const el = document.getElementById(`section-${planetId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleResetPlanView = useCallback(() => {
    setSelectedPlanetId(null);
  }, []);

  return (
    <div className="minilab-shell">
      {/* Fixed Interactive 90°-to-25° Solar System Canvas */}
      <SolarSystemCanvas
        theme={theme}
        scrollProgress={scrollProgress}
        sectionProgress={sectionProgress}
        activeSectionIndex={activeSectionIndex}
        selectedPlanetId={selectedPlanetId}
        onSelectPlanet={handleSelectPlanet}
      />

      {/* Fixed Editorial Top HUD Bar with Dawn/Dusk Toggle */}
      <TopHudHeader
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeSectionIndex={activeSectionIndex}
        scrollProgress={scrollProgress}
        selectedPlanetId={selectedPlanetId}
        onResetPlanView={handleResetPlanView}
        onJumpToSection={handleJumpToSection}
      />

      {/* Scrollable Planetary Sections (Alternating Left / Right HUD Cards) */}
      <main className="planetary-scroll-stream">
        {PLANETS_REGISTRY.map((planet) => (
          <PlanetSectionCard
            key={planet.id}
            planet={planet}
            isActive={planet.sectionIndex === activeSectionIndex}
            isSelected={planet.id === selectedPlanetId}
            onSelectPlanet={handleSelectPlanet}
          />
        ))}
      </main>

      {/* Interactive 3D Perspective Mini-App Sandbox Drawer */}
      <MiniAppDrawer
        selectedPlanetId={selectedPlanetId}
        onClose={handleResetPlanView}
        onSelectPlanet={handleSelectPlanet}
      />

      {/* Fixed Bottom Swipeable Planetary Orbit Dock */}
      <BottomPlanetDock
        activeSectionIndex={activeSectionIndex}
        selectedPlanetId={selectedPlanetId}
        onJumpToSection={handleJumpToSection}
        onSelectPlanet={handleSelectPlanet}
        onResetPlanView={handleResetPlanView}
      />
    </div>
  );
};
