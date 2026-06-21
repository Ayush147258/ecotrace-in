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
    <div className="shell max-w-[960px] mx-auto pb-[100px]">
      <h1 className="display text-[32px] text-[var(--color-banyan-deep)] mb-2">
        {t('prog_title')}
      </h1>
      <p className="text-[15px] text-[var(--color-ink)] opacity-60 mb-8">
        {t('prog_desc')}
      </p>

      {/* Stats Summary Row */}
      <div className="metrics-row grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-8">
        <div className="card p-6 border border-[var(--color-line)]">
          <div className="text-xs font-bold uppercase opacity-60 mb-2">{t('prog_tot_co2')}</div>
          <div className={`text-[32px] font-[family-name:var(--font-serif)] font-bold ${stats.totalCo2Saved >= 0 ? 'text-[var(--color-banyan)]' : 'text-[var(--color-marigold)]'}`}>
            {stats.totalCo2Saved > 0 ? '+' : ''}{stats.totalCo2Saved} <span className="text-base font-semibold opacity-60 font-[family-name:var(--font-sans)]">kg</span>
          </div>
          <div className="text-xs font-semibold opacity-50 mt-1">{t('prog_vs_avg')}</div>
        </div>

        <div className="card p-6 border border-[var(--color-line)]">
          <div className="text-xs font-bold uppercase opacity-60 mb-2">{t('prog_tot_inr')}</div>
          <div className={`text-[32px] font-[family-name:var(--font-serif)] font-bold ${stats.totalMoneySaved >= 0 ? 'text-[var(--color-banyan)]' : 'text-[var(--color-marigold)]'}`}>
            <span className="text-xl font-semibold font-[family-name:var(--font-sans)]">₹</span>{stats.totalMoneySaved > 0 ? '+' : ''}{stats.totalMoneySaved}
          </div>
          <div className="text-xs font-semibold opacity-50 mt-1">{t('prog_inr_hint')}</div>
        </div>

        <div className="card p-6 border border-[var(--color-line)]">
          <div className="text-xs font-bold uppercase opacity-60 mb-2">{t('prog_trend')}</div>
          <div className="text-[32px] font-[family-name:var(--font-serif)] font-bold text-[var(--color-ink)]">
            {stats.latestScore}
          </div>
          <div className={`text-sm font-bold mt-1 ${stats.ecoScoreTrend >= 0 ? 'text-[var(--color-banyan)]' : 'text-[var(--color-marigold)]'}`}>
            {stats.ecoScoreTrend > 0 ? '↗' : (stats.ecoScoreTrend < 0 ? '↘' : '→')} {stats.ecoScoreTrend > 0 ? '+' : ''}{stats.ecoScoreTrend} {t('prog_points')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-10">
        
        {/* Monthly Trend Line Chart */}
        <div className="card p-8 border border-[var(--color-line)] bg-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-ink)]">{t('prog_monthly_chart')}</h3>
              {isSampleData && (
                <div className="text-xs font-semibold text-[var(--color-marigold)] bg-[var(--color-marigold-pale)] px-2.5 py-1 rounded-xl inline-block mt-1.5">
                  {t('prog_sample_data')}
                </div>
              )}
            </div>
            <div className="flex gap-4 text-xs font-semibold opacity-70">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-[3px] bg-[var(--color-banyan)]"></span> {t('prog_you')}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-[3px] border-t-2 border-dashed border-[#9ca3af]"></span> {t('prog_india')}
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
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
        <div className="card p-8 border border-[var(--color-line)] bg-white">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[var(--color-ink)]">{t('prog_money_chart')}</h3>
            <p className="text-[13px] text-[var(--color-ink)] opacity-60 mt-1">{t('prog_money_desc')}</p>
          </div>
          
          <div className="h-[260px] w-full">
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
