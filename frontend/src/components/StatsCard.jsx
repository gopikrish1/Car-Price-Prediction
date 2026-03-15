import './StatsCard.css';

export default function StatsCard({ icon, label, value, trend, color = 'purple', delay = 0 }) {
  return (
    <div
      className={`stats-card stats-card--${color} animate-fade-in-up`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="stats-card__header">
        <span className="stats-card__icon">{icon}</span>
        <span className="stats-card__label">{label}</span>
      </div>
      <div className="stats-card__value">{value}</div>
      {trend && <div className="stats-card__trend">{trend}</div>}
    </div>
  );
}
