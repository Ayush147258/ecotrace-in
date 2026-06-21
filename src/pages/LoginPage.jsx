import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logIn, signUp, continueAsGuest } from '../utils/auth';
import { useLang } from '../hooks/useLang';

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { t } = useLang();

  const handleToggle = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLoginMode) {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      const result = await logIn(formData.email, formData.password);
      if (result.success) {
        navigate('/quiz');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } else {
      if (!formData.name || formData.name.length < 2) {
        setError('Name must be at least 2 characters');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Invalid email format');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirm) {
        setError('Passwords do not match');
        return;
      }

      const result = await signUp(formData.name, formData.email, formData.password);
      if (result.success) {
        navigate('/quiz');
      } else {
        setError(result.error || 'Email already exists');
      }
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-line)', marginBottom: '16px', fontSize: '16px', background: 'white' };

  return (
    <div className="shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '40px', background: 'var(--color-paper-2)' }}>
        
        {/* Toggle UI */}
        <div style={{ display: 'flex', background: 'white', padding: '6px', borderRadius: '30px', marginBottom: '32px' }}>
          <button 
            type="button"
            onClick={() => { setIsLoginMode(false); setError(''); }}
            style={{ flex: 1, padding: '12px', borderRadius: '24px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: !isLoginMode ? 'var(--color-banyan)' : 'transparent', color: !isLoginMode ? 'white' : 'var(--color-ink)' }}
          >
            {t('login_btn_signup')}
          </button>
          <button 
            type="button"
            onClick={() => { setIsLoginMode(true); setError(''); }}
            style={{ flex: 1, padding: '12px', borderRadius: '24px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: isLoginMode ? 'var(--color-banyan)' : 'transparent', color: isLoginMode ? 'white' : 'var(--color-ink)' }}
          >
            {t('login_btn_login')}
          </button>
        </div>

        <h2 className="display" style={{ fontSize: '28px', color: 'var(--color-banyan-deep)', marginBottom: '24px', textAlign: 'center' }}>
          {isLoginMode ? t('login_title_login') : t('login_title_signup')}
        </h2>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('login_name')} style={inputStyle} />
          )}
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('login_email')} style={inputStyle} />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={t('login_password')} style={inputStyle} />
          {!isLoginMode && (
            <input type="password" name="confirm" value={formData.confirm} onChange={handleChange} placeholder={t('login_confirm_password')} style={inputStyle} />
          )}

          <button type="submit" className="btn" style={{ width: '100%', background: 'var(--color-banyan)', color: 'white', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 700, marginTop: '8px', border: 'none', cursor: 'pointer' }}>
            {isLoginMode ? t('login_btn_login') : t('login_btn_signup')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={handleToggle} style={{ background: 'transparent', border: 'none', color: 'var(--color-ink)', opacity: 0.7, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
            {isLoginMode ? t('login_switch_to_signup') : t('login_switch_to_login')}
          </button>
        </div>

      </div>
    </div>
  );
}
