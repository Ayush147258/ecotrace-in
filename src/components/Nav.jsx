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

  // If no user is logged in, only show the logo (and lang toggle)
  if (!user) {
    return (
      <nav className="nav">
        <Link to="/" className="brand">EcoTrace India</Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} style={{ cursor: 'pointer', fontWeight: 600, opacity: 0.8 }}>
            {lang === 'en' ? 'EN / हिं' : 'हिं / EN'}
          </div>
        </div>
      </nav>
    );
  }

  // Get Avatar Initials
  const getInitials = (name) => {
    if (!name) return "G";
    return name.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { path: '/dashboard', label: t('nav_dashboard') },
    { path: '/challenges', label: t('nav_challenges') },
    { path: '/progress', label: t('nav_progress') },
    { path: '/learn', label: t('nav_learn') }
  ];

  return (
    <>
      <nav className="nav">
        <Link to={hasData ? "/dashboard" : "/"} className="brand">EcoTrace India</Link>
        
        <div className="nav-tabs desktop-tabs" style={{ display: 'flex', gap: '8px' }}>
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} style={{ cursor: 'pointer', fontWeight: 600, opacity: 0.8 }}>
            {lang === 'en' ? 'EN / हिं' : 'हिं / EN'}
          </div>
          
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-banyan)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
            >
              {getInitials(user.name)}
            </div>
            
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: '48px', right: '0', background: 'white', border: '1px solid var(--color-line)', borderRadius: '12px', padding: '8px', width: '120px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100 }}>
                <button 
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  style={{ width: '100%', padding: '8px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--color-marigold)', fontWeight: 600, cursor: 'pointer', borderRadius: '6px' }}
                >
                  {t('nav_logout')}
                </button>
              </div>
            )}
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', background: 'transparent', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: '5px' }}
          >
            <div style={{ width: '24px', height: '2px', background: 'var(--color-ink)', transition: 'all 0.3s' }}></div>
            <div style={{ width: '24px', height: '2px', background: 'var(--color-ink)', transition: 'all 0.3s' }}></div>
            <div style={{ width: '24px', height: '2px', background: 'var(--color-ink)', transition: 'all 0.3s' }}></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: '70px', left: 0, right: 0, background: 'rgba(247, 243, 233, 0.95)', backdropFilter: 'blur(10px)', zIndex: 99, padding: '20px', borderBottom: '1px solid var(--color-line)', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '12px 16px', borderRadius: '12px', background: location.pathname === link.path ? 'var(--color-paper-2)' : 'transparent', color: 'var(--color-ink)', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
