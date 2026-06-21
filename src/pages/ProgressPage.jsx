import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell
} from 'recharts';
import { useStorage } from '../hooks/useStorage';
import { useLang } from '../hooks/useLang';
import DailyLog from '../components/DailyLog';

export default function ProgressPage() {
  const { getHistory } = useStorage();
  const { t } = useLang();
  
  const [historyData, setHistoryData] = useState([]);
  const [isSampleData, setIsSampleData] = useState(false);
  const [stats, setStats] = useState({
    totalCo2Saved: 0,
    totalMoneySaved: 0,
    ecoScoreTrend: 0,
    latestScore: 0
  });

  const INDIA_AVG_MONTHLY_KG = 216;
  const INR_PER_KG = 15;

  useEffect(() => {
    let rawHistory = getHistory();
    
    // Sort oldest to newest just in case
    rawHistory = [...rawHistory].sort((a, b) => new Date(a.date) - new Date(b.date));

    // If less than 2 entries, generate 6 months of realistic dummy data
    if (rawHistory.length < 2) {
      setIsSampleData(true);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const dummyTrends = [245, 230, 222, 210, 195, 185];
      
      rawHistory = months.map((m, i) => {
        const emissions = dummyTrends[i];
        const savedVsAvg = INDIA_AVG_MONTHLY_KG - emissions;
        return {
          month: m,
          emissions: emissions,
          indiaAvg: INDIA_AVG_MONTHLY_KG,
          moneySaved: savedVsAvg * INR_PER_KG, // 15 INR per kg proxy
          score: 500 + (savedVsAvg * 5)
        };
      });
    } else {
      setIsSampleData(false);
      // Map to add baseline stats
      rawHistory = rawHistory.map(entry => {
        const savedVsAvg = INDIA_AVG_MONTHLY_KG - entry.emissions;
        return {
          ...entry,
          indiaAvg: INDIA_AVG_MONTHLY_KG,
          moneySaved: savedVsAvg * INR_PER_KG
        };
      });
    }

    setHistoryData(rawHistory);

    // Calculate Summary Stats
    if (rawHistory.length > 0) {
      let totalCo2 = 0;
      let totalMoney = 0;

      rawHistory.forEach(entry => {
        const saved = INDIA_AVG_MONTHLY_KG - entry.emissions;
        totalCo2 += saved;
        totalMoney += entry.moneySaved;
      });

      const latest = rawHistory[rawHistory.length - 1];
      const previous = rawHistory.length > 1 ? rawHistory[rawHistory.length - 2] : latest;
      const trend = Math.round(latest.score - previous.score);

      setStats({
        totalCo2Saved: Math.round(totalCo2),
        totalMoneySaved: Math.round(totalMoney),
        ecoScoreTrend: trend,
        latestScore: Math.round(latest.score)
      });
    }
  }, []);

  const formatTooltipY = (value) => [`${Math.round(value)} kg`, t('prog_monthly_chart')];
  const formatTooltipMoney = (value) => [`₹${Math.round(value)}`, t('prog_money_chart')];

  return (
    <div className="shell" style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '100px' }}>
      <h1 className="display" style={{ fontSize: '32px', color: 'var(--color-banyan-deep)', marginBottom: '8px' }}>
        {t('prog_title')}
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--color-ink)', opacity: 0.6, marginBottom: '32px' }}>
        {t('prog_desc')}
      </p>

      {/* Stats Summary Row */}
      <div className="metrics-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px', border: '1px solid var(--color-line)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6, marginBottom: '8px' }}>{t('prog_tot_co2')}</div>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', fontWeight: 700, color: stats.totalCo2Saved >= 0 ? 'var(--color-banyan)' : 'var(--color-marigold)' }}>
            {stats.totalCo2Saved > 0 ? '+' : ''}{stats.totalCo2Saved} <span style={{ fontSize: '16px', fontWeight: 600, opacity: 0.6, fontFamily: 'var(--font-sans)' }}>kg</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, opacity: 0.5, marginTop: '4px' }}>{t('prog_vs_avg')}</div>
        </div>

        <div className="card" style={{ padding: '24px', border: '1px solid var(--color-line)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6, marginBottom: '8px' }}>{t('prog_tot_inr')}</div>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', fontWeight: 700, color: stats.totalMoneySaved >= 0 ? 'var(--color-banyan)' : 'var(--color-marigold)' }}>
            <span style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>₹</span>{stats.totalMoneySaved > 0 ? '+' : ''}{stats.totalMoneySaved}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, opacity: 0.5, marginTop: '4px' }}>{t('prog_inr_hint')}</div>
        </div>

        <div className="card" style={{ padding: '24px', border: '1px solid var(--color-line)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6, marginBottom: '8px' }}>{t('prog_trend')}</div>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-ink)' }}>
            {stats.latestScore}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px', color: stats.ecoScoreTrend >= 0 ? 'var(--color-banyan)' : 'var(--color-marigold)' }}>
            {stats.ecoScoreTrend > 0 ? '↗' : (stats.ecoScoreTrend < 0 ? '↘' : '→')} {stats.ecoScoreTrend > 0 ? '+' : ''}{stats.ecoScoreTrend} {t('prog_points')}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginBottom: '40px' }}>
        
        {/* Monthly Trend Line Chart */}
        <div className="card" style={{ padding: '32px', border: '1px solid var(--color-line)', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)' }}>{t('prog_monthly_chart')}</h3>
              {isSampleData && (
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-marigold)', background: 'var(--color-marigold-pale)', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginTop: '6px' }}>
                  {t('prog_sample_data')}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600, opacity: 0.7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '3px', background: 'var(--color-banyan)' }}></span> {t('prog_you')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '3px', borderTop: '2px dashed #9ca3af' }}></span> {t('prog_india')}
              </div>
            </div>
          </div>
          
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={['dataMin - 20', 'dataMax + 20']} />
                <Tooltip 
                  formatter={formatTooltipY}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 700, color: '#111827', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="indiaAvg" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} name={t('prog_india')} />
                <Line type="monotone" dataKey="emissions" stroke="var(--color-banyan)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-banyan)', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} name={t('prog_you')} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Money Saved Bar Chart */}
        <div className="card" style={{ padding: '32px', border: '1px solid var(--color-line)', background: 'white' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)' }}>{t('prog_money_chart')}</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-ink)', opacity: 0.6, marginTop: '4px' }}>{t('prog_money_desc')}</p>
          </div>
          
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  formatter={formatTooltipMoney}
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 700, color: '#111827', marginBottom: '4px' }}
                />
                <Bar dataKey="moneySaved" radius={[4, 4, 4, 4]}>
                  {historyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.moneySaved >= 0 ? 'var(--color-banyan)' : 'var(--color-marigold)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <DailyLog />

    </div>
  );
}
