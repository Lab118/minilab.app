import React from 'react';
import { PLANETS_REGISTRY } from '../config/planetsRegistry';
import { PlanetId } from '../types/solarSystem';

interface BottomPlanetDockProps {
  activeSectionIndex: number;
  selectedPlanetId: PlanetId | null;
  onJumpToSection: (sectionIndex: number) => void;
  onSelectPlanet: (planetId: PlanetId) => void;
  onResetPlanView: () => void;
}

export const BottomPlanetDock: React.FC<BottomPlanetDockProps> = ({
  activeSectionIndex,
  selectedPlanetId,
  onJumpToSection,
  onSelectPlanet,
  onResetPlanView
}) => {
  return (
    <nav
      className="hud-bottom-dock"
      aria-label="Solar System Planetary Orbit Navigation"
    >
      <div className="dock-scroll-track">
        {PLANETS_REGISTRY.map((planet) => {
          const isCurrentSection = planet.sectionIndex === activeSectionIndex;
          const isSelected3D = planet.id === selectedPlanetId;
          const shortName = planet.name.split(' ')[0];

          return (
            <button
              key={planet.id}
              type="button"
              className={`dock-planet-btn ${
                isCurrentSection ? 'is-section-active' : ''
              } ${isSelected3D ? 'is-3d-selected' : ''}`}
              onClick={() => {
                if (selectedPlanetId) {
                  // If already inspecting in 3D mode, switch 3D focus to this planet
                  onSelectPlanet(planet.id);
                } else {
                  onJumpToSection(planet.sectionIndex);
                }
              }}
              onDoubleClick={() => onSelectPlanet(planet.id)}
              title={`${planet.name} — Click to scroll, or Launch 3D View`}
            >
              <span className="dock-index">
                0{planet.sectionIndex}
              </span>
              <span className="dock-name">{shortName}</span>
              {planet.moons.length > 0 && (
                <span className="dock-moon-count" title={`${planet.moons.length} moon(s)`}>
                  •{planet.moons.length}
                </span>
              )}
            </button>
          );
        })}

        {selectedPlanetId ? (
          <button
            type="button"
            className="dock-mode-pill is-active-3d"
            onClick={onResetPlanView}
          >
            [90° PLAN]
          </button>
        ) : (
          <button
            type="button"
            className="dock-mode-pill"
            onClick={() => {
              const current =
                PLANETS_REGISTRY[activeSectionIndex] || PLANETS_REGISTRY[0];
              onSelectPlanet(current.id);
            }}
          >
            [25° 3D VIEW]
          </button>
        )}
      </div>
    </nav>
  );
};
