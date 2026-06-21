import { Link } from 'react-router-dom';
import { useLang } from '../hooks/useLang';

export default function LandingPage() {
  const { t } = useLang();

  return (
    <div className="shell" style={{ paddingBottom: '120px' }}>
      
      {/* Hero Section */}
      <div className="hero" style={{ textAlign: 'center', margin: '60px 0 80px 0' }}>
        <h1 className="display" style={{ fontSize: '48px', color: 'var(--color-banyan-deep)', marginBottom: '24px', lineHeight: 1.1 }}>
          {t('landing_hero_title')}
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--color-ink)', opacity: 0.8, maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.5 }}>
          {t('landing_hero_subtitle')}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/login" className="btn" style={{ background: 'var(--color-banyan)', color: 'white', padding: '16px 32px', borderRadius: '30px', fontWeight: 800, textDecoration: 'none' }}>
            {t('landing_cta_primary')}
          </Link>
          <a href="#how-it-works" className="btn" style={{ background: 'transparent', border: '1px solid var(--color-ink)', color: 'var(--color-ink)', padding: '16px 32px', borderRadius: '30px', fontWeight: 800, textDecoration: 'none' }}>
            {t('landing_cta_secondary')}
          </a>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" style={{ marginBottom: '80px' }}>
        <h2 className="display" style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>{t('landing_how_title')}</h2>
        <div className="two-col" style={{ gap: '32px' }}>
          
          <div className="card" style={{ padding: '32px', textAlign: 'center', background: 'white' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--color-paper-2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '20px', fontWeight: 800 }}>1</div>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{t('landing_step1_title')}</h3>
            <p style={{ opacity: 0.7 }}>{t('landing_step1_desc')}</p>
          </div>

          <div className="card" style={{ padding: '32px', textAlign: 'center', background: 'white' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--color-paper-2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '20px', fontWeight: 800 }}>2</div>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{t('landing_step2_title')}</h3>
            <p style={{ opacity: 0.7 }}>{t('landing_step2_desc')}</p>
          </div>

          <div className="card" style={{ padding: '32px', textAlign: 'center', background: 'white' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--color-paper-2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '20px', fontWeight: 800 }}>3</div>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{t('landing_step3_title')}</h3>
            <p style={{ opacity: 0.7 }}>{t('landing_step3_desc')}</p>
          </div>

        </div>
      </div>

      <div style={{ marginTop: 80, padding: 40, background: 'white', borderRadius: 24 }}>
        <h2 className="display" style={{ textAlign: 'center', marginBottom: 40 }}>Live Impact</h2>
        <div className="metrics-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <div className="metric" style={{ textAlign: 'center' }}>
            <div className="m-label">{t('landing_metric1_title')}</div>
            <div className="m-value" style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-banyan)' }}>{t('landing_metric1_val')}</div>
          </div>
          <div className="metric" style={{ textAlign: 'center' }}>
            <div className="m-label">{t('landing_metric2_title')}</div>
            <div className="m-value" style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-marigold)' }}>{t('landing_metric2_val')}</div>
          </div>
          <div className="metric" style={{ textAlign: 'center' }}>
            <div className="m-label">{t('landing_metric3_title')}</div>
            <div className="m-value" style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-gold)' }}>{t('landing_metric3_val')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
