import { useState, useEffect } from 'react';
import { strings } from '../utils/i18n';

export const useLang = () => {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('ecotrace_lang');
    if (saved === 'hi') {
      setLangState('hi');
    }
  }, []);

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
