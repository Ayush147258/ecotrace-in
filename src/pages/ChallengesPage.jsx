import { useState, useEffect } from 'react';
import { useStorage } from '../hooks/useStorage';
import { useLang } from '../hooks/useLang';
import { INDIA_CHALLENGES } from '../data/challenges';

export default function ChallengesPage() {
  const { 
    getCurrentWeekKey, 
    getCompletedChallenges, 
    saveChallengeCompletion, 
    getStreak, 
    updateStreakOnLog 
  } = useStorage();
  
  const { t } = useLang();

  const [weekKey, setWeekKey] = useState('');
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastLogDate: null });

  // Initialize Data
  useEffect(() => {
    const currentWeek = getCurrentWeekKey();
    setWeekKey(currentWeek);

    // Rotation Logic: Week Number % 3
    const weekNumberMatch = currentWeek.match(/W(\d+)/);
    const weekNumber = weekNumberMatch ? parseInt(weekNumberMatch[1], 10) : 1;
    const groupIndex = weekNumber % 3;
    
    const startIndex = groupIndex * 7;
    const currentBatch = INDIA_CHALLENGES.slice(startIndex, startIndex + 7);
    setActiveChallenges(currentBatch);

    const completed = getCompletedChallenges(currentWeek);
    setCompletedIds(completed);

    const currentStreak = getStreak();
    setStreak(currentStreak);
  }, []); // Run once on mount

  const handleMarkDone = (challengeId) => {
    // Save completion
    saveChallengeCompletion(weekKey, challengeId);
    
    // Update Streak
    const newStreak = updateStreakOnLog();
    setStreak(newStreak);

    // Update local state instantly so UI re-renders
    if (!completedIds.includes(challengeId)) {
      setCompletedIds([...completedIds, challengeId]);
    }
  };

  // Streak Motivational Text
  const getStreakMotivation = (count) => {
    if (count === 0) return t('chal_m_start');
    if (count < 7) return t('chal_m_keep');
    if (count < 14) return t('chal_m_fire');
    return t('chal_m_warrior');
  };

  // Calculated Impact
  const calculateImpact = () => {
    let co2 = 0;
    let inr = 0;
    activeChallenges.forEach(c => {
      if (completedIds.includes(c.id)) {
        co2 += c.co2SavedKg;
        inr += c.moneySavedInr;
      }
    });
    return { co2: co2.toFixed(1), inr };
  };

  const impact = calculateImpact();

  return (
    <div className="shell" style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '80px' }}>
      <h1 className="display" style={{ fontSize: '32px', color: 'var(--color-banyan-deep)', marginBottom: '24px' }}>
        {t('chal_title')}
      </h1>

      {/* Streak Banner */}
      <div 
        className="streak-banner" 
        style={{ 
          background: 'linear-gradient(135deg, var(--color-marigold), #E04D1A)', 
          color: 'white', 
          borderRadius: '20px', 
          padding: '24px 30px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '32px',
          boxShadow: '0 8px 24px rgba(232,93,44,0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
            🔥
          </div>
          <div>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', fontWeight: 700, lineHeight: 1 }}>
              {streak.current} <span style={{ fontSize: '16px', fontWeight: 600, opacity: 0.9, fontFamily: 'var(--font-sans)' }}>{t('chal_days')}</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, opacity: 0.9, marginTop: '4px' }}>
              {getStreakMotivation(streak.current)}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, fontWeight: 700 }}>{t('chal_longest')}</div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>{streak.longest} {t('chal_days')}</div>
        </div>
      </div>

      {/* Weekly Progress Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)' }}>{t('chal_targets')}</h2>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-banyan)' }}>
          {completedIds.length} {t('chal_done_week')}
        </div>
      </div>

      {/* Challenge Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        {activeChallenges.map(challenge => {
          const isDone = completedIds.includes(challenge.id);
          
          return (
            <div 
              key={challenge.id} 
              className="card"
              style={{ 
                padding: '20px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '12px',
                background: isDone ? 'var(--color-paper)' : 'white',
                border: `1px solid ${isDone ? 'var(--color-banyan-pale)' : 'var(--color-line)'}`,
                transition: 'all 0.3s ease',
                opacity: isDone ? 0.85 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-banyan)' }}>
                      {challenge.category}
                    </span>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-line)' }}></span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink)', opacity: 0.5 }}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <h3 
                    style={{ 
                      fontSize: '17px', 
                      fontWeight: 700, 
                      color: 'var(--color-ink)', 
                      marginBottom: '4px',
                      textDecoration: isDone ? 'line-through' : 'none',
                      opacity: isDone ? 0.6 : 1
                    }}
                  >
                    {t(challenge.id + '_t')}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-ink)', opacity: 0.65, lineHeight: 1.5 }}>
                    {t(challenge.id + '_d')}
                  </p>
                </div>
                
                {/* Checkbox / Done Button */}
                <button 
                  onClick={() => !isDone && handleMarkDone(challenge.id)}
                  disabled={isDone}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    border: `2px solid ${isDone ? 'var(--color-banyan)' : 'var(--color-line)'}`,
                    background: isDone ? 'var(--color-banyan)' : 'white',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: isDone ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                >
                  {isDone && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              </div>

              {/* Badges Row */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <div style={{ background: 'var(--color-banyan-pale)', color: 'var(--color-banyan-deep)', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>↓</span> {challenge.co2SavedKg} kg CO₂
                </div>
                {challenge.moneySavedInr > 0 && (
                  <div style={{ background: 'var(--color-marigold-pale)', color: '#A8431B', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>↓</span> ₹{challenge.moneySavedInr}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Impact Card */}
      <div 
        className="card" 
        style={{ 
          background: 'var(--color-banyan)', 
          color: 'white', 
          textAlign: 'center', 
          padding: '32px 20px',
          borderRadius: '24px'
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 600, opacity: 0.9, marginBottom: '16px' }}>{t('chal_impact_title')}</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
          <div>
            <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', fontWeight: 700, lineHeight: 1 }}>{impact.co2}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8, marginTop: '4px' }}>{t('chal_kg_saved')}</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
          <div>
            <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', fontWeight: 700, lineHeight: 1 }}>₹{impact.inr}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8, marginTop: '4px' }}>{t('chal_inr_saved')}</div>
          </div>
        </div>
        {completedIds.length === 7 && (
          <div style={{ marginTop: '20px', fontSize: '14px', fontWeight: 700, color: 'var(--color-marigold-pale)' }}>
            {t('chal_perfect_week')}
          </div>
        )}
      </div>

    </div>
  );
}
