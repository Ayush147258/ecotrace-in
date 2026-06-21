import { useLang } from '../hooks/useLang';

export default function SkipLink() {
  const { t } = useLang();

  return (
    <a href="#main-content" className="skip-link">
      {t('a11y_skip_to_main')}
    </a>
  );
}
