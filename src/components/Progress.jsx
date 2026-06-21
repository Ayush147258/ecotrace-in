export default function Progress() {
  return (
    <div className="card progress-card">
      <div className="section-head">
        <h3>Your progress vs India average</h3>
        <span className="provider-tag" style={{ background: 'var(--color-marigold-pale)', color: '#A8431B' }}>↓ 42 pts this month</span>
      </div>
      <div className="chart-wrap">
        <svg className="chart-svg" viewBox="0 0 1140 200" preserveAspectRatio="none">
          <line x1="0" y1="40" x2="1140" y2="40" stroke="#0F4C3A" strokeOpacity="0.08"/>
          <line x1="0" y1="100" x2="1140" y2="100" stroke="#0F4C3A" strokeOpacity="0.08"/>
          <line x1="0" y1="160" x2="1140" y2="160" stroke="#0F4C3A" strokeOpacity="0.08"/>

          <polyline points="20,90 210,88 400,92 590,90 780,89 970,91 1120,90"
            fill="none" stroke="#8A8166" strokeWidth="2" strokeDasharray="6 6"/>

          <path d="M20,150 L210,140 L400,128 L590,118 L780,100 L970,82 L1120,68 L1120,200 L20,200 Z"
            fill="#0F4C3A" opacity="0.08"/>
          <polyline points="20,150 210,140 400,128 590,118 780,100 970,82 1120,68"
            fill="none" stroke="#0F4C3A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

          <circle cx="1120" cy="68" r="5" fill="#E85D2C"/>
          <circle cx="20" cy="150" r="4" fill="#0F4C3A"/>
          <circle cx="210" cy="140" r="4" fill="#0F4C3A"/>
          <circle cx="400" cy="128" r="4" fill="#0F4C3A"/>
          <circle cx="590" cy="118" r="4" fill="#0F4C3A"/>
          <circle cx="780" cy="100" r="4" fill="#0F4C3A"/>
          <circle cx="970" cy="82" r="4" fill="#0F4C3A"/>
        </svg>
      </div>
      <div className="chart-legend">
        <div className="legend-item"><span className="legend-dot" style={{ background: '#0F4C3A' }}></span>Your emissions</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: '#8A8166' }}></span>India average (216 kg/mo)</div>
        <div className="legend-item" style={{ marginLeft: 'auto', color: '#0F4C3A', fontWeight: 700 }}>Jan → Jun 2026</div>
      </div>
    </div>
  );
}
