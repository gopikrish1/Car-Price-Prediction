import { useState, useEffect, useMemo } from 'react';
import { fetchData, formatINR } from '../api/api';
import './DataExplorer.css';

export default function DataExplorer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('price_inr');
  const [sortAsc, setSortAsc] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [brandFilter, setBrandFilter] = useState('');

  useEffect(() => {
    fetchData().then((d) => { setData(d); setLoading(false); });
  }, []);

  const columns = [
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'body_type', label: 'Body', type: 'text' },
    { key: 'segment', label: 'Segment', type: 'badge' },
    { key: 'year', label: 'Year', type: 'num' },
    { key: 'mileage_k', label: 'Mileage (k)', type: 'num' },
    { key: 'engine_vol', label: 'Engine (L)', type: 'num' },
    { key: 'fuel_type', label: 'Fuel', type: 'text' },
    { key: 'transmission', label: 'Trans', type: 'text' },
    { key: 'owners', label: 'Owners', type: 'num' },
    { key: 'price_inr', label: 'Price (₹)', type: 'price' },
  ];

  const brands = useMemo(() => [...new Set(data.map(d => d.brand))].sort(), [data]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (brandFilter) result = result.filter(r => r.brand === brandFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortKey], bVal = b[sortKey];
      if (typeof aVal === 'string') return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
    return result;
  }, [data, search, sortKey, sortAsc, brandFilter]);

  const stats = useMemo(() => {
    if (!filtered.length) return {};
    const numCols = ['year', 'mileage_k', 'engine_vol', 'price_inr'];
    const out = {};
    numCols.forEach((col) => {
      const vals = filtered.map((d) => d[col]).filter(v => v != null);
      out[col] = {
        min: Math.min(...vals),
        max: Math.max(...vals),
        avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1),
      };
    });
    return out;
  }, [filtered]);

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  if (loading) return <div className="page-loading"><div className="loader"></div><p>Loading data...</p></div>;

  const segmentColors = { Budget: '#10b981', 'Mid-Range': '#3b82f6', Premium: '#8b5cf6', Luxury: '#f59e0b' };

  return (
    <div className="data-explorer">
      <div className="page-header">
        <h2 className="page-title">Data Explorer</h2>
        <p className="page-subtitle">{filtered.length.toLocaleString('en-IN')} of {data.length.toLocaleString('en-IN')} records</p>
      </div>

      <div className="data-toolbar">
        <div className="search-box">
          <span className="search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input type="text" placeholder="Search dataset..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
        </div>
        <select className="filter-select" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <button className={`toggle-btn ${showStats ? 'active' : ''}`} onClick={() => setShowStats(!showStats)}>
          {showStats ? 'Hide Statistics' : 'Show Statistics'}
        </button>
      </div>

      {showStats && (
        <div className="stats-panel animate-fade-in-up">
          {Object.entries(stats).map(([col, s]) => (
            <div key={col} className="stat-item">
              <span className="stat-item__label">{col.replace('_', ' ')}</span>
              <div className="stat-item__values">
                <span>Min: <strong>{col === 'price_inr' ? formatINR(s.min) : s.min}</strong></span>
                <span>Max: <strong>{col === 'price_inr' ? formatINR(s.max) : s.max}</strong></span>
                <span>Avg: <strong>{col === 'price_inr' ? formatINR(s.avg) : s.avg}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="row-num">#</th>
              {columns.map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)} className="sortable">
                  {col.label}
                  {sortKey === col.key && <span className="sort-arrow">{sortAsc ? ' ↑' : ' ↓'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 200).map((row, i) => (
              <tr key={i}>
                <td className="row-num">{i + 1}</td>
                <td className="brand-cell">{row.brand}</td>
                <td>{row.body_type}</td>
                <td><span className="segment-badge" style={{ background: segmentColors[row.segment] + '20', color: segmentColors[row.segment] }}>{row.segment}</span></td>
                <td>{row.year}</td>
                <td>{row.mileage_k?.toLocaleString('en-IN')}</td>
                <td>{row.engine_vol}L</td>
                <td>{row.fuel_type}</td>
                <td>{row.transmission}</td>
                <td>{row.owners}</td>
                <td className="price-cell">{formatINR(row.price_inr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 200 && <p className="table-note">Showing first 200 of {filtered.length.toLocaleString('en-IN')} results</p>}
        {filtered.length === 0 && <p className="no-results">No matching records found.</p>}
      </div>
    </div>
  );
}
