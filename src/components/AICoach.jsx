import { useEffect } from 'react';
import PropTypes from 'prop-types';
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
        <div className="py-10 text-center opacity-50 text-sm">
          {t('dash_coach_analyzing')}
        </div>
      ) : (
        <>
          {tips.map((tip, idx) => (
            <div className={`tip-card ${idx === 2 ? 'mb-1.5' : 'mb-3'}`} key={idx}>
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
            type="button"
            className="refresh-btn mt-2" 
            onClick={() => getAITips(emissions, city, state, ecoScore?.score)}
          >
            {t('dash_coach_refresh')}
          </button>
        </>
      )}
    </div>
  );
}

AICoach.propTypes = {
  emissions: PropTypes.shape({
    transport: PropTypes.number,
    food: PropTypes.number,
    energy: PropTypes.number,
    shopping: PropTypes.number,
    waste: PropTypes.number,
    total: PropTypes.number,
    money_saved_vs_avg: PropTypes.number,
  }),
  ecoScore: PropTypes.shape({
    score: PropTypes.number,
    grade: PropTypes.string,
    level: PropTypes.string,
    percentile: PropTypes.number,
    vs_india_avg: PropTypes.number,
  }),
  userName: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
};
