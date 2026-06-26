const DEFAULT_TIMEOUT_MS = 15000;

const PROVIDERS = {
  gemini: 'Gemini',
  groq: 'Groq',
  openrouter: 'OpenRouter',
};

function buildPrompts({ emissions = {}, city = 'India', state = '', score = 0 }) {
  const highestCat = Object.entries(emissions)
    .filter(([key]) => ['transport', 'food', 'energy', 'shopping', 'waste'].includes(key))
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'transport';

  const systemPrompt = `You are an eco coach helping Indians reduce carbon footprint.
Give 3 specific, actionable tips in simple English.
Always mention rupee savings alongside CO2 savings.
Be specific to India: LPG, two-wheelers, local markets.
Each tip max 2 sentences.
Return ONLY a valid JSON array of 3 objects with this exact structure:
[
  { "text": "tip text here", "co2": 18, "money": 380 }
]
Do not include markdown blocks like \`\`\`json. Return just the raw JSON.`;

  const userPrompt = `My monthly emissions: Transport ${Math.round(emissions?.transport || 0)}kg, Food ${Math.round(emissions?.food || 0)}kg, Energy ${Math.round(emissions?.energy || 0)}kg. I live in ${city || 'India'}, ${state || ''}. My highest category is ${highestCat}. Current EcoScore: ${score}/1000.`;

  return { systemPrompt, userPrompt };
}

async function fetchWithTimeout(url, options, timeout = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function parseTips(text) {
  const cleaned = String(text || '').replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed) || parsed.length < 3) {
    throw new Error('AI response did not include three tips.');
  }

  return parsed.slice(0, 3).map((tip) => ({
    text: String(tip.text || '').slice(0, 500),
    co2: Number(tip.co2) || 0,
    money: Number(tip.money) || 0,
  }));
}

async function tryGemini(systemPrompt, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
      }),
    },
  );

  if (!response.ok) return null;
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return { tips: parseTips(text), provider: PROVIDERS.gemini };
}

async function tryGroq(systemPrompt, userPrompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return { tips: parseTips(data.choices?.[0]?.message?.content), provider: PROVIDERS.groq };
}

async function tryOpenRouter(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const response = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return { tips: parseTips(data.choices?.[0]?.message?.content), provider: PROVIDERS.openrouter };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emissions, city, state, score } = req.body || {};

    if (!emissions || typeof emissions !== 'object') {
      return res.status(400).json({ error: 'Missing emissions payload' });
    }

    const { systemPrompt, userPrompt } = buildPrompts({ emissions, city, state, score });
    const providers = [tryGemini, tryGroq, tryOpenRouter];

    for (const provider of providers) {
      try {
        const result = await provider(systemPrompt, userPrompt);
        if (result) return res.status(200).json(result);
      } catch (error) {
        console.error('AI provider failed', error);
      }
    }

    return res.status(503).json({ error: 'No AI provider available' });
  } catch (error) {
    console.error('AI coach endpoint failed', error);
    return res.status(500).json({ error: 'AI coach failed' });
  }
}
