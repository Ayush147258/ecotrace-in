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

    const highestCat = Object.entries(emissions || {})
      .filter(([k]) => ['transport', 'food', 'energy', 'shopping', 'waste'].includes(k))
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'transport';

    const systemPrompt = `You are an eco coach helping Indians reduce carbon footprint.
Give 3 specific, actionable tips in simple English.
Always mention ₹ savings alongside CO2 savings.
Be specific to India: LPG, two-wheelers, local markets.
Each tip max 2 sentences. 
Return ONLY a valid JSON array of 3 objects with this exact structure:
[
  { "text": "tip text here", "co2": 18, "money": 380 }
]
Do not include markdown blocks like \`\`\`json. Return just the raw JSON.`;

    const userPrompt = `My monthly emissions: Transport ${Math.round(emissions?.transport || 0)}kg, Food ${Math.round(emissions?.food || 0)}kg, Energy ${Math.round(emissions?.energy || 0)}kg. I live in ${city || 'India'}, ${state || ''}. My highest category is ${highestCat}. Current EcoScore: ${score}/1000.`;

    try {
      // TIER 1 — Gemini
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (geminiKey && geminiKey !== 'your_gemini_key_from_aistudio.google.com') {
        const res = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt + '\\n\\n' + userPrompt }] }],
            generationConfig: { maxOutputTokens: 400, temperature: 0.7 }
          })
        });
        if (res.ok) {
          const data = await res.json();
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            setTips(parsed.slice(0, 3));
            setProvider('Gemini');
            setLoading(false);
            return;
          }
        }
      }

      // TIER 2 — Groq
      const groqKey = import.meta.env.VITE_GROQ_API_KEY;
      if (groqKey && groqKey !== 'your_groq_key_from_console.groq.com') {
        const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7
          })
        });
        if (res.ok) {
          const data = await res.json();
          let text = data.choices?.[0]?.message?.content || '';
          text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            setTips(parsed.slice(0, 3));
            setProvider('Groq');
            setLoading(false);
            return;
          }
        }
      }

      // TIER 3 — OpenRouter
      const orKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (orKey && orKey !== 'your_key_from_openrouter.ai') {
        const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${orKey}`
          },
          body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ]
          })
        });
        if (res.ok) {
          const data = await res.json();
          let text = data.choices?.[0]?.message?.content || '';
          text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            setTips(parsed.slice(0, 3));
            setProvider('OpenRouter');
            setLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.error('AI fetch failed, using fallback', e);
    }

    // TIER 4 — Fallback Rules
    const fallbackTips = getRuleBasedTips(emissions);
    setTips(fallbackTips);
    setProvider('AI Rules Fallback');
    setLoading(false);
  };

  return { tips, loading, provider, getAITips };
};
