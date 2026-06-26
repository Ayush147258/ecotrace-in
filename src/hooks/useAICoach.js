import { useState } from 'react';
import { getRuleBasedTips } from '../utils/indiaRules';

export const useAICoach = () => {
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState([]);
  const [provider, setProvider] = useState('');

  const fetchWithTimeout = async (url, options, timeout = 15000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  };

  const getAITips = async (emissions, city, state, score) => {
    setLoading(true);

    try {
      const res = await fetchWithTimeout('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emissions, city, state, score })
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tips) && data.tips.length >= 3) {
          setTips(data.tips.slice(0, 3));
          setProvider(data.provider || 'AI Coach');
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error('AI fetch failed, using fallback', e);
    }

    const fallbackTips = getRuleBasedTips(emissions);
    setTips(fallbackTips);
    setProvider('AI Rules Fallback');
    setLoading(false);
  };

  return { tips, loading, provider, getAITips };
};
