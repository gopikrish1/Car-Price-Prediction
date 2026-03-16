import { useNavigate } from "react-router-dom";

/* Inline SVG icons — clean, professional, no emojis */
const FeatureIcon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const FEATURES = [
  { icon: "M12 8V4l8 8-8 8v-4H4V8h8z", label: "Engine Size" },
  { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", label: "Horsepower" },
  { icon: "M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4", label: "Car Width" },
  { icon: "M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5", label: "Curb Weight" },
  { icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v8M8 12h8", label: "Drive Wheel Type" },
  { icon: "M3 22V8l9-6 9 6v14H3zM9 22V12h6v10", label: "Fuel Type" },
  { icon: "M3 21h18M9 8h6M9 12h6M9 16h6M5 4h14a2 2 0 012 2v14H3V6a2 2 0 012-2z", label: "Manufacturer" },
  { icon: "M5 17h14M7 9h10l2 4H5l2-4zM6 13v4M18 13v4", label: "Body Style" },
  { icon: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94L6.73 20.2a2 2 0 01-2.83-2.83l6.83-6.73A6 6 0 016.3 2.93l3.77 3.77", label: "Cylinders" },
  { icon: "M3 21V7l9-4 9 4v14M3 7l9 4M12 11l9-4M12 11v10", label: "City MPG" },
  { icon: "M4 12h16M12 4v16M7 7l10 10M17 7l-10 10", label: "Highway MPG" },
];

const MODELS = [
  {
    name: "Linear Regression",
    badge: "lr",
    desc: "A simple, interpretable model that fits a straight-line relationship between features and price.",
  },
  {
    name: "Decision Tree",
    badge: "dt",
    desc: "Captures non-linear patterns by splitting data into branches based on feature thresholds.",
  },
  {
    name: "Random Forest",
    badge: "rf",
    desc: "An ensemble of 100 decision trees that averages predictions for higher accuracy and stability.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container" id="home-page">
      {/* Hero */}
      <section className="home-hero">
        <h1>AutoValuate</h1>
        <p>
          Predict used-car prices with machine learning — powered by three
          models trained on the UCI Automobile dataset.
        </p>
      </section>

      {/* Stat bar */}
      <div className="stat-bar" id="stat-bar">
        <div className="stat-card">
          <div className="stat-card__number">205</div>
          <div className="stat-card__label">Cars in Dataset</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__number">3</div>
          <div className="stat-card__label">ML Models</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__number">11</div>
          <div className="stat-card__label">Features</div>
        </div>
      </div>

      {/* Features */}
      <h2 className="section-title">Features Used</h2>
      <div className="feature-grid" id="feature-list">
        {FEATURES.map((f) => (
          <div className="feature-chip" key={f.label}>
            <span className="feature-chip__icon">
              <FeatureIcon d={f.icon} />
            </span>
            {f.label}
          </div>
        ))}
      </div>

      {/* Model cards */}
      <h2 className="section-title">Available Models</h2>
      <div className="model-cards" id="model-cards">
        {MODELS.map((m) => (
          <div className="model-card" key={m.name}>
            <span className={`model-card__badge model-card__badge--${m.badge}`}>
              {m.badge === "lr" ? "Linear" : m.badge === "dt" ? "Tree" : "Ensemble"}
            </span>
            <h3>{m.name}</h3>
            <p>{m.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center" }}>
        <button
          className="btn-primary"
          id="cta-predict"
          onClick={() => navigate("/predict")}
        >
          Start Predicting
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
