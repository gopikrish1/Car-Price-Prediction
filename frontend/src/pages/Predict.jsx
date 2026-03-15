import { useState, useEffect, useMemo, useRef } from 'react';
import { fetchOptions, predictPrice, formatINR } from '../api/api';
import './Predict.css';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const FUEL_META = {
  'Petrol':          { color: '#ef4444', dot: '#fca5a5', border: '#dc2626', label: 'Petrol' },
  'Diesel':          { color: '#64748b', dot: '#94a3b8', border: '#475569', label: 'Diesel' },
  'Petrol + CNG':    { color: '#10b981', dot: '#6ee7b7', border: '#059669', label: 'Petrol + CNG' },
  'Diesel + CNG':    { color: '#14b8a6', dot: '#5eead4', border: '#0d9488', label: 'Diesel + CNG' },
  'Electric (EV)':   { color: '#3b82f6', dot: '#93c5fd', border: '#2563eb', label: 'Electric (EV)' },
  'Petrol + Hybrid': { color: '#a855f7', dot: '#d8b4fe', border: '#9333ea', label: 'Petrol + Hybrid' },
};

export default function Predict() {
  const [options, setOptions] = useState(null);
  const [brand, setBrand] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showBodyOptions, setShowBodyOptions] = useState(false);
  const brandRef = useRef(null);
  const bodyTypeRef = useRef(null);
  const [bodyType, setBodyType] = useState('');
  const [segment, setSegment] = useState('Mid-Range');
  const [year, setYear] = useState(2020);
  const [month, setMonth] = useState(1);
  const [mileage, setMileage] = useState(50);
  const [engineVol, setEngineVol] = useState(1.5);
  const [seats, setSeats] = useState(5);
  const [maxPower, setMaxPower] = useState(80);
  const [fuelEfficiency, setFuelEfficiency] = useState(18);
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Manual');
  const [condition, setCondition] = useState('Good');
  const [owners, setOwners] = useState(1);
  const [regType, setRegType] = useState('Private');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchOptions().then((o) => {
      setOptions(o);
      setBrand('');
      setBrandSearch('');
      setBodyType(o.body_types?.[0] || 'SUV');
      setFetching(false);
    });
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    const res = await predictPrice({
      brand,
      body_type: bodyType,
      segment,
      year: parseInt(year),
      month: parseInt(month),
      mileage_k: parseFloat(mileage),
      engine_vol: parseFloat(engineVol),
      seats: parseInt(seats),
      max_power: parseFloat(maxPower),
      fuel_efficiency: parseFloat(fuelEfficiency),
      fuel_type: fuelType,
      transmission,
      condition,
      owners: parseInt(owners),
      reg_type: regType,
    });
    setTimeout(() => {
      setResult(res);
      setLoading(false);
    }, 500);
  };

  const filteredBrands = useMemo(() => {
    if (!options) return [];
    const q = brandSearch.toLowerCase();
    if (!q) return options.brands;
    return options.brands.filter(b => b.toLowerCase().includes(q));
  }, [brandSearch, options]);

  const selectBrand = (b) => {
    setBrand(b);
    setBrandSearch(b);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handle = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) setShowSuggestions(false);
      if (bodyTypeRef.current && !bodyTypeRef.current.contains(e.target)) setShowBodyOptions(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  if (fetching) return <div className="page-loading"><div className="loader"></div><p>Loading...</p></div>;

  const years = [];
  for (let y = options.year_range.max; y >= options.year_range.min; y--) years.push(y);

  const regLabels = { 'Private': 'Private (White)', 'Taxi': 'Taxi (Yellow)', 'Bharat': 'Bharat (BH)' };
  const condColors = { 'Excellent': '#10b981', 'Good': '#3b82f6', 'Fair': '#f59e0b', 'Poor': '#ef4444' };

  return (
    <div className="predict">
      <div className="page-header">
        <h2 className="page-title">Predict Car Price</h2>
        <p className="page-subtitle">Describe any car to estimate its Indian market value</p>
      </div>

      <div className="predict-layout">
        <div className="predict-form">
          <div className="form-card">
            <h3 className="form-card__title">Vehicle Details</h3>

            <div className="form-row">
              <div className="form-group" ref={brandRef}>
                <label className="form-label">Brand</label>
                <div className="autocomplete-wrapper">
                  <input
                    type="text" className="form-input" placeholder="e.g. Maruti Suzuki..."
                    value={brandSearch}
                    onChange={(e) => {
                      setBrandSearch(e.target.value);
                      setShowSuggestions(true);
                      if (e.target.value !== brand) setBrand('');
                    }}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  {showSuggestions && filteredBrands.length > 0 && (
                    <ul className="autocomplete-list">
                      {filteredBrands.map(b => (
                        <li key={b} className={`autocomplete-item ${b === brand ? 'selected' : ''}`} onClick={() => selectBrand(b)}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="form-group" style={{ position: 'relative' }} ref={bodyTypeRef}>
                <label className="form-label">Body Type</label>
                <div 
                  className="form-select" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onClick={() => setShowBodyOptions(!showBodyOptions)}
                >
                  {bodyType || 'Select Body Type'}
                </div>
                {showBodyOptions && (
                  <ul className="autocomplete-list" style={{ marginTop: '8px' }}>
                    {(options.body_types || []).map(b => (
                      <li 
                        key={b} 
                        className={`autocomplete-item ${bodyType === b ? 'selected' : ''}`} 
                        onClick={() => { setBodyType(b); setShowBodyOptions(false); }}
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Segment / Tier</label>
              <div className="segment-grid">
                {(options.segments || []).map(s => (
                  <button key={s} className={`segment-btn ${segment === s ? 'active' : ''}`} onClick={() => setSegment(s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="form-row" style={{marginTop: '16px'}}>
              <div className="form-group">
                <label className="form-label">Transmission</label>
                <div className="radio-group">
                  {options.transmissions.map(t => (
                    <button key={t} className={`radio-btn ${transmission === t ? 'active' : ''}`} onClick={() => setTransmission(t)}>{t}</button>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="form-card__title" style={{ marginTop: '8px' }}>Fuel Type</h3>

            <div className="fuel-grid">
              {options.fuel_types.map(f => {
                const meta = FUEL_META[f] || {};
                const isActive = fuelType === f;
                return (
                  <button
                    key={f}
                    className={`fuel-btn ${isActive ? 'active' : ''}`}
                    style={isActive ? { borderColor: meta.border, background: `${meta.color}10` } : {}}
                    onClick={() => setFuelType(f)}
                  >
                    <span className="fuel-dot" style={{ background: meta.dot, borderColor: meta.border }}></span>
                    <span className="fuel-label" style={isActive ? { color: meta.color } : {}}>{meta.label || f}</span>
                  </button>
                );
              })}
            </div>

            <h3 className="form-card__title" style={{ marginTop: '24px' }}>Specifications</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Year of Manufacture</label>
                <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Month</label>
                <select className="form-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                  {MONTH_NAMES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Mileage <span className="form-value">{parseInt(mileage).toLocaleString('en-IN')} k km</span>
                </label>
                <input type="range" className="slider" min={0} max={options.mileage_range.max} step="5" value={mileage} onChange={(e) => setMileage(e.target.value)} />
                <div className="slider-range"><span>0</span><span>{options.mileage_range.max.toLocaleString('en-IN')}</span></div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Engine Volume <span className="form-value">{parseFloat(engineVol).toFixed(1)} L</span>
                </label>
                <input type="range" className="slider" min={options.engine_vol_range.min} max={options.engine_vol_range.max} step="0.1" value={engineVol} onChange={(e) => setEngineVol(e.target.value)} />
                <div className="slider-range"><span>{options.engine_vol_range.min}L</span><span>{options.engine_vol_range.max}L</span></div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Max Power <span className="form-value">{parseInt(maxPower)} bhp</span>
                </label>
                <input type="range" className="slider" min={options.power_range.min} max={options.power_range.max} step="1" value={maxPower} onChange={(e) => setMaxPower(e.target.value)} />
                <div className="slider-range"><span>{options.power_range.min}</span><span>{options.power_range.max}</span></div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Fuel Efficiency <span className="form-value">{parseFloat(fuelEfficiency).toFixed(1)} kmpl</span>
                </label>
                <input type="range" className="slider" min={options.efficiency_range.min} max={options.efficiency_range.max} step="0.5" value={fuelEfficiency} onChange={(e) => setFuelEfficiency(e.target.value)} />
                <div className="slider-range"><span>{options.efficiency_range.min}</span><span>{options.efficiency_range.max}</span></div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Seats <span className="form-value">{seats}</span>
                </label>
                <input type="range" className="slider" min={2} max={14} step="1" value={seats} onChange={(e) => setSeats(e.target.value)} />
                <div className="slider-range"><span>2</span><span>14</span></div>
              </div>
            </div>

            <h3 className="form-card__title" style={{ marginTop: '8px' }}>Ownership & Condition</h3>

            <div className="form-group">
              <label className="form-label">Condition</label>
              <div className="condition-grid">
                {options.conditions.map(c => (
                  <button key={c} className={`condition-btn ${condition === c ? 'active' : ''}`}
                    style={condition === c ? { background: condColors[c], borderColor: condColors[c] } : {}}
                    onClick={() => setCondition(c)}>{c}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Number of Owners <span className="form-value">{owners}</span>
              </label>
              <input type="range" className="slider" min={1} max={5} step="1" value={owners} onChange={(e) => setOwners(e.target.value)} />
              <div className="slider-range"><span>1st</span><span>5th</span></div>
            </div>

            <div className="form-group">
              <label className="form-label">Registration Type</label>
              <div className="reg-grid">
                {options.reg_types.map(r => (
                  <button key={r} className={`reg-btn ${regType === r ? 'active' : ''}`} onClick={() => setRegType(r)}>
                    <span className={`reg-dot reg-dot--${r.toLowerCase()}`}></span>
                    {regLabels[r] || r}
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="predict-btn" 
              onClick={handlePredict} 
              disabled={loading || !brand}
            >
              {loading ? (
                <span className="predict-btn__loading"><div className="loader loader--small"></div> Analyzing...</span>
              ) : !brand ? 'Select Brand to Predict' : 'Predict Price'}
            </button>
          </div>
        </div>

        <div className="predict-result-panel">
          {result !== null ? (
            <div className="result-card animate-fade-in-up">
              <div className="result-card__glow"></div>
              <p className="result-card__label">Estimated Market Price</p>
              <h2 className="result-card__price">{formatINR(result.predicted_price)}</h2>
              <p className="result-card__range">
                {formatINR(result.price_range?.low)} — {formatINR(result.price_range?.high)}
              </p>

              <div className="result-card__details">
                <div className="result-detail">
                  <span className="result-detail__label">Brand</span>
                  <span className="result-detail__value">{brand}</span>
                </div>
                <div className="result-detail">
                  <span className="result-detail__label">Body Type</span>
                  <span className="result-detail__value">{bodyType}</span>
                </div>
                <div className="result-detail">
                  <span className="result-detail__label">Segment</span>
                  <span className="result-detail__value">{segment}</span>
                </div>
                <div className="result-detail">
                  <span className="result-detail__label">Manufactured</span>
                  <span className="result-detail__value">{MONTH_NAMES[month - 1]} {year}</span>
                </div>
                <div className="result-detail">
                  <span className="result-detail__label">Performance</span>
                  <span className="result-detail__value">{parseInt(maxPower)} bhp · {parseFloat(fuelEfficiency).toFixed(1)} kmpl</span>
                </div>
                <div className="result-detail">
                  <span className="result-detail__label">Fuel</span>
                  <span className="result-detail__value" style={{ color: FUEL_META[fuelType]?.color }}>{FUEL_META[fuelType]?.label || fuelType}</span>
                </div>
                <div className="result-detail">
                  <span className="result-detail__label">Transmission</span>
                  <span className="result-detail__value">{transmission}</span>
                </div>
                <div className="result-detail">
                  <span className="result-detail__label">Condition</span>
                  <span className="result-detail__value" style={{ color: condColors[condition] }}>{condition}</span>
                </div>
                <div className="result-detail">
                  <span className="result-detail__label">Registration</span>
                  <span className="result-detail__value">{regLabels[regType]}</span>
                </div>
              </div>

              <p className="result-card__note">
                CV Accuracy: {((result.cv_accuracy || 0) * 100).toFixed(1)}% · Gradient Boosting · Kaggle Data
              </p>
              <div className="result-card__badge">Indian Market Value</div>
            </div>
          ) : (
            <div className="predict-empty">
              <div className="predict-empty__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <h3>Select a vehicle to appraise</h3>
              <p>Choose a brand, body type, and specifications on the left to instantly calculate its current market value based on {options?.total_cars?.toLocaleString('en-IN') || 8128} real market transactions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
