import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-line)', marginBottom: '16px', fontSize: '15px', background: 'white' };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid var(--color-line)', padding: '10px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <Settings size={16} />
          {t('profile_title')}
        </button>
      </div>

      {isOpen && (
        <div className="card" style={{ marginTop: '16px', padding: '32px', background: 'var(--color-paper-2)', animation: 'slideDown 0.3s ease-out' }}>
          
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-banyan-deep)', marginBottom: '24px' }}>
            {t('profile_title')}
          </h2>

          {/* GUEST BANNER */}
          {user.isGuest && (
            <div style={{ background: 'var(--color-marigold-pale)', border: '1px solid var(--color-marigold)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ background: 'white', borderRadius: '50%', padding: '8px', color: 'var(--color-marigold)' }}>
                  <UserPlus size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '4px' }}>
                    {t('profile_guest_banner')}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-ink)', opacity: 0.8, marginBottom: '16px' }}>
                    Converting your guest account will safely move all your quiz answers, logs, and streaks into a permanent profile.
                  </p>
                  
                  {!showSignup ? (
                    <button 
                      onClick={() => setShowSignup(true)}
                      className="btn-primary" 
                      style={{ padding: '8px 20px', fontSize: '14px' }}
                    >
                      {t('profile_create_account')}
                    </button>
                  ) : (
                    <form onSubmit={handleCreateAccount} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginTop: '16px' }}>
                      <input 
                        type="email" 
                        placeholder={t('profile_email')}
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                        style={inputStyle}
                      />
                      <input 
                        type="password" 
                        placeholder={t('profile_password')}
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                        style={inputStyle}
                      />
                      {signupError && <p style={{ color: 'red', fontSize: '14px', marginBottom: '16px' }}>{signupError}</p>}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }} disabled={isSigningUp}>
                          {isSigningUp ? t('profile_creating') : t('profile_create_account')}
                        </button>
                        <button type="button" onClick={() => setShowSignup(false)} style={{ background: 'transparent', border: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)', opacity: 0.6, cursor: 'pointer' }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)', opacity: 0.7, marginBottom: '8px' }}>
                {t('profile_name')}
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)', opacity: 0.7, marginBottom: '8px' }}>
                {t('profile_city')}
              </label>
              <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)', opacity: 0.7, marginBottom: '8px' }}>
                {t('profile_state')}
              </label>
              <input 
                type="text" 
                value={stateName} 
                onChange={(e) => setStateName(e.target.value)} 
                style={inputStyle} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', borderBottom: '1px solid var(--color-line)', paddingBottom: '32px' }}>
            <button 
              onClick={handleSaveProfile} 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              disabled={isSaving}
            >
              {saveSuccess ? <Check size={18} /> : null}
              {saveSuccess ? t('profile_saved') : t('profile_save')}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleRetake}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid var(--color-line)', padding: '12px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, color: 'var(--color-ink)', cursor: 'pointer' }}
            >
              <RefreshCw size={18} />
              {t('profile_retake')}
            </button>
            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid var(--color-line)', padding: '12px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, color: 'red', cursor: 'pointer' }}
            >
              <LogOut size={18} />
              {t('profile_logout')}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
