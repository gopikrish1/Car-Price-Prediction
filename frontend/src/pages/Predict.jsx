import { useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import ErrorBanner from "../components/ErrorBanner";
import CustomSelect from "../components/CustomSelect";

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
  { key: "ensemble", label: "Ultimate Ensemble" },
];

const BODY_STYLE_OPTIONS = [
  { label: "Sedan", value: 0 },
  { label: "Hatchback", value: 1 },
  { label: "Wagon", value: 2 },
  { label: "Hardtop", value: 3 },
  { label: "Convertible", value: 4 },
];

const DRIVE_WHEEL_OPTIONS = [
  { label: "Front-Wheel Drive", value: 0 },
  { label: "Rear-Wheel Drive", value: 1 },
  { label: "All-Wheel Drive", value: 2 },
];

const CYLINDER_OPTIONS = [
  { label: "2 Cylinders", value: 2 },
  { label: "3 Cylinders", value: 3 },
  { label: "4 Cylinders", value: 4 },
  { label: "5 Cylinders", value: 5 },
  { label: "6 Cylinders", value: 6 },
  { label: "8 Cylinders", value: 8 },
  { label: "12 Cylinders", value: 12 },
];

const FUEL_TYPE_OPTIONS = [
  { label: "Gas", value: 0 },
  { label: "Diesel", value: 1 },
];

const DEFAULTS = {
  engine_size: 130,
  horsepower: 100,
  width: 66,
  curb_weight: 2500,
  drive_wheels: "",
  fuel_type: "",
  make: "",
  body_style: "",
  num_of_cylinders: "",
  city_mpg: 25,
  highway_mpg: 30,
};

export default function Predict() {
  const [model, setModel] = useState("linear_regression");
  const [form, setForm] = useState({ ...DEFAULTS });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePredict = async () => {
    const errors = {};
    if (form.make === "") errors.make = "Please select a manufacturer.";
    if (form.body_style === "") errors.body_style = "Please select a body style.";
    if (form.drive_wheels === "") errors.drive_wheels = "Please select a drive wheel type.";
    if (form.num_of_cylinders === "") errors.num_of_cylinders = "Please select the number of cylinders.";
    if (form.fuel_type === "") errors.fuel_type = "Please select a fuel type.";
    
    if (form.curb_weight === "" || form.curb_weight < 1500 || form.curb_weight > 4500) {
      errors.curb_weight = "Must be between 1500 and 4500.";
    }
    if (form.city_mpg === "" || form.city_mpg < 10 || form.city_mpg > 60) {
      errors.city_mpg = "Must be between 10 and 60.";
    }
    if (form.highway_mpg === "" || form.highway_mpg < 10 || form.highway_mpg > 60) {
      errors.highway_mpg = "Must be between 10 and 60.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.post("/predict/", { ...form, model_name: model });
      setResult(res.data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      let errorMsg = err.message || "Prediction failed";
      if (Array.isArray(detail)) {
        errorMsg = detail.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(". ");
      } else if (typeof detail === "string") {
        errorMsg = detail;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ ...DEFAULTS });
    setModel("linear_regression");
    setResult(null);
    setError("");
    setFieldErrors({});
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
        <form className="form-card" id="predict-form" noValidate onSubmit={(e) => { e.preventDefault(); handlePredict(); }}>
          {/* Manufacturer dropdown */}
          <div className="form-group">
            <label>Manufacturer</label>
            <CustomSelect
              id="input-make"
              value={form.make}
              onChange={(val) => update("make", val)}
              options={MAKE_OPTIONS}
              placeholder="Select Manufacturer..."
              error={!!fieldErrors.make}
            />
            {fieldErrors.make && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{fieldErrors.make}</span>}
          </div>

          {/* Body Style & Drive Wheels (Side-by-side) */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Body Style</label>
              <CustomSelect
                id="input-body-style"
                value={form.body_style}
                onChange={(val) => update("body_style", val)}
                options={BODY_STYLE_OPTIONS}
                placeholder="Select Body Style..."
                error={!!fieldErrors.body_style}
              />
              {fieldErrors.body_style && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{fieldErrors.body_style}</span>}
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Drive Wheel Type</label>
              <CustomSelect
                id="input-drive-wheels"
                value={form.drive_wheels}
                onChange={(val) => update("drive_wheels", val)}
                options={DRIVE_WHEEL_OPTIONS}
                placeholder="Select Wheels..."
                error={!!fieldErrors.drive_wheels}
              />
              {fieldErrors.drive_wheels && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{fieldErrors.drive_wheels}</span>}
            </div>
          </div>

          {/* Cylinders & Fuel Type (Side-by-side) */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Number of Cylinders</label>
              <CustomSelect
                id="input-cylinders"
                value={form.num_of_cylinders}
                onChange={(val) => update("num_of_cylinders", val)}
                options={CYLINDER_OPTIONS}
                placeholder="Select Cylinders..."
                error={!!fieldErrors.num_of_cylinders}
              />
              {fieldErrors.num_of_cylinders && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{fieldErrors.num_of_cylinders}</span>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Fuel Type</label>
              <CustomSelect
                id="input-fuel-type"
                value={form.fuel_type}
                onChange={(val) => update("fuel_type", val)}
                options={FUEL_TYPE_OPTIONS}
                placeholder="Select Fuel Type..."
                error={!!fieldErrors.fuel_type}
              />
              {fieldErrors.fuel_type && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{fieldErrors.fuel_type}</span>}
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
              onChange={(e) => update("curb_weight", e.target.value === "" ? "" : +e.target.value)}
              id="input-curb-weight"
              style={fieldErrors.curb_weight ? { borderColor: 'var(--danger)' } : {}}
            />
            {fieldErrors.curb_weight && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{fieldErrors.curb_weight}</span>}
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
                value={form.city_mpg}
                onChange={(e) => update("city_mpg", e.target.value === "" ? "" : +e.target.value)}
                id="input-city-mpg"
                style={fieldErrors.city_mpg ? { borderColor: 'var(--danger)' } : {}}
              />
              {fieldErrors.city_mpg && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{fieldErrors.city_mpg}</span>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Highway MPG</label>
              <input
                type="number"
                min={10}
                max={60}
                value={form.highway_mpg}
                onChange={(e) => update("highway_mpg", e.target.value === "" ? "" : +e.target.value)}
                id="input-highway-mpg"
                style={fieldErrors.highway_mpg ? { borderColor: 'var(--danger)' } : {}}
              />
              {fieldErrors.highway_mpg && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{fieldErrors.highway_mpg}</span>}
            </div>
          </div>





          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-predict"
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
              type="button"
              className="btn-reset"
              onClick={handleReset}
              id="btn-reset"
            >
              Reset
            </button>
          </div>
        </form>

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
              {result.model_used === "ensemble" 
                ? "Ultimate Ensemble" 
                : result.model_used.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
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
