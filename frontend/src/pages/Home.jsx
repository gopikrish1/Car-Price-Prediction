import { useNavigate } from "react-router-dom";

const FEATURES = [
  "Engine Size",
  "Horsepower",
  "Car Width",
  "Curb Weight",
  "Drive Wheel Type",
  "Fuel Type",
  "Manufacturer",
  "Body Style",
  "Cylinders",
  "City MPG",
  "Highway MPG",
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
    desc: "An ensemble of decision trees that averages its own internal predictions for higher accuracy.",
  },
  {
    name: "Ensemble Average",
    badge: "ea",
    desc: "A meta-ensemble combining Linear Regression, Decision Tree, and Random Forest for a highly balanced final prediction.",
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
          <div className="stat-card__number">{MODELS.length}</div>
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
          <div className="feature-chip" key={f}>
            {f}
          </div>
        ))}
      </div>

      {/* Model cards */}
      <h2 className="section-title">Available Models</h2>
      <div className="model-cards" id="model-cards">
        {MODELS.map((m) => (
          <div className="model-card" key={m.name}>
            <span className={`model-card__badge model-card__badge--${m.badge}`}>
              {m.badge === "lr" ? "Linear" : m.badge === "dt" ? "Tree" : m.badge === "ea" ? "Ultimate Ensemble" : "Ensemble"}
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
