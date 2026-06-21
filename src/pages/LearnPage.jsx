import { useState } from 'react';
import { useLang } from '../hooks/useLang';

export default function LearnPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const { t } = useLang();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: t('learn_f1_q'), a: t('learn_f1_a') },
    { q: t('learn_f2_q'), a: t('learn_f2_a') },
    { q: t('learn_f3_q'), a: t('learn_f3_a') },
    { q: t('learn_f4_q'), a: t('learn_f4_a') },
    { q: t('learn_f5_q'), a: t('learn_f5_a') },
  ];

  return (
    <div className="shell max-w-[800px] mx-auto pb-[100px]">
      
      <div className="text-center mb-16">
        <h1 className="display text-[42px] text-[var(--color-banyan-deep)] mb-4">
          {t('learn_title')}
        </h1>
        <p className="text-lg text-[var(--color-ink)] opacity-60 max-w-[600px] mx-auto">
          {t('learn_desc')}
        </p>
      </div>

      {/* SECTION 1 */}
      <div className="mb-16">
        <h2 className="display text-[28px] text-[var(--color-ink)] mb-5 border-b-2 border-[var(--color-line)] pb-3">
          {t('learn_s1_t')}
        </h2>
        <div className="text-base leading-[1.8] text-[var(--color-ink)] opacity-85">
          <p className="mb-4">
            {t('learn_s1_p1')}
          </p>
          <p className="mb-4">
            {t('learn_s1_p2')}
          </p>
          <p>
            {t('learn_s1_p3')}
          </p>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="mb-16">
        <h2 className="display text-[28px] text-[var(--color-ink)] mb-5 border-b-2 border-[var(--color-line)] pb-3">
          {t('learn_s2_t')}
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          
          <div className="card p-6 bg-white border border-[var(--color-line)]">
            <div className="text-[32px] font-[family-name:var(--font-serif)] font-bold text-[var(--color-banyan)] mb-2">
              2.6 Tonnes
            </div>
            <h3 className="text-base font-bold mb-2">{t('learn_s2_c1t')}</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {t('learn_s2_c1d')}
            </p>
          </div>

          <div className="card p-6 bg-white border border-[var(--color-line)]">
            <div className="text-[32px] font-[family-name:var(--font-serif)] font-bold text-[var(--color-marigold)] mb-2">
              6.3 Tonnes
            </div>
            <h3 className="text-base font-bold mb-2">{t('learn_s2_c2t')}</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {t('learn_s2_c2d')}
            </p>
          </div>

          <div className="card p-6 bg-white border border-[var(--color-line)]">
            <div className="text-[32px] font-[family-name:var(--font-serif)] font-bold text-[var(--color-ink)] mb-2">
              ~20%
            </div>
            <h3 className="text-base font-bold mb-2">{t('learn_s2_c3t')}</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {t('learn_s2_c3d')}
            </p>
          </div>

          <div className="card p-6 bg-white border border-[var(--color-line)]">
            <div className="text-[32px] font-[family-name:var(--font-serif)] font-bold text-[var(--color-ink)] mb-2">
              70%+
            </div>
            <h3 className="text-base font-bold mb-2">{t('learn_s2_c4t')}</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {t('learn_s2_c4d')}
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 3 */}
      <div className="mb-16">
        <h2 className="display text-[28px] text-[var(--color-ink)] mb-5 border-b-2 border-[var(--color-line)] pb-3">
          {t('learn_s3_t')}
        </h2>
        <div className="card p-8 bg-[var(--color-paper-2)] border-none">
          <p className="text-base leading-[1.8] opacity-85 mb-6">
            {t('learn_s3_d')}
          </p>
          
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold mb-2">{t('learn_s3_st1')}</h3>
              <p className="text-[15px] opacity-75 leading-[1.6]">
                {t('learn_s3_sd1')}
              </p>
            </div>
            
            <div>
              <h3 className="text-base font-bold mb-2">{t('learn_s3_st2')}</h3>
              <p className="text-[15px] opacity-75 leading-[1.6]">
                {t('learn_s3_sd2')}
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold mb-2">{t('learn_s3_st3')}</h3>
              <p className="text-[15px] opacity-75 leading-[1.6]">
                {t('learn_s3_sd3')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 */}
      <div>
        <h2 className="display text-[28px] text-[var(--color-ink)] mb-5 border-b-2 border-[var(--color-line)] pb-3">
          {t('learn_s4_t')}
        </h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className={`card p-0 overflow-hidden transition-all duration-200 border ${isOpen ? 'border-[var(--color-banyan)] bg-white' : 'border-[var(--color-line)] bg-[var(--color-paper)]'}`}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className={`w-full px-6 py-5 flex justify-between items-center text-base font-bold text-left focus:outline-none hover:bg-black/5 focus:bg-black/5 ${isOpen ? 'text-[var(--color-banyan-deep)]' : 'text-[var(--color-ink)]'}`}
                >
                  {faq.q}
                  <span className={`text-2xl leading-none font-normal ${isOpen ? 'text-[var(--color-banyan)] opacity-100' : 'text-[var(--color-ink)] opacity-40'}`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6 text-[15px] leading-[1.6] text-[var(--color-ink)] opacity-75">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
