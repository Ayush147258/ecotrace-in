# EcoTrace India

India's first carbon footprint tracker built for Indian lives. 

Live: https://ecotrace-india.vercel.app
Stack: React + Vite + Tailwind + Gemini API + Groq

### What makes it different?
- **India-specific data**: Calculates emissions based on LPG cylinders, two-wheelers, and dal-rice diets, instead of generic western metrics.
- **AI Eco-Coach**: A 3-tier free AI fallback chain (Gemini → Groq → OpenRouter → Rules) provides hyper-personalized tips.
- **Gamification**: EcoScore 0-1000, weekly challenges, and a Duolingo-style daily streak.
- **₹ Savings Hook**: Shows money saved alongside CO2 saved to build real habits.

## Run Locally
\`\`\`bash
npm install
npm run dev
\`\`\`

Set your API keys in \`.env\`:
- \`VITE_GEMINI_API_KEY\`
- \`VITE_GROQ_API_KEY\`
- \`VITE_OPENROUTER_API_KEY\`
