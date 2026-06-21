import { useEffect } from 'react';
import { useAICoach } from '../hooks/useAICoach';
import { useLang } from '../hooks/useLang';

export default function AICoach({ emissions, ecoScore, userName, city, state }) {
  const { tips, loading, provider, getAITips } = useAICoach();
  const { t } = useLang();

  useEffect(() => {
    if (emissions) {
      getAITips(emissions, city, state, ecoScore?.score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emissions, city, state, ecoScore?.score]);

  return (
    <div className="card">
      <div className="section-head">
        <h3>{t('dash_coach_title')}</h3>
        <span className="provider-tag">{loading ? t('dash_coach_thinking') : provider || 'AI'}</span>
      </div>

      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', opacity: 0.5, fontSize: 14 }}>
          {t('dash_coach_analyzing')}
        </div>
      ) : (
        <>
          {tips.map((tip, idx) => (
            <div className="tip-card" key={idx} style={{ marginBottom: idx === 2 ? 6 : 12 }}>
              <div className="tip-num">0{idx + 1}</div>
              <div>
                <div className="tip-text">{tip.text}</div>
                <div className="tip-badges">
                  {tip.co2 > 0 && <span className="tip-badge co2">−{tip.co2} kg CO₂/mo</span>}
                  {tip.money > 0 && <span className="tip-badge money">₹{tip.money} saved</span>}
                </div>
              </div>
            </div>
          ))}
          <button 
            className="refresh-btn" 
            style={{ marginTop: 8 }} 
            onClick={() => getAITips(emissions, city, state, ecoScore?.score)}
          >
            {t('dash_coach_refresh')}
          </button>
        </>
      )}
    </div>
  );
}
