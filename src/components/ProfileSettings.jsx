import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Settings, LogOut, RefreshCw, UserPlus, Check } from 'lucide-react';
import { useLang } from '../hooks/useLang';
import { useStorage } from '../hooks/useStorage';
import { getCurrentUser, updateAccountName, signUp, logOut } from '../utils/auth';

export default function ProfileSettings({ onUpdate }) {
  const navigate = useNavigate();
  const { t } = useLang();
  const { getQuizData, updateQuizLocation } = useStorage();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Profile Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Guest Conversion State
  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({ email: '', password: '' });
  const [signupError, setSignupError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (u) {
      setUser(u);
      setName(u.name || '');
      const q = getQuizData(u.id);
      if (q) {
        setCity(q.city || '');
        setStateName(q.state || '');
      }
    }
  }, []);

  if (!user) return null;

  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Update auth object
    updateAccountName(name);
    
    // Update quiz location
    updateQuizLocation(city, stateName);
    
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSaving(false);
      if (onUpdate) onUpdate();
    }, 1000);
  };

  const handleRetake = () => {
    localStorage.removeItem(`ecotrace_quiz_completed_${user.id}`);
    navigate('/quiz');
  };

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setSignupError('');
    setIsSigningUp(true);

    if (!signupForm.email || !signupForm.password) {
      setSignupError('Please fill in all fields');
      setIsSigningUp(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setSignupError('Password must be at least 6 characters');
      setIsSigningUp(false);
      return;
    }

    const result = await signUp(name, signupForm.email, signupForm.password, user.id);
    
    if (result.success) {
      setUser(result.user);
      setShowSignup(false);
      if (onUpdate) onUpdate(); // Refresh the rest of the dashboard
    } else {
      setSignupError(result.error || 'Signup failed');
    }
    
    setIsSigningUp(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[var(--color-line)] mb-4 text-[15px] bg-white";
  const labelClass = "block text-sm font-semibold text-[var(--color-ink)] opacity-70 mb-2";

  return (
    <div className="mb-6">
      <div className="flex justify-end">
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white border border-[var(--color-line)] py-2.5 px-4 rounded-[20px] text-sm font-semibold text-[var(--color-ink)] cursor-pointer transition-all duration-200"
        >
          <Settings size={16} aria-hidden="true" />
          {t('profile_title')}
        </button>
      </div>

      {isOpen && (
        <div className="card mt-4 p-8 bg-[var(--color-paper-2)] animate-[slideDown_0.3s_ease-out]">
          
          <h2 className="text-2xl font-bold text-[var(--color-banyan-deep)] mb-6">
            {t('profile_title')}
          </h2>

          {/* GUEST BANNER */}
          {user.isGuest && (
            <div className="bg-[var(--color-marigold-pale)] border border-[var(--color-marigold)] rounded-xl p-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-white rounded-full p-2 text-[var(--color-marigold)]">
                  <UserPlus size={24} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[var(--color-ink)] mb-1">
                    {t('profile_guest_banner')}
                  </h3>
                  <p className="text-sm text-[var(--color-ink)] opacity-80 mb-4">
                    Converting your guest account will safely move all your quiz answers, logs, and streaks into a permanent profile.
                  </p>
                  
                  {!showSignup ? (
                    <button 
                      type="button"
                      onClick={() => setShowSignup(true)}
                      className="btn-primary px-5 py-2 text-sm" 
                    >
                      {t('profile_create_account')}
                    </button>
                  ) : (
                    <form onSubmit={handleCreateAccount} className="bg-white p-5 rounded-xl mt-4">
                      <input 
                        type="email" 
                        placeholder={t('profile_email')}
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                        className={inputClass}
                      />
                      <input 
                        type="password" 
                        placeholder={t('profile_password')}
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                        className={inputClass}
                      />
                      {signupError && <p className="text-red-500 text-sm mb-4">{signupError}</p>}
                      <div className="flex gap-3">
                        <button type="submit" className="btn-primary px-6 py-2.5 text-sm" disabled={isSigningUp}>
                          {isSigningUp ? t('profile_creating') : t('profile_create_account')}
                        </button>
                        <button type="button" onClick={() => setShowSignup(false)} className="bg-transparent border-none text-sm font-semibold text-[var(--color-ink)] opacity-60 cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 mb-8">
            <div>
              <label className={labelClass}>
                {t('profile_name')}
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>
                {t('profile_city')}
              </label>
              <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>
                {t('profile_state')}
              </label>
              <input 
                type="text" 
                value={stateName} 
                onChange={(e) => setStateName(e.target.value)} 
                className={inputClass} 
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-10 border-b border-[var(--color-line)] pb-8">
            <button 
              type="button"
              onClick={handleSaveProfile} 
              className="btn-primary flex items-center gap-2" 
              disabled={isSaving}
            >
              {saveSuccess ? <Check size={18} aria-hidden="true" /> : null}
              {saveSuccess ? t('profile_saved') : t('profile_save')}
            </button>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button 
              type="button"
              onClick={handleRetake}
              className="flex items-center gap-2 bg-white border border-[var(--color-line)] px-6 py-3 rounded-xl text-[15px] font-semibold text-[var(--color-ink)] cursor-pointer"
            >
              <RefreshCw size={18} aria-hidden="true" />
              {t('profile_retake')}
            </button>
            <button 
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white border border-[var(--color-line)] px-6 py-3 rounded-xl text-[15px] font-semibold text-red-500 cursor-pointer"
            >
              <LogOut size={18} aria-hidden="true" />
              {t('profile_logout')}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

ProfileSettings.propTypes = {
  onUpdate: PropTypes.func,
};
