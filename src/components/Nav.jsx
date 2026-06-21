import { Link, useLocation } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { useLang } from '../hooks/useLang';
import { getCurrentUser } from '../utils/auth';
import { useState, useEffect, useRef } from 'react';

export default function Nav() {
  const { getQuizData, logout } = useStorage();
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const user = getCurrentUser();
  const hasData = !!getQuizData();
  const menuRef = useRef(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleLang = () => setLang(lang === 'en' ? 'hi' : 'en');

  const LangToggle = () => (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggleLang}
      aria-label={t('a11y_lang_toggle')}
    >
      {lang === 'en' ? 'EN / हिं' : 'हिं / EN'}
    </button>
  );

  if (!user) {
    return (
      <nav className="nav" aria-label={t('a11y_main_nav')}>
        <Link to="/" className="brand">EcoTrace India</Link>
        <div />
        <div className="nav-right">
          <LangToggle />
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
      <nav className="nav" aria-label={t('a11y_main_nav')}>
        <Link to={hasData ? '/dashboard' : '/'} className="brand">EcoTrace India</Link>

        <div className="nav-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              aria-current={location.pathname === link.path ? 'page' : undefined}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <LangToggle />

          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              type="button"
              className="avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label={t('a11y_user_menu')}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {getInitials(user.name)}
            </button>

            {dropdownOpen && (
              <div
                role="menu"
                aria-label={t('a11y_user_menu')}
                style={{
                  position: 'absolute', top: '48px', right: 0,
                  background: 'white', border: '1px solid var(--color-line)',
                  borderRadius: '12px', padding: '8px', width: '140px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100,
                }}
              >
                <button
                  type="button"
                  role="menuitem"
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
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t('a11y_close_menu') : t('a11y_open_menu')}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span className="sr-only">{mobileMenuOpen ? t('a11y_close_menu') : t('a11y_open_menu')}</span>
            <span aria-hidden="true" className="hamburger-line" />
            <span aria-hidden="true" className="hamburger-line" />
            <span aria-hidden="true" className="hamburger-line" />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="navigation"
          aria-label={t('a11y_main_nav')}
          className="mobile-nav-panel"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={location.pathname === link.path ? 'page' : undefined}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
