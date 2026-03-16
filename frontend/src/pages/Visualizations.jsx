import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import ErrorBanner from "../components/ErrorBanner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, CartesianGrid, Cell,
} from "recharts";

const COLORS = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#818cf8",
  "#6d28d9", "#4f46e5", "#7c3aed", "#4338ca",
  "#5b21b6", "#312e81", "#c4b5fd", "#3730a3",
];

export default function Visualizations() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [avgPrice, setAvgPrice] = useState([]);
  const [engine, setEngine] = useState([]);
  const [hp, setHp] = useState([]);
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/visualize/avg-price-by-make"),
      api.get("/visualize/engine-vs-price"),
      api.get("/visualize/horsepower-vs-price"),
      api.get("/visualize/model-metrics"),
    ])
      .then(([avgRes, engRes, hpRes, metRes]) => {
        setAvgPrice(avgRes.data);
        setEngine(engRes.data);
        setHp(hpRes.data);

        // Transform metrics object → array for horizontal bar chart
        const metObj = metRes.data;
        const metArr = Object.entries(metObj).map(([name, vals]) => ({
          name: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          r2: vals.r2,
        }));
        setMetrics(metArr);
      })
      .catch((err) =>
        setError(err.response?.data?.detail || err.message || "Failed to load chart data")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container" id="visualizations-page">
      <h1 className="section-title" style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>
        Data Visualizations
      </h1>
      <p style={{ color: "var(--gray-500)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Interactive charts exploring the automobile dataset and model performance.
      </p>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {loading ? (
        <Spinner />
      ) : (
        <div className="viz-grid">
          {/* 1. Average Price by Manufacturer */}
          <div className="chart-card" id="chart-avg-price">
            <div className="chart-card__title">
              <span className="chart-card__title-dot" /> Average Price by Manufacturer
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={avgPrice} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="make"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  label={{ value: "Manufacturer", position: "bottom", offset: 45, fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  label={{ value: "Avg Price ($)", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v) => [`$${Number(v).toLocaleString()}`, "Avg Price"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="avg_price" radius={[4, 4, 0, 0]}>
                  {avgPrice.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 2. Engine Size vs Price */}
          <div className="chart-card" id="chart-engine">
            <div className="chart-card__title">
              <span className="chart-card__title-dot" style={{ background: "#10b981" }} />
              Engine Size vs Price
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="engine_size"
                  name="Engine Size"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Engine Size", position: "bottom", offset: 5, fontSize: 12 }}
                />
                <YAxis
                  dataKey="price"
                  name="Price"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Price ($)", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v, name) => [
                    name === "Price" ? `$${Number(v).toLocaleString()}` : v,
                    name,
                  ]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                />
                <Scatter data={engine} fill="#10b981" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* 3. Horsepower vs Price */}
          <div className="chart-card" id="chart-horsepower">
            <div className="chart-card__title">
              <span className="chart-card__title-dot" style={{ background: "#f59e0b" }} />
              Horsepower vs Price
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="horsepower"
                  name="Horsepower"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Horsepower", position: "bottom", offset: 5, fontSize: 12 }}
                />
                <YAxis
                  dataKey="price"
                  name="Price"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Price ($)", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v, name) => [
                    name === "Price" ? `$${Number(v).toLocaleString()}` : v,
                    name,
                  ]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                />
                <Scatter data={hp} fill="#f59e0b" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* 4. Model R² Comparison (Horizontal Bar) */}
          <div className="chart-card" id="chart-metrics">
            <div className="chart-card__title">
              <span className="chart-card__title-dot" style={{ background: "#ef4444" }} />
              Model R² Score Comparison
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 1]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "R² Score", position: "bottom", offset: 0, fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={130}
                />
                <Tooltip
                  formatter={(v) => [v.toFixed(4), "R²"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="r2" radius={[0, 6, 6, 0]}>
                  {metrics.map((_, i) => (
                    <Cell key={i} fill={["#3b82f6", "#10b981", "#8b5cf6"][i] || "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
