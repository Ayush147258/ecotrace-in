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
    <div className="shell" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="display" style={{ fontSize: '42px', color: 'var(--color-banyan-deep)', marginBottom: '16px' }}>
          {t('learn_title')}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--color-ink)', opacity: 0.6, maxWidth: '600px', margin: '0 auto' }}>
          {t('learn_desc')}
        </p>
      </div>

      {/* SECTION 1 */}
      <div style={{ marginBottom: '64px' }}>
        <h2 className="display" style={{ fontSize: '28px', color: 'var(--color-ink)', marginBottom: '20px', borderBottom: '2px solid var(--color-line)', paddingBottom: '12px' }}>
          {t('learn_s1_t')}
        </h2>
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--color-ink)', opacity: 0.85 }}>
          <p style={{ marginBottom: '16px' }}>
            {t('learn_s1_p1')}
          </p>
          <p style={{ marginBottom: '16px' }}>
            {t('learn_s1_p2')}
          </p>
          <p>
            {t('learn_s1_p3')}
          </p>
        </div>
      </div>

      {/* SECTION 2 */}
      <div style={{ marginBottom: '64px' }}>
        <h2 className="display" style={{ fontSize: '28px', color: 'var(--color-ink)', marginBottom: '20px', borderBottom: '2px solid var(--color-line)', paddingBottom: '12px' }}>
          {t('learn_s2_t')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div className="card" style={{ padding: '24px', background: 'white', border: '1px solid var(--color-line)' }}>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-banyan)', marginBottom: '8px' }}>
              2.6 Tonnes
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{t('learn_s2_c1t')}</h3>
            <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: '1.5' }}>
              {t('learn_s2_c1d')}
            </p>
          </div>

          <div className="card" style={{ padding: '24px', background: 'white', border: '1px solid var(--color-line)' }}>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-marigold)', marginBottom: '8px' }}>
              6.3 Tonnes
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{t('learn_s2_c2t')}</h3>
            <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: '1.5' }}>
              {t('learn_s2_c2d')}
            </p>
          </div>

          <div className="card" style={{ padding: '24px', background: 'white', border: '1px solid var(--color-line)' }}>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '8px' }}>
              ~20%
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{t('learn_s2_c3t')}</h3>
            <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: '1.5' }}>
              {t('learn_s2_c3d')}
            </p>
          </div>

          <div className="card" style={{ padding: '24px', background: 'white', border: '1px solid var(--color-line)' }}>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '8px' }}>
              70%+
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{t('learn_s2_c4t')}</h3>
            <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: '1.5' }}>
              {t('learn_s2_c4d')}
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 3 */}
      <div style={{ marginBottom: '64px' }}>
        <h2 className="display" style={{ fontSize: '28px', color: 'var(--color-ink)', marginBottom: '20px', borderBottom: '2px solid var(--color-line)', paddingBottom: '12px' }}>
          {t('learn_s3_t')}
        </h2>
        <div className="card" style={{ padding: '32px', background: 'var(--color-paper-2)', border: 'none' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.8', opacity: 0.85, marginBottom: '24px' }}>
            {t('learn_s3_d')}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{t('learn_s3_st1')}</h3>
              <p style={{ fontSize: '15px', opacity: 0.75, lineHeight: '1.6' }}>
                {t('learn_s3_sd1')}
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{t('learn_s3_st2')}</h3>
              <p style={{ fontSize: '15px', opacity: 0.75, lineHeight: '1.6' }}>
                {t('learn_s3_sd2')}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{t('learn_s3_st3')}</h3>
              <p style={{ fontSize: '15px', opacity: 0.75, lineHeight: '1.6' }}>
                {t('learn_s3_sd3')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 */}
      <div>
        <h2 className="display" style={{ fontSize: '28px', color: 'var(--color-ink)', marginBottom: '20px', borderBottom: '2px solid var(--color-line)', paddingBottom: '12px' }}>
          {t('learn_s4_t')}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="card" 
                style={{ 
                  padding: '0', 
                  border: `1px solid ${isOpen ? 'var(--color-banyan)' : 'var(--color-line)'}`,
                  background: isOpen ? 'white' : 'var(--color-paper)',
                  overflow: 'hidden',
                  transition: 'all 0.2s'
                }}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  style={{ 
                    width: '100%', 
                    padding: '20px 24px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: isOpen ? 'var(--color-banyan-deep)' : 'var(--color-ink)',
                    textAlign: 'left'
                  }}
                >
                  {faq.q}
                  <span style={{ fontSize: '24px', lineHeight: 1, fontWeight: 400, color: isOpen ? 'var(--color-banyan)' : 'var(--color-ink)', opacity: isOpen ? 1 : 0.4 }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                
                {isOpen && (
                  <div style={{ padding: '0 24px 24px 24px', fontSize: '15px', lineHeight: '1.6', color: 'var(--color-ink)', opacity: 0.75 }}>
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
