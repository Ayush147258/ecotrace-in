import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStorage } from '../hooks/useStorage';
import { useLang } from '../hooks/useLang';

const OptionBtn = ({ state, setState, value, label }) => {
  const isSelected = state === value;
  return (
    <button
      type="button"
      onClick={() => setState(value)}
      className={`flex-1 p-[14px_10px] rounded-2xl text-[13px] font-semibold cursor-pointer transition-all duration-200 min-w-[80px] border ${isSelected ? 'bg-[var(--color-banyan)] text-white border-[var(--color-banyan)]' : 'bg-white text-[var(--color-ink)] border-[var(--color-line)]'}`}
    >
      {label}
    </button>
  );
};

OptionBtn.propTypes = {
  state: PropTypes.string,
  setState: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const QGroup = ({ title, state, setState, options }) => (
  <div className="mb-5">
    <div className="text-sm font-bold mb-2.5 text-[var(--color-ink)]">{title}</div>
    <div className="flex gap-2 flex-wrap">
      {options.map(opt => (
        <OptionBtn key={opt.value} state={state} setState={setState} value={opt.value} label={opt.label} />
      ))}
    </div>
  </div>
);

QGroup.propTypes = {
  title: PropTypes.string.isRequired,
  state: PropTypes.string,
  setState: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

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



  return (
    <div className="card p-8 border border-[var(--color-line)] rounded-3xl bg-[var(--color-paper-2)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="display text-2xl text-[var(--color-banyan-deep)]">{t('daily_title')}</h2>
        <div className="text-xs font-bold opacity-60 bg-black/5 px-3 py-1.5 rounded-2xl">
          {isLogged ? t('daily_logged') : (lastLogDate ? `${t('daily_last')}: ${lastLogDate}` : t('daily_not_logged'))}
        </div>
      </div>

      {isLogged ? (
        <div className="text-center py-10 px-5 bg-white rounded-[20px] border border-[var(--color-line)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-banyan-pale)] text-[var(--color-banyan)] flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h3 className="text-lg font-bold mb-2">{t('daily_success_title')}</h3>
          <p className="text-sm opacity-60 max-w-[280px] mx-auto">{t('daily_success_desc')}</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-[20px] border border-[var(--color-line)]">
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
            type="button"
            onClick={handleLogSubmit}
            disabled={!q1 || !q2 || !q3}
            className={`w-full p-4 rounded-[30px] font-extrabold text-[15px] mt-3 transition-all duration-200 ${(!q1 || !q2 || !q3) ? 'bg-[var(--color-line)] text-black/40 cursor-not-allowed' : 'bg-[var(--color-marigold)] text-white cursor-pointer'}`}
          >
            {t('daily_btn_log')}
          </button>
        </div>
      )}
    </div>
  );
}
