import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useLang } from '../hooks/useLang';
import { continueAsGuest } from '../utils/auth';

export default function LandingPage() {
  const { t } = useLang();
  const navigate = useNavigate();

  const handleGuest = async () => {
    await continueAsGuest();
    navigate('/quiz');
  };

  return (
    <div className="shell" style={{ overflowY: 'auto', minHeight: '100vh', paddingBottom: '60px' }}>

      <div className="hero" style={{ textAlign: 'center', padding: '60px 20px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ background: 'var(--color-banyan-pale)', padding: '16px', borderRadius: '50%', marginBottom: '24px' }}>
          <Leaf size={48} color="var(--color-banyan)" />
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: 'var(--color-banyan-deep)', marginBottom: '16px', maxWidth: '640px', lineHeight: 1.15 }}>
          {t('landing_hero_title')}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--color-ink)', opacity: 0.75, maxWidth: '520px', marginBottom: '36px', lineHeight: 1.5 }}>
          {t('landing_hero_subtitle')}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/login"
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '30px' }}
          >
            {t('landing_btn_start')}
          </Link>
          <button
            onClick={handleGuest}
            className="btn-secondary"
            style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '30px' }}
          >
            {t('login_guest')}
          </button>
        </div>
      </div>

      <div id="how-it-works" style={{ marginBottom: '64px' }}>
        <h2 className="display" style={{ textAlign: 'center', fontSize: '28px', marginBottom: '32px' }}>
          {t('landing_how_title')}
        </h2>
        <div className="landing-steps">
          <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '44px', height: '44px', background: 'var(--color-banyan-pale)', color: 'var(--color-banyan)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '18px', fontWeight: 800 }}>1</div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px', fontWeight: 700 }}>{t('landing_step1_title')}</h3>
            <p style={{ opacity: 0.65, fontSize: '14px', lineHeight: 1.5 }}>{t('landing_step1_desc')}</p>
          </div>
          <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '44px', height: '44px', background: 'var(--color-marigold-pale)', color: 'var(--color-marigold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '18px', fontWeight: 800 }}>2</div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px', fontWeight: 700 }}>{t('landing_step2_title')}</h3>
            <p style={{ opacity: 0.65, fontSize: '14px', lineHeight: 1.5 }}>{t('landing_step2_desc')}</p>
          </div>
          <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '44px', height: '44px', background: 'var(--color-paper-2)', color: 'var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '18px', fontWeight: 800 }}>3</div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px', fontWeight: 700 }}>{t('landing_step3_title')}</h3>
            <p style={{ opacity: 0.65, fontSize: '14px', lineHeight: 1.5 }}>{t('landing_step3_desc')}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '40px' }}>
        <h2 className="display" style={{ textAlign: 'center', marginBottom: '32px', fontSize: '24px' }}>
          {t('landing_live_impact')}
        </h2>
        <div className="metrics-row" style={{ marginBottom: 0 }}>
          <div className="metric" style={{ textAlign: 'center', border: 'none', background: 'var(--color-paper)' }}>
            <div className="m-label">{t('landing_metric1_title')}</div>
            <div className="m-value" style={{ color: 'var(--color-banyan)' }}>{t('landing_metric1_val')}</div>
          </div>
          <div className="metric" style={{ textAlign: 'center', border: 'none', background: 'var(--color-paper)' }}>
            <div className="m-label">{t('landing_metric2_title')}</div>
            <div className="m-value" style={{ color: 'var(--color-marigold)' }}>{t('landing_metric2_val')}</div>
          </div>
          <div className="metric" style={{ textAlign: 'center', border: 'none', background: 'var(--color-paper)' }}>
            <div className="m-label">{t('landing_metric3_title')}</div>
            <div className="m-value" style={{ color: 'var(--color-gold)' }}>{t('landing_metric3_val')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
