import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, Cell, PieChart, Pie,
} from 'recharts';
import StatsCard from '../components/StatsCard';
import ChartCard from '../components/ChartCard';
import { fetchStats, fetchBrands, fetchBodyTypes, fetchSegments, formatINR } from '../api/api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [brands, setBrands] = useState(null);
  const [bodyData, setBodyData] = useState(null);
  const [segData, setSegData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStats(), fetchBrands(), fetchBodyTypes(), fetchSegments()])
      .then(([s, b, bd, sg]) => {
        setStats(s);
        setBrands(b);
        setBodyData(bd);
        setSegData(sg);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page-loading"><div className="loader"></div><p>Loading dashboard...</p></div>;
  }

  const desc = stats?.describe || {};
  const totalCars = stats?.total_records || 0;
  const avgPrice = desc.price_inr?.mean || 0;
  const maxPrice = desc.price_inr?.max || 0;
  const accuracy = stats?.cv_accuracy || 0;

  // Top 8 brands
  const brandChartData = brands
    ? Object.entries(brands.counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({
          name,
          count,
          avgPrice: brands.avg_price[name] || 0,
        }))
    : [];

  // Body type pie
  const bodyPieData = bodyData
    ? Object.entries(bodyData.counts).map(([name, count]) => ({ name, value: count }))
    : [];

  // Segment data
  const segChartData = segData
    ? Object.entries(segData.avg_price)
        .sort((a, b) => a[1] - b[1])
        .map(([name, avg]) => ({ name, avgPrice: avg, count: segData.counts[name] || 0 }))
    : [];

  const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#6d28d9', '#5b21b6', '#4c1d95', '#ddd6fe'];
  const PIE_COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-subtitle">{totalCars.toLocaleString('en-IN')} vehicles across {brands ? Object.keys(brands.counts).length : 0} brands</p>
      </div>

      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Unlock Real-Time Data Intelligence for the Indian Automotive Market.
          </h1>
          <p className="hero-description">
            AutoValuate empowers dealerships, buyers, and industry professionals with advanced machine learning 
            to determine accurate, spec-based vehicle valuations. Powered by an actively-learning model trained 
            on {totalCars.toLocaleString('en-IN')} real market transactions across {brands ? Object.keys(brands.counts).length : 0} manufacturers, 
            our intelligence engine provides granular insights from budget hatchbacks up to ultra-luxury segment pricing.
          </p>
        </div>
      </div>

      <div className="charts-grid">
        <ChartCard title="Top Brands" subtitle="Vehicles per manufacturer">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={brandChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }} width={100} />
              <Tooltip
                formatter={(val) => [val, 'Cars']}
                contentStyle={{ background: '#fff', border: 'none', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {brandChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Body Type Distribution" subtitle="Vehicle categories">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={bodyPieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                dataKey="value"
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {bodyPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average Price by Segment" subtitle="Budget to Luxury pricing" className="chart-card--full-width">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={segChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip
                formatter={(val, name) => [name === 'avgPrice' ? formatINR(val) : val, name === 'avgPrice' ? 'Avg Price' : 'Cars']}
                contentStyle={{ background: '#fff', border: 'none', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="avgPrice" radius={[6, 6, 0, 0]}>
                {segChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
