import { Link, useLocation } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { useLang } from '../hooks/useLang';
import { getCurrentUser } from '../utils/auth';
import { useState } from 'react';

export default function Nav() {
  const { getQuizData, logout } = useStorage();
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const user = getCurrentUser();
  const hasData = !!getQuizData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) {
    return (
      <nav className="nav">
        <Link to="/" className="brand">EcoTrace India</Link>
        <div />
        <div className="nav-right">
          <div className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>
            {lang === 'en' ? 'EN / हिं' : 'हिं / EN'}
          </div>
        </div>
      </nav>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'GU';
    return name.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { path: '/dashboard', label: t('nav_dashboard') },
    { path: '/challenges', label: t('nav_challenges') },
    { path: '/progress', label: t('nav_progress') },
    { path: '/learn', label: t('nav_learn') },
  ];

  return (
    <>
      <nav className="nav">
        <Link to={hasData ? '/dashboard' : '/'} className="brand">EcoTrace India</Link>

        <div className="nav-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <div className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>
            {lang === 'en' ? 'EN / हिं' : 'हिं / EN'}
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className="avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: 'pointer' }}
            >
              {getInitials(user.name)}
            </div>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: '48px', right: 0,
                background: 'white', border: '1px solid var(--color-line)',
                borderRadius: '12px', padding: '8px', width: '140px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100,
              }}>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  style={{
                    width: '100%', padding: '10px 12px', textAlign: 'left',
                    background: 'transparent', border: 'none',
                    color: 'var(--color-marigold)', fontWeight: 600,
                    cursor: 'pointer', borderRadius: '8px', fontSize: '14px',
                  }}
                >
                  {t('nav_logout')}
                </button>
              </div>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            style={{ display: 'none', background: 'transparent', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: '5px', padding: '4px' }}
          >
            <div style={{ width: '22px', height: '2px', background: 'var(--color-ink)', borderRadius: '2px' }} />
            <div style={{ width: '22px', height: '2px', background: 'var(--color-ink)', borderRadius: '2px' }} />
            <div style={{ width: '22px', height: '2px', background: 'var(--color-ink)', borderRadius: '2px' }} />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: '58px', left: 0, right: 0,
          background: 'rgba(247, 243, 233, 0.97)', backdropFilter: 'blur(12px)',
          zIndex: 99, padding: '16px 20px',
          borderBottom: '1px solid var(--color-line)',
          display: 'flex', flexDirection: 'column', gap: '4px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              style={{ padding: '12px 16px', fontSize: '16px' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
