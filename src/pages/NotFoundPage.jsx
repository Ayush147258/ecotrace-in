import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import { useLang } from '../hooks/useLang';
import { getCurrentUser } from '../utils/auth';

export default function NotFoundPage() {
  const { t } = useLang();
  const user = getCurrentUser();

  return (
    <div className="shell flex flex-col items-center justify-center min-h-[80vh] text-center">
      
      <div className="bg-[var(--color-paper-2)] p-8 rounded-full mb-6 flex items-center justify-center">
        <MapPinOff size={64} color="var(--color-ink)" opacity={0.6} aria-hidden="true" />
      </div>

      <h1 className="text-[32px] font-extrabold text-[var(--color-banyan-deep)] mb-4">
        {t('notfound_title')}
      </h1>
      
      <p className="text-lg text-[var(--color-ink)] opacity-80 max-w-[400px] mb-8 leading-relaxed">
        {t('notfound_desc')}
      </p>

      {user ? (
        <Link 
          to="/dashboard" 
          className="btn-primary px-8 py-[14px] text-base rounded-[30px]"
        >
          {t('notfound_btn_dash')}
        </Link>
      ) : (
        <Link 
          to="/" 
          className="btn-primary px-8 py-[14px] text-base rounded-[30px]"
        >
          {t('notfound_btn_home')}
        </Link>
      )}

    </div>
  );
}
