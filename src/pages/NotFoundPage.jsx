import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import { useLang } from '../hooks/useLang';
import { getCurrentUser } from '../utils/auth';

export default function NotFoundPage() {
  const { t } = useLang();
  const user = getCurrentUser();

  return (
    <div className="shell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      
      <div style={{ background: 'var(--color-paper-2)', padding: '32px', borderRadius: '50%', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MapPinOff size={64} color="var(--color-ink)" opacity={0.6} />
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-banyan-deep)', marginBottom: '16px' }}>
        {t('notfound_title')}
      </h1>
      
      <p style={{ fontSize: '18px', color: 'var(--color-ink)', opacity: 0.8, maxWidth: '400px', marginBottom: '32px', lineHeight: 1.5 }}>
        {t('notfound_desc')}
      </p>

      {user ? (
        <Link 
          to="/dashboard" 
          className="btn-primary" 
          style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '30px' }}
        >
          {t('notfound_btn_dash')}
        </Link>
      ) : (
        <Link 
          to="/" 
          className="btn-primary" 
          style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '30px' }}
        >
          {t('notfound_btn_home')}
        </Link>
      )}

    </div>
  );
}
