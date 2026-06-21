import { useState, useEffect } from 'react';
import { useStorage } from '../hooks/useStorage';

const WEEKLY_CHALLENGES = [
  { id: 1, title: 'Skip the auto today — walk or cycle', co2: 1.2, money: 80 },
  { id: 2, title: 'Cook one extra meal at home', co2: 0.8, money: 150 },
  { id: 3, title: 'Turn off AC 2 hrs earlier tonight', co2: 1.6, money: 40 },
  { id: 4, title: 'Skip one online order this week', co2: 3.5, money: 200 }
];

export default function Challenges() {
  const { getChallenges, saveChallenges, getStreak, saveStreak } = useStorage();
  const [completed, setCompleted] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0, last_log_date: null });

  useEffect(() => {
    setCompleted(getChallenges());
    setStreak(getStreak());
  }, []);

  const toggleChallenge = (id) => {
    let newCompleted;
    if (completed.includes(id)) {
      newCompleted = completed.filter(c => c !== id);
    } else {
      newCompleted = [...completed, id];
    }
    setCompleted(newCompleted);
    saveChallenges(newCompleted);
  };

  return (
    <div className="card">
      <div className="section-head">
        <h3>This week's challenges</h3>
        <span className="week-progress">{completed.length} / 4 done</span>
      </div>

      <div className="streak-banner">
        <div className="streak-left">
          <div className="streak-num">🔥 {streak.current}</div>
          <div className="streak-label">day streak</div>
        </div>
        <div className="streak-sub">Longest: {streak.longest} days<br/>Keep logging daily</div>
      </div>

      {WEEKLY_CHALLENGES.map(c => {
        const isDone = completed.includes(c.id);
        return (
          <div className="chal-row" key={c.id} onClick={() => toggleChallenge(c.id)}>
            <div className={`chal-check ${isDone ? 'done' : ''}`}>{isDone ? '✓' : ''}</div>
            <div className="chal-text">
              <div className={`chal-title ${isDone ? 'done' : ''}`}>{c.title}</div>
              <div className="chal-impact">
                {isDone ? 'Saved' : 'Saves'} {c.co2} kg CO₂ · ₹{c.money}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
