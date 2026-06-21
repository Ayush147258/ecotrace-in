
<p align="center">
  <img src="./banner.svg" alt="EcoTrace India banner" width="100%">
</p>

<p align="center">
  <img alt="Built with React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white&style=flat-square">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss&logoColor=white&style=flat-square">
  <img alt="Infra cost" src="https://img.shields.io/badge/Infra%20cost-%E2%82%B90-green?style=flat-square">
  <img alt="Languages" src="https://img.shields.io/badge/Languages-Hindi%20%2F%20English-orange?style=flat-square">
  <img alt="Deployed on Vercel" src="https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel&logoColor=white&style=flat-square">
</p>

# 🌿 EcoTrace India
### India's first carbon footprint tracker built for Indian lives — not Western defaults.

**Live App:** [https://ecotrace-in.vercel.app](https://ecotrace-in.vercel.app)
**Built for:** PromptWars Virtual — Main Challenge 3 (Carbon Footprint Awareness Platform)
**Author:** Ayush Kumar

---

## 📑 Table of Contents

- [The Problem](#-the-problem)
- [Why This Should Rank #1](#-why-this-should-rank-1)
- [Core Features](#-core-features)
- [Architecture](#️-architecture)
- [Tech Stack](#-tech-stack)
- [India Emission Factors Used](#-india-emission-factors-used)
- [Running Locally](#-running-locally)
- [Screenshots](#-screenshots)
- [What's Next](#-whats-next-roadmap)
- [Submission Links](#-submission-links)

---

## 📌 The Problem

Every existing carbon tracker is built for the West — "miles driven by car," "gas bill in dollars," "flights per year." None of that maps to how most Indians actually live: two-wheelers and auto-rickshaws, LPG cylinders instead of gas mains, dal-rice diets, and metro/local trains instead of personal cars.

**EcoTrace India fixes that.** Every input, every benchmark, every tip is built around how India actually consumes energy — and wrapped in enough gamification that people actually come back daily instead of calculating their footprint once and forgetting about it.

---

## ✨ Why This Should Rank #1

| What other submissions will likely build | What EcoTrace India builds |
|---|---|
| Generic inputs (car, gas bill, flights) | India-specific: two-wheeler, auto-rickshaw, LPG cylinders, dal-rice diet, metro |
| Benchmark vs. global average (6.3t/yr) | Benchmark vs. **India's actual average (2.6t/yr)** + state-level percentile |
| No AI, or one fragile API call | **3-tier AI fallback** (Gemini → Groq → OpenRouter → rule-based) — never goes down, costs ₹0 |
| A footprint number and nothing else | **EcoScore (0–1000)** — an emotional, shareable "credit score for the planet" |
| One-time use, no reason to return | Weekly challenges + daily streaks — a habit loop, not a calculator |
| CO₂ savings only | Every tip shows **₹ saved alongside CO₂ saved** — makes it personally relevant |
| English-only | Full **Hindi/English toggle**, every string translated |
| No accounts, data lost on browser clear | Real signup/login + guest mode, data namespaced per user |

---

## 🧩 Core Features

### 1. India-First Onboarding Quiz
A 5-step quiz that actually reflects Indian life:
- **Transport:** petrol bike, CNG scooter, auto-rickshaw, car (petrol/CNG), metro/local train, MSRTC/KSRTC bus, or work-from-home
- **Food:** pure veg, veg + eggs, non-veg light/heavy, eating-out frequency
- **Energy:** LPG cylinders/month, electricity units (kWh), AC hours/day, inverter usage
- **Shopping & Waste:** online orders/month, new clothes/month, waste segregation habits

Includes Back navigation with zero data loss, and 3 example presets (City Commuter, Farmer, Student) to fill the quiz instantly for demo purposes.

### 2. EcoScore Dashboard (0–1000)
A single emotional number, like a credit score for your carbon impact:
- Grade (A+ to F) and a named level ("Green Hero," "Eco Champion," etc.)
- Percentile ranking — "better than 71% of users in your state"
- Full 5-category breakdown (Transport / Food / Energy / Shopping / Waste) with kg CO₂ and visual comparison against the India average
- Money saved and "trees equivalent" shown alongside the raw CO₂ number, so the impact feels real and not abstract

### 3. AI Eco-Coach — 3-Tier Free Fallback (₹0 infrastructure cost)
Sends the user's real emission breakdown to AI and returns 3 hyper-specific, India-relevant tips (e.g. *"Switching to induction for lunch in Patna saves ₹380 and 18kg CO₂/month"*).

```
Primary    → Gemini 2.0 Flash       (1,500 free requests/day)
Fallback 1 → Groq Llama-3.3-70b     (14,400 free requests/day)
Fallback 2 → OpenRouter free models (Mistral 7B / Qwen 2.5)
Final      → Rule-based tip engine  (50 pre-written India-specific tips, always works)
```
The app **never** shows an error to the user — it always returns useful, personalized guidance, and the AI provider in use is shown transparently in the UI.

### 4. Weekly Challenges + Streaks
21 rotating India-specific challenges (7 active per week), each with a real CO₂ and ₹ impact:
- *"Skip the auto today — walk or cycle"* → 1.2kg CO₂, ₹80 saved
- *"Cook one extra meal at home"* → 0.8kg CO₂, ₹150 saved
- *"Skip one online order this week"* → 3.5kg CO₂, ₹200 saved

Daily streak counter (current + longest) creates a Duolingo-style habit loop instead of a one-time calculation tool.

### 5. Progress Timeline + One-Tap Daily Log
- 6-month trend chart comparing the user's emissions against the India average line
- Monthly ₹ saved bar chart
- A 3-tap daily log (Transport today? / Food today? / Anything extra?) that takes under 10 seconds and feeds directly into the streak system

### 6. Real Accounts (Not Just a Demo)
- Full sign-up/login with client-side validation and SHA-256 password hashing
- "Continue as Guest" mode for instant, no-friction access
- All data — quiz answers, history, streaks, challenges — is namespaced per user, so multiple accounts on one device never collide
- Transparent about its limits: data is stored on-device (localStorage), and the UI says so honestly rather than overselling security it doesn't have

### 7. Hindi / English Toggle
Every page — landing, quiz, dashboard, challenges, progress, learn — fully translated. The toggle persists across navigation and requires no page reload.

### 8. Learn Page
Plain-language education on what a carbon footprint actually is, India-specific stats (2.6t vs. global 6.3t/yr average), how the EcoScore algorithm works, and an FAQ covering the honest answer to *"why don't you auto-track my activity?"*

---

## 🏗️ Architecture

```
User fills India-first quiz (transport / food / energy / shopping)
          │
          ▼
┌──────────────────────────────────────────────────────┐
│  TIER 1 — Emission Calculator (zero API cost)        │
│  India-specific emission factors                     │
│  LPG cylinders, two-wheelers, dal-rice diet, metro    │
└────────────────────┬───────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────┐
│  TIER 2 — EcoScore Engine (deterministic, 0–1000)     │
│  Benchmarked against India's real national average    │
└────────────────────┬───────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────┐
│  TIER 3 — AI Eco-Coach (3-layer free fallback)         │
│  Gemini → Groq → OpenRouter → rule-based tips          │
└────────────────────┬───────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────┐
│  TIER 4 — Gamification Engine                          │
│  Weekly challenges, streaks, daily log, progress chart │
└──────────────────────────────────────────────────────┘
                     │
                     ▼
       localStorage (namespaced per user account)
```

---

## 🧰 Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router (with auth + quiz-completion route guards) |
| AI Primary | Gemini 2.0 Flash (free tier) |
| AI Fallback 1 | Groq — Llama 3.3-70b (free tier) |
| AI Fallback 2 | OpenRouter — free community models |
| Auth | Client-side, SHA-256 hashed, localStorage-backed |
| Storage | Browser localStorage, namespaced per user |
| Deployment | Vercel |

**Total infrastructure cost: ₹0** — every API used sits comfortably inside its free tier, and the app gracefully degrades to deterministic logic if every API is unreachable.

---

## 🇮🇳 India Emission Factors Used

```js
transport: {
  petrol_bike: 0.089, auto_rickshaw: 0.104, car_petrol: 0.171,
  metro: 0.012, bus_local: 0.027, train_intercity: 0.008,
  domestic_flight: 0.255   // kg CO2 per km
}
food: {
  pure_veg: 0.5, nonveg_light: 1.2, nonveg_heavy: 2.5,
  eating_out_daily: 1.8    // kg CO2 per day
}
energy: {
  lpg_cylinder: 11.7,      // kg CO2 per cylinder
  electricity_kwh: 0.82    // India grid emission factor (CEA, 2024)
}
```
Benchmarked against India's national average of **216 kg CO₂/month (2.6 tonnes/year)** — not the global average most trackers default to.

---

## 🚀 Running Locally

```bash
git clone https://github.com/Ayush147258/ecotrace-india.git
cd ecotrace-india
npm install

# Add your free API keys to .env (see .env.example)
cp .env.example .env

npm run dev
npm test          # run unit & component tests
npm run test:coverage
npm run lint
```

See [TESTING.md](./TESTING.md) for full test documentation.

### Environment Variables (all free tiers, no credit card required)

| Variable | Where to get it |
|---|---|
| `VITE_GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `VITE_GROQ_API_KEY` | [console.groq.com](https://console.groq.com) |
| `VITE_OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai) |

---

## 📸 Screenshots

> *Add 3–4 screenshots here before submitting: Landing page, EcoScore dashboard, AI Coach panel, Challenges page. Visual proof matters more than text for judges skimming fast — this is the single highest-leverage thing left to do in this README.*

```markdown
<p align="center">
  <img src="./screenshots/englishdasboard.png" width="48%">
  <img src="./screenshots/hindi_dashboard.png" width="48%">
</p>
```

---

## 🔮 What's Next (Roadmap)

- WhatsApp bot for daily logging (India's most-used messaging app)
- Bank/UPI transaction parsing for automatic shopping footprint estimation
- Community leaderboards by city/state
- Integration with India's smart electricity meter APIs where available

---

## 🏆 Submission Links

- **Source Code:** [https://github.com/Ayush147258/ecotrace-india](https://github.com/Ayush147258/ecotrace-india)
- **Live Application:** [https://ecotrace-in.vercel.app](https://ecotrace-in.vercel.app)
- **LinkedIn Post:** [PromptWars submission](https://www.linkedin.com/posts/ayush-kumar-2452a2346_promptwars-hackathon-climatetech-ugcPost-7474346613906513922-s-1d/)

---

*Built for PromptWars Virtual — Main Challenge 3: Carbon Footprint Awareness Platform.*