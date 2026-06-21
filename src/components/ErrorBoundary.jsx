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
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[var(--color-paper-1)] p-5">
          
          <div className="bg-[#fef2f2] p-6 rounded-full mb-6 flex items-center justify-center">
            <AlertOctagon size={48} color="#dc2626" aria-hidden="true" />
          </div>

          <h1 className="text-[28px] font-extrabold text-[var(--color-ink)] mb-4">
            {t('error_title')}
          </h1>
          
          <p className="text-base text-[var(--color-ink)] opacity-80 max-w-[400px] mb-8 leading-relaxed">
            {t('error_desc')}
          </p>

          <button 
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-3 text-[15px] rounded-[30px]" 
          >
            {t('error_btn_refresh')}
          </button>
          
          {/* Subtle error detail logging for debugging */}
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-10 p-4 bg-[#f8fafc] rounded-lg text-xs text-red-600 max-w-[80%] overflow-x-auto text-left">
              {this.state.error?.toString()}
            </pre>
          )}

        </div>
      );
    }

    return this.props.children; 
  }
}
