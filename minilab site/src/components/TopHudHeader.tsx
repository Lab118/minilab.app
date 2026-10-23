import React from 'react';
import { CREATOR_PROFILE, PLANETS_REGISTRY } from '../config/planetsRegistry';
import { PlanetId, ThemeMode } from '../types/solarSystem';

interface TopHudHeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeSectionIndex: number;
  scrollProgress: number;
  selectedPlanetId: PlanetId | null;
  onResetPlanView: () => void;
  onJumpToSection: (sectionIndex: number) => void;
}

export const TopHudHeader: React.FC<TopHudHeaderProps> = ({
  theme,
  onToggleTheme,
  activeSectionIndex,
  scrollProgress,
  selectedPlanetId,
  onResetPlanView,
  onJumpToSection
}) => {
  const activePlanet =
    PLANETS_REGISTRY[activeSectionIndex] || PLANETS_REGISTRY[0];
  const sketchPct = Math.round(scrollProgress * 100);

  return (
    <header className="hud-top-bar" role="banner">
      <div className="hud-brand-cluster">
        <button
          type="button"
          className="hud-brand-button"
          onClick={() => {
            onResetPlanView();
            onJumpToSection(0);
          }}
          title="Return to Sol (Section 00)"
        >
          <span className="hud-dot" aria-hidden="true" />
          <span className="hud-domain">{CREATOR_PROFILE.domain}</span>
          <span className="hud-divider">//</span>
          <span className="hud-creator">{CREATOR_PROFILE.name.toUpperCase()}</span>
        </button>

        <span className="hud-role-pill">
          {CREATOR_PROFILE.currentRoleBadge}
        </span>
      </div>

      <div className="hud-telemetry-center" aria-live="polite">
        <span className="hud-bracket-tag">[{activePlanet.code}]</span>
        <span className="hud-stroke-meter" title="Scroll-driven Blueprint to Galileo Sketch stroke blend">
          LINEWORK: {sketchPct < 35 ? 'CAD BLUEPRINT' : sketchPct < 75 ? 'HYBRID DRAFT' : 'GALILEO SKETCH'} ({sketchPct}%)
        </span>
      </div>

      <div className="hud-actions-cluster">
        {selectedPlanetId && (
          <button
            type="button"
            className="hud-action-btn hud-reset-cam-btn"
            onClick={onResetPlanView}
          >
            [RETURN TO 90° PLAN VIEW]
          </button>
        )}

        <a
          href={`mailto:${CREATOR_PROFILE.email}`}
          className="hud-action-btn hud-contact-link"
          title={`Email ${CREATOR_PROFILE.name} (${CREATOR_PROFILE.email})`}
        >
          [NYC // CONTACT]
        </a>

        <button
          type="button"
          className="hud-theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dusk' ? 'Dawn (Light)' : 'Dusk (Dark)'} mode`}
        >
          {theme === 'dusk' ? '☾ DUSK' : '☀ DAWN'}
        </button>
      </div>
    </header>
  );
};
