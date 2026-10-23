import React, { useEffect, useState } from 'react';
import { CREATOR_PROFILE, PLANETS_REGISTRY } from '../config/planetsRegistry';
import { PlanetId } from '../types/solarSystem';

interface MiniAppDrawerProps {
  selectedPlanetId: PlanetId | null;
  onClose: () => void;
  onSelectPlanet: (planetId: PlanetId) => void;
}

export const MiniAppDrawer: React.FC<MiniAppDrawerProps> = ({
  selectedPlanetId,
  onClose,
  onSelectPlanet
}) => {
  const planet = PLANETS_REGISTRY.find((p) => p.id === selectedPlanetId) || null;

  const [activeAppIndex, setActiveAppIndex] = useState(0);
  const [selectedPresetOption, setSelectedPresetOption] = useState<string>('');
  const [secondaryNote, setSecondaryNote] = useState<string>('');
  const [activeMoonId, setActiveMoonId] = useState<string | null>(null);
  const [executionCount, setExecutionCount] = useState<number>(1);

  useEffect(() => {
    if (!planet) return;
    setActiveAppIndex(0);
    const firstApp = planet.miniApps[0];
    if (firstApp && firstApp.inputs.length > 0) {
      setSelectedPresetOption(firstApp.inputs[0].defaultValue);
      setSecondaryNote(firstApp.inputs[1]?.defaultValue || '');
    }
    setActiveMoonId(planet.moons[0]?.id || null);
    setExecutionCount(1);
  }, [planet]);

  if (!planet) return null;

  const activeApp = planet.miniApps[activeAppIndex] || planet.miniApps[0];
  const primaryInput = activeApp?.inputs[0];
  const secondaryInput = activeApp?.inputs[1];

  const outputLines =
    (activeApp &&
      selectedPresetOption &&
      activeApp.sampleOutputs[selectedPresetOption]) ||
    (activeApp
      ? Object.values(activeApp.sampleOutputs)[0] || []
      : []);

  const handleSwitchApp = (index: number) => {
    setActiveAppIndex(index);
    const nextApp = planet.miniApps[index];
    if (nextApp && nextApp.inputs[0]) {
      setSelectedPresetOption(nextApp.inputs[0].defaultValue);
      setSecondaryNote(nextApp.inputs[1]?.defaultValue || '');
    }
  };

  return (
    <aside
      className="miniapp-drawer-backdrop"
      aria-label={`${planet.name} 3D Perspective & Mini-App Sandbox`}
    >
      <div className="miniapp-drawer-panel">
        {/* Drawer Top Bar */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <div className="drawer-telemetry-line">
              <span className="drawer-code">[{planet.code}]</span>
              <span className="drawer-cam-badge">
                3D PERSPECTIVE // PITCH 25° // ZOOM 2.8X
              </span>
            </div>
            <h3 className="drawer-planet-heading">{planet.name}</h3>
            <p className="drawer-orbit-subtitle">{planet.orbitTitle}</p>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            title="Close Mini-App & Return to 90° Plan View"
          >
            [× 90° PLAN]
          </button>
        </div>

        {/* Orbiting Moon Sub-Agent Selector (if planet has moons) */}
        {planet.moons.length > 0 && (
          <div className="drawer-moons-bar">
            <span className="drawer-section-label">
              ORBITING SATELLITE NODES ({planet.moons.length}):
            </span>
            <div className="drawer-moon-tabs">
              {planet.moons.map((moon) => {
                const isMoonActive = activeMoonId === moon.id;
                return (
                  <button
                    key={moon.id}
                    type="button"
                    className={`drawer-moon-tab ${isMoonActive ? 'active' : ''}`}
                    onClick={() => setActiveMoonId(moon.id)}
                  >
                    <span className="moon-tab-code">[{moon.code}]</span>
                    <span className="moon-tab-name">{moon.name}</span>
                    <span className="moon-tab-role">{moon.roleLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modular Mini-App Slot Tabs */}
        <div className="drawer-app-tabs">
          {planet.miniApps.map((app, idx) => (
            <button
              key={app.id}
              type="button"
              className={`drawer-app-tab ${idx === activeAppIndex ? 'active' : ''}`}
              onClick={() => handleSwitchApp(idx)}
            >
              <span>[{app.tag}]</span>
              <span>{app.title}</span>
            </button>
          ))}
          <span className="drawer-slot-indicator" title="Configured in src/config/planetsRegistry.ts">
            + MODULAR SLOT READY
          </span>
        </div>

        {/* Active Mini-App Interactive Controls */}
        {activeApp && (
          <div className="drawer-sandbox-body">
            <div className="sandbox-status-row">
              <span className="sandbox-status-pill">{activeApp.status}</span>
              {activeApp.moonHost && (
                <span className="sandbox-moon-host">
                  NODE: {activeApp.moonHost.toUpperCase()}
                </span>
              )}
            </div>

            <p className="sandbox-description">{activeApp.description}</p>

            {primaryInput && (
              <div className="sandbox-field-group">
                <label className="sandbox-label" htmlFor="miniapp-preset-select">
                  {primaryInput.label}
                </label>
                {primaryInput.options ? (
                  <select
                    id="miniapp-preset-select"
                    className="sandbox-select"
                    value={selectedPresetOption}
                    onChange={(e) => {
                      setSelectedPresetOption(e.target.value);
                      setExecutionCount((c) => c + 1);
                    }}
                  >
                    {primaryInput.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="miniapp-preset-select"
                    type="text"
                    className="sandbox-input"
                    value={selectedPresetOption}
                    onChange={(e) => setSelectedPresetOption(e.target.value)}
                  />
                )}
              </div>
            )}

            {secondaryInput && (
              <div className="sandbox-field-group">
                <label className="sandbox-label" htmlFor="miniapp-secondary-input">
                  {secondaryInput.label}
                </label>
                <input
                  id="miniapp-secondary-input"
                  type="text"
                  className="sandbox-input"
                  value={secondaryNote}
                  placeholder={secondaryInput.placeholder}
                  onChange={(e) => setSecondaryNote(e.target.value)}
                />
              </div>
            )}

            <button
              type="button"
              className="sandbox-execute-btn"
              onClick={() => setExecutionCount((c) => c + 1)}
            >
              <span>{activeApp.actionLabel}</span>
              <span>[RUN #{executionCount}]</span>
            </button>

            {/* Live Telemetry Output Terminal */}
            <div className="sandbox-terminal-output" aria-live="polite">
              <div className="terminal-header">
                <span>TELEMETRY OUTPUT // {activeApp.tag}</span>
                <span>SYNC: OK</span>
              </div>
              <ul className="terminal-lines">
                {outputLines.map((line, i) => (
                  <li key={i} className="terminal-line">
                    {line}
                  </li>
                ))}
                {secondaryNote && (
                  <li className="terminal-line terminal-line-custom">
                    [PARAMETER OVERRIDE] {secondaryNote}
                  </li>
                )}
              </ul>
            </div>

            {/* Direct Email CTA when inside Outer System or Earth/Sol */}
            {(planet.id === 'outer' || planet.id === 'earth' || planet.id === 'sol') && (
              <div className="sandbox-contact-strip">
                <div>
                  <div className="contact-strip-title">
                    {CREATOR_PROFILE.name} — {CREATOR_PROFILE.location}
                  </div>
                  <div className="contact-strip-sub">
                    {CREATOR_PROFILE.currentRoleBadge}
                  </div>
                </div>
                <a
                  href={`mailto:${CREATOR_PROFILE.email}?subject=${encodeURIComponent(
                    `minilab.app // ${selectedPresetOption || 'Inquiry'}`
                  )}&body=${encodeURIComponent(
                    `Hi Lucas,\n\nConnecting via minilab.app (${planet.name} // ${activeApp.title}).\nContext: ${secondaryNote}\n`
                  )}`}
                  className="contact-strip-btn"
                >
                  DISPATCH EMAIL TO {CREATOR_PROFILE.email.toUpperCase()} ↗
                </a>
              </div>
            )}
          </div>
        )}

        {/* Quick Orbit Switcher inside 3D Perspective Mode */}
        <div className="drawer-footer-nav">
          <span className="drawer-footer-label">SWITCH 3D TARGET:</span>
          <div className="drawer-target-pills">
            {PLANETS_REGISTRY.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`drawer-target-pill ${
                  p.id === planet.id ? 'active' : ''
                }`}
                onClick={() => onSelectPlanet(p.id)}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
