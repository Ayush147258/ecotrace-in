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
    <div className="shell max-w-[720px] mx-auto pb-20">
      <h1 className="display text-[32px] text-[var(--color-banyan-deep)] mb-6">
        {t('chal_title')}
      </h1>

      {/* Streak Banner */}
      <div 
        className="streak-banner bg-gradient-to-br from-[var(--color-marigold)] to-[#E04D1A] text-white rounded-[20px] px-[30px] py-[24px] flex items-center justify-between mb-8 shadow-[0_8px_24px_rgba(232,93,44,0.25)]" 
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center text-[28px]">
            🔥
          </div>
          <div>
            <div className="text-[32px] font-[family-name:var(--font-serif)] font-bold leading-none">
              {streak.current} <span className="text-base font-semibold opacity-90 font-[family-name:var(--font-sans)]">{t('chal_days')}</span>
            </div>
            <div className="text-sm font-semibold opacity-90 mt-1">
              {getStreakMotivation(streak.current)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-[0.05em] opacity-80 font-bold">{t('chal_longest')}</div>
          <div className="text-xl font-bold">{streak.longest} {t('chal_days')}</div>
        </div>
      </div>

      {/* Weekly Progress Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[var(--color-ink)]">{t('chal_targets')}</h2>
        <div className="text-sm font-bold text-[var(--color-banyan)]">
          {completedIds.length} {t('chal_done_week')}
        </div>
      </div>

      {/* Challenge Cards List */}
      <div className="flex flex-col gap-4 mb-10">
        {activeChallenges.map(challenge => {
          const isDone = completedIds.includes(challenge.id);
          
          return (
            <div 
              key={challenge.id} 
              className={`card p-5 flex flex-col gap-3 transition-all duration-300 ease-in-out border ${isDone ? 'bg-[var(--color-paper)] border-[var(--color-banyan-pale)] opacity-[0.85]' : 'bg-white border-[var(--color-line)]'}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[var(--color-banyan)]">
                      {challenge.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-line)]"></span>
                    <span className="text-[11px] font-bold text-[var(--color-ink)] opacity-50">
                      {challenge.difficulty}
                    </span>
                  </div>
                  <h3 
                    className={`text-[17px] font-bold text-[var(--color-ink)] mb-1 ${isDone ? 'line-through opacity-60' : 'no-underline opacity-100'}`}
                  >
                    {t(challenge.id + '_t')}
                  </h3>
                  <p className="text-sm text-[var(--color-ink)] opacity-65 leading-relaxed">
                    {t(challenge.id + '_d')}
                  </p>
                </div>
                
                {/* Checkbox / Done Button */}
                <button 
                  onClick={() => !isDone && handleMarkDone(challenge.id)}
                  disabled={isDone}
                  aria-label={t(challenge.id + '_t')}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 text-white hover:opacity-80 focus:ring-2 focus:ring-[var(--color-banyan)] focus:outline-none ${isDone ? 'border-[var(--color-banyan)] bg-[var(--color-banyan)] cursor-default' : 'border-[var(--color-line)] bg-white cursor-pointer'}`}
                >
                  {isDone && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              </div>

              {/* Badges Row */}
              <div className="flex gap-2 mt-1">
                <div className="bg-[var(--color-banyan-pale)] text-[var(--color-banyan-deep)] text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <span>↓</span> {challenge.co2SavedKg} kg CO₂
                </div>
                {challenge.moneySavedInr > 0 && (
                  <div className="bg-[var(--color-marigold-pale)] text-[#A8431B] text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
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
        className="card bg-[var(--color-banyan)] text-white text-center py-8 px-5 rounded-3xl" 
      >
        <h3 className="text-base font-semibold opacity-90 mb-4">{t('chal_impact_title')}</h3>
        <div className="flex justify-center gap-8">
          <div>
            <div className="text-[36px] font-[family-name:var(--font-serif)] font-bold leading-none">{impact.co2}</div>
            <div className="text-[13px] font-semibold opacity-80 mt-1">{t('chal_kg_saved')}</div>
          </div>
          <div className="w-[1px] bg-white/20"></div>
          <div>
            <div className="text-[36px] font-[family-name:var(--font-serif)] font-bold leading-none">₹{impact.inr}</div>
            <div className="text-[13px] font-semibold opacity-80 mt-1">{t('chal_inr_saved')}</div>
          </div>
        </div>
        {completedIds.length === 7 && (
          <div className="mt-5 text-sm font-bold text-[var(--color-marigold-pale)]">
            {t('chal_perfect_week')}
          </div>
        )}
      </div>

    </div>
  );
}
