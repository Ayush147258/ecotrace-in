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
    <div className="shell overflow-y-auto min-h-screen pb-[60px]">

      <div className="hero text-center pt-[60px] px-5 pb-[80px] flex flex-col items-center">
        <div className="bg-[var(--color-banyan-pale)] p-4 rounded-full mb-6">
          <Leaf size={48} color="var(--color-banyan)" aria-hidden="true" />
        </div>
        <h1 className="display text-[clamp(32px,5vw,48px)] text-[var(--color-banyan-deep)] mb-4 max-w-[640px] leading-[1.15]">
          {t('landing_hero_title')}
        </h1>
        <p className="text-lg text-[var(--color-ink)] opacity-75 max-w-[520px] mb-9 leading-relaxed">
          {t('landing_hero_subtitle')}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/login"
            className="btn-primary px-7 py-[14px] text-base rounded-[30px]"
          >
            {t('landing_btn_start')}
          </Link>
          <button
            onClick={handleGuest}
            className="btn-secondary px-7 py-[14px] text-base rounded-[30px]"
          >
            {t('login_guest')}
          </button>
        </div>
      </div>

      <div id="how-it-works" className="mb-16">
        <h2 className="display text-center text-[28px] mb-8">
          {t('landing_how_title')}
        </h2>
        <div className="landing-steps">
          <div className="card p-7 text-center">
            <div className="w-[44px] h-[44px] bg-[var(--color-banyan-pale)] text-[var(--color-banyan)] rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-extrabold">1</div>
            <h3 className="text-lg mb-[10px] font-bold">{t('landing_step1_title')}</h3>
            <p className="opacity-65 text-sm leading-relaxed">{t('landing_step1_desc')}</p>
          </div>
          <div className="card p-7 text-center">
            <div className="w-[44px] h-[44px] bg-[var(--color-marigold-pale)] text-[var(--color-marigold)] rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-extrabold">2</div>
            <h3 className="text-lg mb-[10px] font-bold">{t('landing_step2_title')}</h3>
            <p className="opacity-65 text-sm leading-relaxed">{t('landing_step2_desc')}</p>
          </div>
          <div className="card p-7 text-center">
            <div className="w-[44px] h-[44px] bg-[var(--color-paper-2)] text-[var(--color-gold)] rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-extrabold">3</div>
            <h3 className="text-lg mb-[10px] font-bold">{t('landing_step3_title')}</h3>
            <p className="opacity-65 text-sm leading-relaxed">{t('landing_step3_desc')}</p>
          </div>
        </div>
      </div>

      <div className="card p-10">
        <h2 className="display text-center mb-8 text-2xl">
          {t('landing_live_impact')}
        </h2>
        <div className="metrics-row mb-0">
          <div className="metric text-center border-none bg-[var(--color-paper)]">
            <div className="m-label">{t('landing_metric1_title')}</div>
            <div className="m-value text-[var(--color-banyan)]">{t('landing_metric1_val')}</div>
          </div>
          <div className="metric text-center border-none bg-[var(--color-paper)]">
            <div className="m-label">{t('landing_metric2_title')}</div>
            <div className="m-value text-[var(--color-marigold)]">{t('landing_metric2_val')}</div>
          </div>
          <div className="metric text-center border-none bg-[var(--color-paper)]">
            <div className="m-label">{t('landing_metric3_title')}</div>
            <div className="m-value text-[var(--color-gold)]">{t('landing_metric3_val')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
