import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { useLang } from '../hooks/useLang';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export default function QuizPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { t } = useLang();

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    name: user ? user.name : '',
    city: '',
    state: '',
    household: '1',
    transportMode: '',
    dailyKm: 0,
    flightsPerYear: '',
    diet: '',
    eatingOut: '',
    foodWaste: '',
    lpgCylinders: '',
    electricityUnits: 0,
    acHours: '',
    inverter: 'no',
    onlineOrders: '',
    newClothes: '',
    wasteManagement: ''
  });

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`ecotrace_quiz_${user.id}`);
      if (saved) {
        try {
          setAnswers(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [user]);

  const updateAnswer = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const goNext = () => setStep(s => Math.min(5, s + 1));
  const goBack = () => setStep(s => Math.max(1, s - 1));

  const submitQuiz = () => {
    if (user) {
      localStorage.setItem(`ecotrace_quiz_${user.id}`, JSON.stringify(answers));
      localStorage.setItem(`ecotrace_quiz_completed_${user.id}`, 'true');
    }
    navigate('/dashboard');
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1px solid var(--color-line)', fontSize: '16px',
    background: 'white', boxSizing: 'border-box'
  };

  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-ink)' };

  const btnGroupStyle = { display: 'flex', flexWrap: 'wrap', gap: '10px' };
  
  const SelectableBtn = ({ field, value, label }) => (
    <button
      onClick={() => updateAnswer(field, value)}
      style={{
        padding: '10px 18px', borderRadius: '20px', fontSize: '14px', fontWeight: 600,
        background: answers[field] === value ? 'var(--color-banyan)' : 'white',
        color: answers[field] === value ? 'white' : 'var(--color-ink)',
        border: `1px solid ${answers[field] === value ? 'var(--color-banyan)' : 'var(--color-line)'}`,
        cursor: 'pointer', transition: 'all 0.2s'
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="shell" style={{ maxWidth: '640px', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      <div className="card" style={{ padding: '40px' }}>
        
        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: 'var(--color-ink)', opacity: 0.5, marginBottom: '8px' }}>
            <span>{t('quiz_step')} {step} {t('quiz_of')} 5</span>
            <span>{step * 20}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--color-paper-2)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--color-banyan)', width: `${step * 20}%`, transition: 'width 0.3s ease-out' }}></div>
          </div>
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="display" style={{ fontSize: '28px' }}>{t('quiz_s1_title')}</h2>
            <div>
              <label style={labelStyle}>{t('quiz_q_name')}</label>
              <input type="text" value={answers.name} onChange={e => updateAnswer('name', e.target.value)} style={inputStyle} placeholder="E.g. Ayush" />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>{t('quiz_q_city')}</label>
                <input type="text" value={answers.city} onChange={e => updateAnswer('city', e.target.value)} style={inputStyle} placeholder="City Name" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>{t('quiz_q_state')}</label>
                <select value={answers.state} onChange={e => updateAnswer('state', e.target.value)} style={{ ...inputStyle, WebkitAppearance: 'none' }}>
                  <option value="">{t('quiz_select_state')}</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('quiz_q_household')}</label>
              <div style={btnGroupStyle}>
                {['1', '2', '3', '4', '5+'].map(val => (
                  <SelectableBtn key={val} field="household" value={val} label={val} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Transport */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="display" style={{ fontSize: '28px' }}>{t('quiz_s2_title')}</h2>
            <div>
              <label style={labelStyle}>{t('quiz_q_commute')}</label>
              <div style={btnGroupStyle}>
                {[
                  { v: 'walking', l: t('quiz_c_walk') },
                  { v: 'metro', l: t('quiz_c_metro') },
                  { v: 'bus', l: t('quiz_c_bus') },
                  { v: 'ev_2w', l: t('quiz_c_ev2w') },
                  { v: 'petrol_2w', l: t('quiz_c_p2w') },
                  { v: 'auto', l: t('quiz_c_auto') },
                  { v: 'ev_car', l: t('quiz_c_evcar') },
                  { v: 'petrol_car', l: t('quiz_c_pcar') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="transportMode" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('quiz_q_dailykm')}: {answers.dailyKm} km</label>
              <input type="range" min="0" max="100" value={answers.dailyKm} onChange={e => updateAnswer('dailyKm', parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-marigold)' }} />
            </div>
            <div>
              <label style={labelStyle}>{t('quiz_q_flights')}</label>
              <div style={btnGroupStyle}>
                {[
                  { v: '0', l: t('quiz_f_0') },
                  { v: '1-2', l: t('quiz_f_1_2') },
                  { v: '3-5', l: t('quiz_f_3_5') },
                  { v: '6+', l: t('quiz_f_6') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="flightsPerYear" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Diet & Food */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="display" style={{ fontSize: '28px' }}>{t('quiz_s3_title')}</h2>
            <div>
              <label style={labelStyle}>{t('quiz_q_diet')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { v: 'vegan', l: t('quiz_d_vegan') },
                  { v: 'pure_veg', l: t('quiz_d_veg') },
                  { v: 'veg_egg', l: t('quiz_d_vegegg') },
                  { v: 'nonveg_light', l: t('quiz_d_nonveg_light') },
                  { v: 'nonveg_heavy', l: t('quiz_d_nonveg_heavy') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="diet" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('quiz_q_eatout')}</label>
              <div style={btnGroupStyle}>
                {[
                  { v: 'Rarely', l: t('quiz_eo_rare') },
                  { v: '1-2x a week', l: t('quiz_eo_1_2') },
                  { v: '3-5x a week', l: t('quiz_eo_3_5') },
                  { v: 'Almost Daily', l: t('quiz_eo_daily') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="eatingOut" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('quiz_q_foodwaste')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { v: 'Minimal (We repurpose leftovers)', l: t('quiz_fw_min') },
                  { v: 'Average (Some scraps thrown)', l: t('quiz_fw_avg') },
                  { v: 'High (Often throw away meals)', l: t('quiz_fw_high') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="foodWaste" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Home Energy */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="display" style={{ fontSize: '28px' }}>{t('quiz_s4_title')}</h2>
            <div>
              <label style={labelStyle}>{t('quiz_q_lpg')}</label>
              <div style={btnGroupStyle}>
                {[
                  { v: 'PNG Piped Gas', l: t('quiz_l_png') },
                  { v: '1-3', l: t('quiz_l_1_3') },
                  { v: '4-6', l: t('quiz_l_4_6') },
                  { v: '7-9', l: t('quiz_l_7_9') },
                  { v: '10+', l: t('quiz_l_10') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="lpgCylinders" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('quiz_q_elec')}: {answers.electricityUnits} kWh</label>
              <input type="range" min="0" max="1500" step="50" value={answers.electricityUnits} onChange={e => updateAnswer('electricityUnits', parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-marigold)' }} />
              <div style={{ fontSize: '12px', color: 'var(--color-ink)', opacity: 0.5, marginTop: '4px' }}>{t('quiz_elec_hint')}</div>
            </div>
            <div>
              <label style={labelStyle}>{t('quiz_q_ac')}</label>
              <div style={btnGroupStyle}>
                {[
                  { v: 'No AC', l: t('quiz_ac_0') },
                  { v: '1-3 hours', l: t('quiz_ac_1_3') },
                  { v: '4-8 hours', l: t('quiz_ac_4_8') },
                  { v: '8+ hours', l: t('quiz_ac_8') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="acHours" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('quiz_q_inverter')}</label>
              <div style={btnGroupStyle}>
                {[
                  { v: 'yes', l: t('quiz_yes') },
                  { v: 'no', l: t('quiz_no') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="inverter" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Shopping & Waste */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="display" style={{ fontSize: '28px' }}>{t('quiz_s5_title')}</h2>
            <div>
              <label style={labelStyle}>{t('quiz_q_orders')}</label>
              <div style={btnGroupStyle}>
                {[
                  { v: '0-1', l: t('quiz_o_0_1') },
                  { v: '2-5', l: t('quiz_o_2_5') },
                  { v: '6-10', l: t('quiz_o_6_10') },
                  { v: '10+', l: t('quiz_o_10') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="onlineOrders" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('quiz_q_clothes')}</label>
              <div style={btnGroupStyle}>
                {[
                  { v: '0', l: t('quiz_cl_0') },
                  { v: '1-2 items', l: t('quiz_cl_1_2') },
                  { v: '3-5 items', l: t('quiz_cl_3_5') },
                  { v: '6+ items', l: t('quiz_cl_6') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="newClothes" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('quiz_q_waste')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { v: 'mixed', l: t('quiz_w_mixed') },
                  { v: 'segregated', l: t('quiz_w_seg') },
                  { v: 'composted', l: t('quiz_w_comp') }
                ].map(opt => (
                  <SelectableBtn key={opt.v} field="wasteManagement" value={opt.v} label={opt.l} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--color-line)' }}>
          {step > 1 ? (
            <button onClick={goBack} style={{ fontWeight: 600, color: 'var(--color-ink)', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', border: 'none', background: 'transparent' }}>
              {t('quiz_btn_back')}
            </button>
          ) : <div></div>}

          {step < 5 ? (
            <button onClick={goNext} style={{ background: 'var(--color-ink)', color: 'white', padding: '14px 32px', borderRadius: '30px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none' }}>
              {t('quiz_btn_next')}
            </button>
          ) : (
            <button onClick={submitQuiz} style={{ background: 'var(--color-marigold)', color: 'white', padding: '14px 32px', borderRadius: '30px', fontWeight: 700, fontSize: '15px', boxShadow: '0 4px 14px rgba(232,93,44,0.3)', cursor: 'pointer', border: 'none' }}>
              {t('quiz_btn_submit')}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
