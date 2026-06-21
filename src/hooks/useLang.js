import { useState, useEffect } from 'react';
import { strings } from '../utils/i18n';

const getInitialLang = () => {
  try {
    return localStorage.getItem('ecotrace_lang') === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
};

export const useLang = () => {
  const [lang, setLangState] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  }, [lang]);

  const setLang = (newLang) => {
    localStorage.setItem('ecotrace_lang', newLang);
    setLangState(newLang);
    // Force a reload to cleanly propagate the translation string context across the router without needing complex React Context
    window.location.reload(); 
  };

  const t = (key) => {
    // Current lang dictionary
    const dictionary = strings[lang] || strings['en'];
    
    if (dictionary[key]) {
      return dictionary[key];
    }
    
    // Fallback to English if missing in Hindi
    if (lang !== 'en' && strings['en'][key]) {
      return strings['en'][key];
    }
    
    // Ultimate fallback, return the raw key so devs can see what's missing
    return key;
  };

  return { lang, setLang, t };
};
