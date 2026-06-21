import { formatCO2, formatMoney, formatPercent } from '../utils/formatters';
import { INDIA_BENCHMARKS } from '../utils/emissionFactors';
import { useLang } from '../hooks/useLang';

export default function Dashboard({ emissions, ecoScore, userName, city, state }) {
  const { t } = useLang();
  if (!emissions || !ecoScore) return null;

  // For the rangoli circle stroke calculation
  const circleCircumference = 2 * Math.PI * 100; // r=100
  // Score mapping to dashoffset: 1000 = 0 offset, 0 = 628 offset
  const scoreRatio = Math.max(0, Math.min(1000, ecoScore.score)) / 1000;
  const strokeDashoffset = circleCircumference * (1 - scoreRatio);
  
  // Dynamic ring color
  let ringColor = "#E85D2C"; // red
  if (ecoScore.score >= 700) ringColor = "#0F4C3A"; // green
  else if (ecoScore.score >= 400) ringColor = "#C99A3B"; // yellow

  // Max width for bars is the maximum category emission or 100
  const maxCategory = Math.max(
    emissions.transport, emissions.food, emissions.energy, emissions.shopping, emissions.waste, 50
  );

  const getWidth = (val) => `${Math.min(100, Math.max(5, (val / maxCategory) * 100))}%`;

  // Sort categories to find biggest impacts
  const cats = [
    { id: 'transport', label: t('dash_transport'), val: emissions.transport, icon: '🛵', bg: 'var(--color-banyan-pale)', fill: 'var(--color-banyan)', hint: t('dash_t_hint') },
    { id: 'food', label: t('dash_food'), val: emissions.food, icon: '🍛', bg: 'var(--color-marigold-pale)', fill: 'var(--color-marigold)', hint: t('dash_f_hint') },
    { id: 'energy', label: t('dash_energy'), val: emissions.energy, icon: '🔥', bg: '#F3EBD6', fill: 'var(--color-gold)', hint: t('dash_e_hint') },
    { id: 'shopping', label: t('dash_shopping'), val: emissions.shopping, icon: '🛍️', bg: 'var(--color-paper-2)', fill: '#8A8166', hint: t('dash_s_hint') },
    { id: 'waste', label: t('dash_waste'), val: emissions.waste, icon: '🗑️', bg: '#EFE3D0', fill: '#B0A887', hint: t('dash_w_hint') }
  ].sort((a, b) => b.val - a.val);

  return (
    <>
      <div className="greet-row">
        <div className="greet">
          <h1>{t('dash_namaste')}, {userName || t('dash_friend')} 👋</h1>
          <div className="sub">{city || 'India'}, {state || ''} — {t('dash_here_is_footprint')}</div>
        </div>
      </div>

      <div className="hero-grid">
        <div className="card score-card">
          <div className="score-eyebrow">{t('dash_your_ecoscore')}</div>
          <div className="rangoli">
            <svg viewBox="0 0 230 230">
              <circle cx="115" cy="115" r="100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14"/>
              <circle cx="115" cy="115" r="100" fill="none" stroke={ringColor} strokeWidth="14"
                      strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                      transform="rotate(-90 115 115)" style={{transition: 'stroke-dashoffset 1s ease-out'}}/>
              <circle cx="115" cy="115" r="78" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
              <g opacity="0.5">
                <circle cx="115" cy="15" r="2.5" fill="#C99A3B"/>
                <circle cx="115" cy="215" r="2.5" fill="#C99A3B"/>
                <circle cx="15" cy="115" r="2.5" fill="#C99A3B"/>
                <circle cx="215" cy="115" r="2.5" fill="#C99A3B"/>
                <circle cx="44" cy="44" r="2" fill="#C99A3B"/>
                <circle cx="186" cy="44" r="2" fill="#C99A3B"/>
                <circle cx="44" cy="186" r="2" fill="#C99A3B"/>
                <circle cx="186" cy="186" r="2" fill="#C99A3B"/>
              </g>
            </svg>
            <div className="rangoli-center">
              <div className="rangoli-score">{ecoScore.score}</div>
              <div className="rangoli-max">{t('dash_out_of')}</div>
            </div>
          </div>
          <div className="grade-row">
            <span className="grade-badge">{t('dash_grade')} {ecoScore.grade}</span>
            <span className="level-name">{ecoScore.level}</span>
          </div>
          <div className="percentile">{t('dash_better_than')} <b>{ecoScore.percentile}%</b> {t('dash_of_trackers_in')} {state || 'India'} {t('dash_this_month')}</div>
        </div>

        <div className="card breakdown-card">
          <h3>{t('dash_where_footprint_from')}</h3>
          <div className="hint">{Math.round(emissions.total)} {t('dash_kg_this_month')} · 5 {t('dash_categories')}</div>
          
          {cats.map((c, i) => (
            <div className="bd-row" key={c.id} style={{ marginBottom: i === 4 ? 0 : 16 }}>
              <div className="bd-icon" style={{ background: c.bg }}>{c.icon}</div>
              <div className="bd-meta">
                <div className="bd-top"><span>{c.label}</span><span className="val">{Math.round(c.val)} kg</span></div>
                <div className="bd-track"><div className="bd-fill" style={{ width: getWidth(c.val), background: c.fill }}></div></div>
                <div className="bd-compare">{c.hint}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric">
          <div className="m-label">{t('dash_tot_this_month')}</div>
          <div className="m-value">{formatCO2(emissions.total)}</div>
          <div className={`m-delta ${ecoScore.vs_india_avg <= 0 ? 'good' : 'bad'}`}>
            {ecoScore.vs_india_avg <= 0 ? '↓' : '↑'} {Math.abs(ecoScore.vs_india_avg)}% {t('dash_vs_india_avg')}
          </div>
        </div>
        <div className="metric">
          <div className="m-label">{t('dash_vs_avg')}</div>
          <div className="m-value">{(emissions.total - INDIA_BENCHMARKS.national_avg_monthly) > 0 ? '+' : ''}{Math.round(emissions.total - INDIA_BENCHMARKS.national_avg_monthly)} kg</div>
          <div className={`m-delta ${emissions.total <= INDIA_BENCHMARKS.national_avg_monthly ? 'good' : 'bad'}`}>
            {emissions.total <= INDIA_BENCHMARKS.national_avg_monthly ? t('dash_below') : t('dash_above')} {INDIA_BENCHMARKS.national_avg_monthly} kg {t('dash_avg')}
          </div>
        </div>
        <div className="metric">
          <div className="m-label">{t('dash_money_saved')}</div>
          <div className="m-value">{formatMoney(emissions.money_saved_vs_avg)}</div>
          <div className="m-delta good">{t('dash_vs_avg_hh')}</div>
        </div>
        <div className="metric">
          <div className="m-label">{t('dash_trees_equiv')}</div>
          <div className="m-value">{Math.round(emissions.total / 21)} {t('dash_trees')}</div>
          <div className="m-delta good">{t('dash_worth_co2')}</div>
        </div>
      </div>
    </>
  );
}
