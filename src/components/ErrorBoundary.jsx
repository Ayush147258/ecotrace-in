import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { strings } from '../utils/i18n';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service or just console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Determine language manually since we can't use useLang hook in a class component
      const lang = localStorage.getItem('ecotrace_lang') || 'en';
      const t = (key) => {
        return strings[lang]?.[key] || strings.en[key] || key;
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', background: 'var(--color-paper-1)', padding: '20px' }}>
          
          <div style={{ background: '#fef2f2', padding: '24px', borderRadius: '50%', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertOctagon size={48} color="#dc2626" />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ink)', marginBottom: '16px' }}>
            {t('error_title')}
          </h1>
          
          <p style={{ fontSize: '16px', color: 'var(--color-ink)', opacity: 0.8, maxWidth: '400px', marginBottom: '32px', lineHeight: 1.5 }}>
            {t('error_desc')}
          </p>

          <button 
            onClick={() => window.location.reload()}
            className="btn-primary" 
            style={{ padding: '12px 24px', fontSize: '15px', borderRadius: '30px' }}
          >
            {t('error_btn_refresh')}
          </button>
          
          {/* Subtle error detail logging for debugging */}
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ marginTop: '40px', padding: '16px', background: '#f8fafc', borderRadius: '8px', fontSize: '12px', color: '#dc2626', maxWidth: '80%', overflowX: 'auto', textAlign: 'left' }}>
              {this.state.error?.toString()}
            </pre>
          )}

        </div>
      );
    }

    return this.props.children; 
  }
}
