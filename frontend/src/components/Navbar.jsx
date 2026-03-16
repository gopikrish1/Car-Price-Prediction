import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__brand-icon" style={{ display: 'flex', alignItems: 'center', background: 'transparent', padding: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
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
