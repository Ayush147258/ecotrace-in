import { useState, useEffect } from 'react';
import { useStorage } from '../hooks/useStorage';
import { useLang } from '../hooks/useLang';

export default function DailyLog() {
  const { hasLoggedToday, saveDailyLog, updateStreakOnLog, getDailyLog, getStreak } = useStorage();
  const { t } = useLang();
  
  const [isLogged, setIsLogged] = useState(false);
  const [lastLogDate, setLastLogDate] = useState(null);
  
  const [q1, setQ1] = useState(''); // Transport
  const [q2, setQ2] = useState(''); // Food
  const [q3, setQ3] = useState(''); // Extra

  useEffect(() => {
    const logged = hasLoggedToday();
    setIsLogged(logged);
    
    const streak = getStreak();
    if (streak.lastLogDate) {
      setLastLogDate(streak.lastLogDate);
    }
  }, []);

  const handleLogSubmit = () => {
    if (!q1 || !q2 || !q3) return;

    const dateKey = new Date().toISOString().split('T')[0];
    const logData = { transport: q1, food: q2, extra: q3, timestamp: new Date().toISOString() };
    
    saveDailyLog(dateKey, logData);
    updateStreakOnLog();
    
    setIsLogged(true);
    setLastLogDate(dateKey);
  };

  const OptionBtn = ({ state, setState, value, label }) => {
    const isSelected = state === value;
    return (
      <button
        onClick={() => setState(value)}
        style={{
          flex: 1, padding: '14px 10px', borderRadius: '16px', fontSize: '13px', fontWeight: 600,
          background: isSelected ? 'var(--color-banyan)' : 'white',
          color: isSelected ? 'white' : 'var(--color-ink)',
          border: `1px solid ${isSelected ? 'var(--color-banyan)' : 'var(--color-line)'}`,
          cursor: 'pointer', transition: 'all 0.2s', minWidth: '80px'
        }}
      >
        {label}
      </button>
    );
  };

  const QGroup = ({ title, state, setState, options }) => (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: 'var(--color-ink)' }}>{title}</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {options.map(opt => (
          <OptionBtn key={opt.value} state={state} setState={setState} value={opt.value} label={opt.label} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="card" style={{ padding: '32px', border: '1px solid var(--color-line)', borderRadius: '24px', background: 'var(--color-paper-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="display" style={{ fontSize: '24px', color: 'var(--color-banyan-deep)' }}>{t('daily_title')}</h2>
        <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.6, background: 'rgba(0,0,0,0.05)', padding: '6px 12px', borderRadius: '16px' }}>
          {isLogged ? t('daily_logged') : (lastLogDate ? `${t('daily_last')}: ${lastLogDate}` : t('daily_not_logged'))}
        </div>
      </div>

      {isLogged ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '20px', border: '1px solid var(--color-line)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-banyan-pale)', color: 'var(--color-banyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
            ✓
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{t('daily_success_title')}</h3>
          <p style={{ fontSize: '14px', opacity: 0.6, maxWidth: '280px', margin: '0 auto' }}>{t('daily_success_desc')}</p>
        </div>
      ) : (
        <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-line)' }}>
          <QGroup 
            title={t('daily_q1')} 
            state={q1} setState={setQ1}
            options={[
              { value: 'usual', label: t('d_usual') },
              { value: 'car', label: t('d_car') },
              { value: 'auto', label: t('d_auto') },
              { value: 'walk', label: t('d_walk') }
            ]}
          />
          <QGroup 
            title={t('daily_q2')} 
            state={q2} setState={setQ2}
            options={[
              { value: 'veg', label: t('d_veg') },
              { value: 'nonveg', label: t('d_nonveg') },
              { value: 'out', label: t('d_out') }
            ]}
          />
          <QGroup 
            title={t('daily_q3')} 
            state={q3} setState={setQ3}
            options={[
              { value: 'ac', label: t('d_ac') },
              { value: 'laundry', label: t('d_laundry') },
              { value: 'online', label: t('d_online') },
              { value: 'none', label: t('d_none') }
            ]}
          />

          <button 
            onClick={handleLogSubmit}
            disabled={!q1 || !q2 || !q3}
            style={{ 
              width: '100%', padding: '16px', borderRadius: '30px', fontWeight: 800, fontSize: '15px', marginTop: '12px',
              background: (!q1 || !q2 || !q3) ? 'var(--color-line)' : 'var(--color-marigold)',
              color: (!q1 || !q2 || !q3) ? 'rgba(0,0,0,0.4)' : 'white',
              cursor: (!q1 || !q2 || !q3) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {t('daily_btn_log')}
          </button>
        </div>
      )}
    </div>
  );
}
