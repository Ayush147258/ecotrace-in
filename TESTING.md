# Testing Guide — EcoTrace India

## Run tests

```bash
npm test          # watch mode
npm run test:run  # single run (CI)
npm run test:coverage
npm run lint
```

## Coverage targets

| Area | What's tested |
|------|---------------|
| `calculateEmissions` | Quiz string → numeric mapping, no NaN |
| `calculateEcoScore` | Score bounds, grades, percentiles |
| `auth` + `sanitize` | Signup/login, XSS sanitization, rate limiting |
| `quizMapping` | All India-specific quiz value parsers |
| Components | Nav, Dashboard, Landing, Login accessibility |
| `i18n` | EN/HI key parity |

## Stack

- **Vitest** — unit & integration tests
- **Testing Library** — component tests with accessibility queries
- **jsdom** — browser environment

## Problem statement alignment

Tests verify the core challenge requirements:

1. India-specific emission calculation (LPG, two-wheeler, diet)
2. EcoScore gamification (0–1000, no demotivating F grade)
3. Bilingual UI string completeness
4. Auth security (hashing, sanitization, rate limits)
