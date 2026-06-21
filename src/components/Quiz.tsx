import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
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

  const inputClass = "w-full p-[12px_16px] rounded-xl border border-[var(--color-line)] text-base bg-white box-border";
  const labelClass = "block text-sm font-semibold mb-2 text-[var(--color-ink)]";
  const btnGroupClass = "flex flex-wrap gap-2.5";
  
  const SelectableBtn = ({ field, value, label }) => (
    <button
      type="button"
      onClick={() => updateAnswer(field, value)}
      className={`px-[18px] py-[10px] rounded-[20px] text-sm font-semibold cursor-pointer transition-all duration-200 border ${answers[field] === value ? 'bg-[var(--color-banyan)] text-white border-[var(--color-banyan)]' : 'bg-white text-[var(--color-ink)] border-[var(--color-line)]'}`}
    >
      {label}
    </button>
  );

  SelectableBtn.propTypes = {
    field: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  };

  return (
    <div className="shell max-w-[640px] min-h-[80vh] flex flex-col justify-center">
      
      <div className="card p-10">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-[13px] font-bold text-[var(--color-ink)] opacity-50 mb-2">
            <span>{t('quiz_step')} {step} {t('quiz_of')} 5</span>
            <span>{step * 20}%</span>
          </div>
          <div className="h-1.5 bg-[var(--color-paper-2)] rounded-[3px] overflow-hidden">
            <div className="h-full bg-[var(--color-banyan)] transition-[width] duration-300 ease-out" style={{ width: `${step * 20}%` }}></div>
          </div>
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <h2 className="display text-[28px]">{t('quiz_s1_title')}</h2>
            <div>
              <label className={labelClass}>{t('quiz_q_name')}</label>
              <input type="text" value={answers.name} onChange={e => updateAnswer('name', e.target.value)} className={inputClass} placeholder="E.g. Ayush" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClass}>{t('quiz_q_city')}</label>
                <input type="text" value={answers.city} onChange={e => updateAnswer('city', e.target.value)} className={inputClass} placeholder="City Name" />
              </div>
              <div className="flex-1">
                <label className={labelClass}>{t('quiz_q_state')}</label>
                <select value={answers.state} onChange={e => updateAnswer('state', e.target.value)} className={`${inputClass} appearance-none`}>
                  <option value="">{t('quiz_select_state')}</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>{t('quiz_q_household')}</label>
              <div className={btnGroupClass}>
                {['1', '2', '3', '4', '5+'].map(val => (
                  <SelectableBtn key={val} field="household" value={val} label={val} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Transport */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <h2 className="display text-[28px]">{t('quiz_s2_title')}</h2>
            <div>
              <label className={labelClass}>{t('quiz_q_commute')}</label>
              <div className={btnGroupClass}>
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
              <label className={labelClass}>{t('quiz_q_dailykm')}: {answers.dailyKm} km</label>
              <input type="range" min="0" max="100" value={answers.dailyKm} onChange={e => updateAnswer('dailyKm', parseInt(e.target.value))} className="w-full accent-[var(--color-marigold)]"  />
            </div>
            <div>
              <label className={labelClass}>{t('quiz_q_flights')}</label>
              <div className={btnGroupClass}>
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
          <div className="flex flex-col gap-6">
            <h2 className="display text-[28px]">{t('quiz_s3_title')}</h2>
            <div>
              <label className={labelClass}>{t('quiz_q_diet')}</label>
              <div className="flex flex-col gap-2.5">
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
              <label className={labelClass}>{t('quiz_q_eatout')}</label>
              <div className={btnGroupClass}>
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
              <label className={labelClass}>{t('quiz_q_foodwaste')}</label>
              <div className="flex flex-col gap-2.5">
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
          <div className="flex flex-col gap-6">
            <h2 className="display text-[28px]">{t('quiz_s4_title')}</h2>
            <div>
              <label className={labelClass}>{t('quiz_q_lpg')}</label>
              <div className={btnGroupClass}>
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
              <label className={labelClass}>{t('quiz_q_elec')}: {answers.electricityUnits} kWh</label>
              <input type="range" min="0" max="1500" step="50" value={answers.electricityUnits} onChange={e => updateAnswer('electricityUnits', parseInt(e.target.value))} className="w-full accent-[var(--color-marigold)]"  />
              <div className="text-xs text-[var(--color-ink)] opacity-50 mt-1">{t('quiz_elec_hint')}</div>
            </div>
            <div>
              <label className={labelClass}>{t('quiz_q_ac')}</label>
              <div className={btnGroupClass}>
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
              <label className={labelClass}>{t('quiz_q_inverter')}</label>
              <div className={btnGroupClass}>
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
          <div className="flex flex-col gap-6">
            <h2 className="display text-[28px]">{t('quiz_s5_title')}</h2>
            <div>
              <label className={labelClass}>{t('quiz_q_orders')}</label>
              <div className={btnGroupClass}>
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
              <label className={labelClass}>{t('quiz_q_clothes')}</label>
              <div className={btnGroupClass}>
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
              <label className={labelClass}>{t('quiz_q_waste')}</label>
              <div className="flex flex-col gap-2.5">
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
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-[var(--color-line)]">
          {step > 1 ? (
            <button type="button" onClick={goBack} className="font-semibold text-[var(--color-ink)] opacity-60 flex items-center gap-1.5 cursor-pointer border-none bg-transparent">
              {t('quiz_btn_back')}
            </button>
          ) : <div></div>}

          {step < 5 ? (
            <button type="button" onClick={goNext} className="bg-[var(--color-ink)] text-white px-8 py-3.5 rounded-[30px] font-bold text-[15px] cursor-pointer border-none">
              {t('quiz_btn_next')}
            </button>
          ) : (
            <button type="button" onClick={submitQuiz} className="bg-[var(--color-marigold)] text-white px-8 py-3.5 rounded-[30px] font-bold text-[15px] shadow-[0_4px_14px_rgba(232,93,44,0.3)] cursor-pointer border-none">
              {t('quiz_btn_submit')}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
