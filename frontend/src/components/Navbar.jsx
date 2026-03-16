import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__brand-icon" style={{ display: 'flex', alignItems: 'center', background: 'transparent', padding: 0 }}>
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="navGradV" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-400)" />
                  <stop offset="100%" stopColor="var(--primary-800)" />
                </linearGradient>
                <linearGradient id="navGradA" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary-700)" />
                  <stop offset="100%" stopColor="var(--primary-300)" />
                </linearGradient>
                <filter id="navShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="var(--primary-900)" floodOpacity="0.3" />
                </filter>
              </defs>
              <g filter="url(#navShadow)">
                <path d="M22 28 H38 L50 52 L62 28 H78 L50 84 Z" fill="url(#navGradV)" />
                <path d="M50 16 L22 72 H38 L50 48 L62 72 H78 Z" fill="url(#navGradA)" />
              </g>
            </svg>
          </span>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: "8px", lineHeight: 1.2 }}>
            <span style={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--gray-900)', fontSize: '1.25rem' }}>AutoValuate</span>
            <span style={{ fontWeight: 500, color: 'var(--primary-600)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Car Price Intelligence</span>
          </div>
        </NavLink>

        <button
          className="navbar__toggle"
          id="nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar__links${open ? " open" : ""}`}>
          {[
            { to: "/", label: "Home" },
            { to: "/dataset", label: "Dataset" },
            { to: "/visualizations", label: "Visualizations" },
            { to: "/predict", label: "Predict" },
          ].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `navbar__link${isActive ? " active" : ""}`
                }
                onClick={() => setOpen(false)}
                id={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
