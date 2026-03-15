import { useState, useEffect } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ZAxis,
} from 'recharts';
import ChartCard from '../components/ChartCard';
import { fetchScatter, fetchStats, formatINR } from '../api/api';
import './Visualize.css';

const FEATURES = [
  { key: 'year', label: 'Year', unit: '' },
  { key: 'mileage_k', label: 'Mileage', unit: 'k km' },
  { key: 'engine_vol', label: 'Engine Volume', unit: 'L' },
  { key: 'age', label: 'Age', unit: 'years' },
];

export default function Visualize() {
  const [feature, setFeature] = useState('year');
  const [scatterData, setScatterData] = useState([]);
  const [corrData, setCorrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchScatter(feature), fetchStats()])
      .then(([scatter, stats]) => {
        // Sample scatter data if too many points (for performance)
        const points = scatter.x.map((x, i) => ({ x, y: scatter.y[i] }));
        const sampled = points.length > 500
          ? points.filter((_, i) => i % Math.ceil(points.length / 500) === 0)
          : points;
        setScatterData(sampled);
        setCorrData(stats.correlation);
        setLoading(false);
      });
  }, [feature]);

  const activeFeature = FEATURES.find((f) => f.key === feature);
  const corrCols = ['year', 'mileage_k', 'engine_vol', 'price_inr'];

  return (
    <div className="visualize">
      <div className="page-header">
        <h2 className="page-title">Visualize</h2>
        <p className="page-subtitle">Explore relationships between car attributes and prices</p>
      </div>

      <div className="feature-selector">
        {FEATURES.map((f) => (
          <button
            key={f.key}
            className={`feature-btn ${feature === f.key ? 'active' : ''}`}
            onClick={() => setFeature(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="viz-grid">
        <ChartCard
          title={`${activeFeature?.label} vs Price`}
          subtitle={`${scatterData.length} data points`}
        >
          {loading ? (
            <div className="chart-placeholder"><div className="loader"></div></div>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="x"
                  name={activeFeature?.label}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  label={{ value: activeFeature?.label, position: 'bottom', fill: '#64748b', fontSize: 13 }}
                />
                <YAxis
                  dataKey="y"
                  name="Price"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <ZAxis range={[30, 30]} />
                <Tooltip
                  formatter={(val, name) => [name === 'Price' ? formatINR(val) : val, name]}
                  contentStyle={{ background: '#fff', border: 'none', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                />
                <Scatter data={scatterData} fill="#7c3aed" fillOpacity={0.5} />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Correlation Matrix" subtitle="Pearson correlation between numeric features">
          {corrData ? (
            <div className="corr-table-wrapper">
              <table className="corr-table">
                <thead>
                  <tr>
                    <th></th>
                    {corrCols.map((c) => <th key={c}>{c.replace('_inr', '').replace('_k', '')}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {corrCols.map((row) => (
                    <tr key={row}>
                      <td className="corr-row-label">{row.replace('_inr', '').replace('_k', '')}</td>
                      {corrCols.map((col) => {
                        const val = corrData[row]?.[col] ?? 0;
                        const abs = Math.abs(val);
                        const hue = val >= 0 ? 270 : 0;
                        const bg = `hsla(${hue}, 70%, 50%, ${abs * 0.4})`;
                        return <td key={col} style={{ background: bg }} className="corr-cell">{val.toFixed(2)}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="chart-placeholder"><div className="loader"></div></div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
