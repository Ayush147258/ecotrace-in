import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logIn, signUp } from '../utils/auth';
import { useLang } from '../hooks/useLang';

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;

    if (isLoginMode) {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      setIsSubmitting(true);
      const result = await logIn(formData.email, formData.password);
      setIsSubmitting(false);
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
      if (!formData.email.includes('@')) {
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

      setIsSubmitting(true);
      const result = await signUp(formData.name, formData.email, formData.password);
      setIsSubmitting(false);
      if (result.success) {
        navigate('/quiz');
      } else {
        setError(result.error || 'Email already exists');
      }
    }
  };



  return (
    <div className="shell login-shell">
      <div className="card login-card">
        <div className="login-toggle" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={!isLoginMode}
            onClick={() => { setIsLoginMode(false); setError(''); }}
            className={`login-tab ${!isLoginMode ? 'active' : ''}`}
          >
            {t('login_btn_signup')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isLoginMode}
            onClick={() => { setIsLoginMode(true); setError(''); }}
            className={`login-tab ${isLoginMode ? 'active' : ''}`}
          >
            {t('login_btn_login')}
          </button>
        </div>

        <h1 className="display login-title">
          {isLoginMode ? t('login_title_login') : t('login_title_signup')}
        </h1>

        {error && (
          <div role="alert" aria-live="assertive" className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {!isLoginMode && (
            <div className="form-field">
              <label htmlFor="login-name">{t('login_name')}</label>
              <input
                id="login-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-line)] mb-4 text-base bg-white"
              />
            </div>
          )}
          <div className="form-field">
            <label htmlFor="login-email">{t('login_email')}</label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!error}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-line)] mb-4 text-base bg-white"
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">{t('login_password')}</label>
            <input
              id="login-password"
              type="password"
              name="password"
              autoComplete={isLoginMode ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              aria-invalid={!!error}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-line)] mb-4 text-base bg-white"
            />
          </div>
          {!isLoginMode && (
            <div className="form-field">
              <label htmlFor="login-confirm">{t('login_confirm_password')}</label>
              <input
                id="login-confirm"
                type="password"
                name="confirm"
                autoComplete="new-password"
                required
                minLength={6}
                value={formData.confirm}
                onChange={handleChange}
                aria-invalid={!!error}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-line)] mb-4 text-base bg-white"
              />
            </div>
          )}

          <button type="submit" className="btn-primary login-submit" disabled={isSubmitting}>
            {isSubmitting ? (isLoginMode ? 'Logging in...' : 'Creating account...') : (isLoginMode ? t('login_btn_login') : t('login_btn_signup'))}
          </button>
        </form>

        <div className="login-switch">
          <button type="button" onClick={handleToggle} className="login-switch-btn">
            {isLoginMode ? t('login_switch_to_signup') : t('login_switch_to_login')}
          </button>
        </div>
      </div>
    </div>
  );
}
