import { useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import ErrorBanner from "../components/ErrorBanner";

const MAKE_OPTIONS = [
  { label: "Alfa Romeo", value: 0 },
  { label: "Audi", value: 1 },
  { label: "BMW", value: 2 },
  { label: "Chevrolet", value: 3 },
  { label: "Dodge", value: 4 },
  { label: "Honda", value: 5 },
  { label: "Isuzu", value: 6 },
  { label: "Jaguar", value: 7 },
  { label: "Mazda", value: 8 },
  { label: "Mercedes-Benz", value: 9 },
  { label: "Mercury", value: 10 },
  { label: "Mitsubishi", value: 11 },
  { label: "Nissan", value: 12 },
  { label: "Peugeot", value: 13 },
  { label: "Plymouth", value: 14 },
  { label: "Porsche", value: 15 },
  { label: "Renault", value: 16 },
  { label: "Saab", value: 17 },
  { label: "Subaru", value: 18 },
  { label: "Toyota", value: 19 },
  { label: "Volkswagen", value: 20 },
  { label: "Volvo", value: 21 },
];

const MODEL_OPTIONS = [
  { key: "linear_regression", label: "Linear Regression" },
  { key: "decision_tree", label: "Decision Tree" },
  { key: "random_forest", label: "Random Forest" },
];

const DEFAULTS = {
  engine_size: 130,
  horsepower: 100,
  width: 66,
  curb_weight: 2500,
  drive_wheels: 0,
  fuel_type: 0,
  make: 19, // Toyota
  body_style: 0, // Sedan
  num_of_cylinders: 4,
  city_mpg: 25,
  highway_mpg: 30,
};

export default function Predict() {
  const [model, setModel] = useState("linear_regression");
  const [form, setForm] = useState({ ...DEFAULTS });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePredict = async () => {
    if (form.city_mpg === "" || form.highway_mpg === "") {
      setError("Please enter both City and Highway MPG values.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.post("/predict/", { ...form, model_name: model });
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Prediction failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ ...DEFAULTS });
    setModel("linear_regression");
    setResult(null);
    setError("");
  };

  return (
    <div className="page-container" id="predict-page">
      <h1
        className="section-title"
        style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}
      >
        Price Prediction
      </h1>
      <p
        style={{
          color: "var(--gray-500)",
          marginBottom: "1.5rem",
          fontSize: "0.9rem",
        }}
      >
        Configure car specifications and select a model to predict resale value.
      </p>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {/* Model pills */}
      <div className="model-pills" id="model-selector">
        {MODEL_OPTIONS.map((m) => (
          <button
            key={m.key}
            className={`model-pill${model === m.key ? " active" : ""}`}
            onClick={() => setModel(m.key)}
            id={`pill-${m.key}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="predict-layout">
        {/* ── Form Card ── */}
        <div className="form-card" id="predict-form">
          {/* Manufacturer dropdown */}
          <div className="form-group">
            <label>Manufacturer</label>
            <select
              value={form.make}
              onChange={(e) => update("make", +e.target.value)}
              id="input-make"
            >
              {MAKE_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Body Style & Drive Wheels (Side-by-side) */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Body Style</label>
              <select
                value={form.body_style}
                onChange={(e) => update("body_style", +e.target.value)}
                id="input-body-style"
              >
                <option value={0}>Sedan</option>
                <option value={1}>Hatchback</option>
                <option value={2}>Wagon</option>
                <option value={3}>Hardtop</option>
                <option value={4}>Convertible</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Drive Wheel Type</label>
              <select
                value={form.drive_wheels}
                onChange={(e) => update("drive_wheels", +e.target.value)}
                id="input-drive-wheels"
              >
                <option value={0}>Front-Wheel Drive</option>
                <option value={1}>Rear-Wheel Drive</option>
                <option value={2}>All-Wheel Drive</option>
              </select>
            </div>
          </div>

          {/* Cylinders & Fuel Type (Side-by-side) */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Number of Cylinders</label>
              <select
                value={form.num_of_cylinders}
                onChange={(e) => update("num_of_cylinders", +e.target.value)}
                id="input-cylinders"
              >
                <option value={2}>2 Cylinders</option>
                <option value={3}>3 Cylinders</option>
                <option value={4}>4 Cylinders</option>
                <option value={5}>5 Cylinders</option>
                <option value={6}>6 Cylinders</option>
                <option value={8}>8 Cylinders</option>
                <option value={12}>12 Cylinders</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Fuel Type</label>
              <select
                value={form.fuel_type}
                onChange={(e) => update("fuel_type", +e.target.value)}
                id="input-fuel-type"
              >
                <option value={0}>Gas</option>
                <option value={1}>Diesel</option>
              </select>
            </div>
          </div>

          {/* Curb Weight number */}
          <div className="form-group">
            <label>Curb Weight</label>
            <input
              type="number"
              min={1500}
              max={4500}
              value={form.curb_weight}
              onChange={(e) => update("curb_weight", +e.target.value)}
              id="input-curb-weight"
            />
          </div>

          {/* Engine Size slider */}
          <div className="form-group">
            <label>
              Engine Size{" "}
              <span className="value-badge">{form.engine_size}</span>
            </label>
            <input
              type="range"
              min={60}
              max={330}
              value={form.engine_size}
              onChange={(e) => update("engine_size", +e.target.value)}
              id="input-engine-size"
            />
          </div>

          {/* Horsepower slider */}
          <div className="form-group">
            <label>
              Horsepower{" "}
              <span className="value-badge">{form.horsepower}</span>
            </label>
            <input
              type="range"
              min={50}
              max={300}
              value={form.horsepower}
              onChange={(e) => update("horsepower", +e.target.value)}
              id="input-horsepower"
            />
          </div>

          {/* Width slider */}
          <div className="form-group">
            <label>
              Car Width <span className="value-badge">{form.width}</span>
            </label>
            <input
              type="range"
              min={60}
              max={75}
              step={0.1}
              value={form.width}
              onChange={(e) => update("width", +e.target.value)}
              id="input-width"
            />
          </div>

          {/* MPG Inputs (Side-by-side) */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>City MPG</label>
              <input
                type="number"
                min={10}
                max={60}
                required
                value={form.city_mpg}
                onChange={(e) => update("city_mpg", e.target.value === "" ? "" : +e.target.value)}
                id="input-city-mpg"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Highway MPG</label>
              <input
                type="number"
                min={10}
                max={60}
                required
                value={form.highway_mpg}
                onChange={(e) => update("highway_mpg", e.target.value === "" ? "" : +e.target.value)}
                id="input-highway-mpg"
              />
            </div>
          </div>





          {/* Buttons */}
          <div className="form-actions">
            <button
              className="btn-predict"
              onClick={handlePredict}
              disabled={loading}
              id="btn-predict"
            >
              {loading ? (
                <>
                  <span
                    className="spinner"
                    style={{ width: 18, height: 18, borderWidth: 2 }}
                  />
                  Predicting…
                </>
              ) : (
                "Predict Price"
              )}
            </button>
            <button
              className="btn-reset"
              onClick={handleReset}
              id="btn-reset"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ── Result Card ── */}
        {result ? (
          <div className="result-card" id="result-card">
            <div className="result-card__label">Predicted Resale Price</div>
            <div className="result-card__price">
              ${Number(result.predicted_price).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="result-card__model">
              {result.model_used.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </div>
            <div className="result-card__note">
              Based on 205 records from the UCI Automobile dataset
            </div>
          </div>
        ) : (
          <div className="result-placeholder" id="result-placeholder">
            <div className="result-placeholder__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <p>Configure specs on the left and click <strong>Predict Price</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
