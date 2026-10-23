import React from 'react';
import { CREATOR_PROFILE } from '../config/planetsRegistry';
import { PlanetConfig, PlanetId } from '../types/solarSystem';

interface PlanetSectionCardProps {
  planet: PlanetConfig;
  isActive: boolean;
  isSelected: boolean;
  onSelectPlanet: (planetId: PlanetId) => void;
}

export const PlanetSectionCard: React.FC<PlanetSectionCardProps> = ({
  planet,
  isActive,
  isSelected,
  onSelectPlanet
}) => {
  const alignmentClass =
    planet.cardSide === 'left' ? 'section-align-left' : 'section-align-right';

  return (
    <section
      id={`section-${planet.id}`}
      data-section-index={planet.sectionIndex}
      className={`planet-scroll-section ${alignmentClass}`}
      aria-label={`${planet.name} — ${planet.subtitle}`}
    >
      <article
        className={`hud-editorial-card ${isActive ? 'is-active' : ''} ${
          isSelected ? 'is-selected' : ''
        }`}
      >
        {/* Top Bracket Telemetry Header */}
        <div className="card-top-meta">
          <span className="card-bracket-code">[{planet.code}]</span>
          <span className="card-park-indicator">
            SYS PARKED: {planet.solarSystemParkedSide.toUpperCase()}
          </span>
        </div>

        {/* Section Title & Subtitle */}
        <h2 className="card-planet-title">{planet.name}</h2>
        <p className="card-orbit-subtitle">{planet.subtitle}</p>

        {/* Concise Editorial Summary */}
        <p className="card-summary-text">{planet.summary}</p>

        {/* Creator Trajectory Milestones (Rendered on Sol & Earth/NYC) */}
        {planet.trajectory && planet.trajectory.length > 0 && (
          <div className="card-trajectory-list" role="list">
            {planet.trajectory.map((item) => (
              <div
                key={item.code}
                role="listitem"
                className={`trajectory-item ${
                  item.highlight ? 'trajectory-highlight' : ''
                }`}
              >
                <div className="trajectory-header">
                  <span className="trajectory-code">[{item.code}]</span>
                  <span className="trajectory-era">{item.era}</span>
                </div>
                <div className="trajectory-role">{item.role}</div>
                <div className="trajectory-context">{item.context}</div>
              </div>
            ))}
          </div>
        )}

        {/* Compact Technical Specs Grid */}
        <dl className="card-specs-grid">
          {planet.specs.map((spec) => (
            <div key={spec.label} className="spec-cell">
              <dt className="spec-label">{spec.label}</dt>
              <dd className="spec-value">{spec.value}</dd>
            </div>
          ))}
        </dl>

        {/* Orbiting Moons Sub-Agents / Satellites Strip */}
        {planet.moons.length > 0 && (
          <div className="card-moons-strip">
            <span className="moons-strip-label">SATELLITES:</span>
            <div className="moons-badges">
              {planet.moons.map((m) => (
                <span
                  key={m.id}
                  className="moon-chip"
                  title={`${m.name}: ${m.roleLabel}`}
                >
                  {m.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Primary Action: Tilt Camera to 25° 3D View & Open Planet Mini-App */}
        <div className="card-actions-footer">
          <button
            type="button"
            className="card-launch-btn"
            onClick={() => onSelectPlanet(planet.id)}
          >
            <span>
              {isSelected
                ? 'MINI-APP ACTIVE [25° 3D LOCK]'
                : 'LAUNCH PLANET MINI-APP'}
            </span>
            <span className="btn-arrow">[25° 3D ↗]</span>
          </button>

          {planet.id === 'outer' && (
            <a
              href={`mailto:${CREATOR_PROFILE.email}?subject=minilab.app%20//%20NYC%20Production%20%26%20Creative%20Tech%20Inquiry`}
              className="card-direct-mail-link"
            >
              EMAIL: {CREATOR_PROFILE.email.toUpperCase()} ↗
            </a>
          )}
        </div>
      </article>
    </section>
  );
};
