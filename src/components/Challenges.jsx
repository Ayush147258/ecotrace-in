import { useState, useEffect } from 'react';
import { useStorage } from '../hooks/useStorage';
import { useLang } from '../hooks/useLang';
import { INDIA_CHALLENGES } from '../data/challenges';
import { Link } from 'react-router-dom';

export default function Challenges() {
  const { getCurrentWeekKey, getCompletedChallenges, saveChallengeCompletion, getStreak, updateStreakOnLog } = useStorage();
  const { t } = useLang();

  const [weekKey, setWeekKey] = useState('');
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastLogDate: null });

  useEffect(() => {
    const currentWeek = getCurrentWeekKey();
    setWeekKey(currentWeek);

    // Grab the first 3 challenges of the week batch (Dashboard preview)
    const weekNumberMatch = currentWeek.match(/W(\d+)/);
    const weekNumber = weekNumberMatch ? parseInt(weekNumberMatch[1], 10) : 1;
    const groupIndex = weekNumber % 3;
    const startIndex = groupIndex * 7;
    
    // Only show 3 on dashboard to save space
    setActiveChallenges(INDIA_CHALLENGES.slice(startIndex, startIndex + 3));
    setCompletedIds(getCompletedChallenges(currentWeek));
    setStreak(getStreak());
  }, []);

  const toggleChallenge = (id) => {
    if (!completedIds.includes(id)) {
      saveChallengeCompletion(weekKey, id);
      setCompletedIds([...completedIds, id]);
      setStreak(updateStreakOnLog()); // Also bumps streak
    }
  };

  return (
    <div className="card">
      <div className="section-head">
        <h3>{t('nav_challenges')}</h3>
        <span className="week-progress">{completedIds.length} / 7 {t('chal_done')}</span>
      </div>

      <div className="streak-banner">
        <div className="streak-left">
          <div className="streak-num">🔥 {streak.current}</div>
          <div className="streak-label">{t('chal_day_streak')}</div>
        </div>
        <div className="streak-sub">{t('chal_longest')}: {streak.longest}<br/>{t('chal_keep')}</div>
      </div>

      {activeChallenges.map(c => {
        const isDone = completedIds.includes(c.id);
        return (
          <button type="button" className="chal-row w-full text-left bg-transparent border-none p-0 cursor-pointer" key={c.id} onClick={() => toggleChallenge(c.id)}>
            <div className={`chal-check ${isDone ? 'done' : ''}`}>{isDone ? '✓' : ''}</div>
            <div className="chal-text">
              <div className={`chal-title ${isDone ? 'done' : ''}`}>{c.title}</div>
              <div className="chal-impact">
                {isDone ? t('chal_saved') : t('chal_saves')} {c.co2SavedKg} kg CO₂ · ₹{c.moneySavedInr}
              </div>
            </div>
          </button>
        );
      })}
      
      <Link to="/challenges" className="block text-center mt-4 text-[var(--color-banyan)] font-semibold no-underline text-sm">
        View all challenges →
      </Link>
    </div>
  );
}
