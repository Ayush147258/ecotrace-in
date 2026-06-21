import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/utils/calculateEmissions.js',
        'src/utils/calculateEcoScore.js',
        'src/utils/quizMapping.js',
        'src/utils/formatters.js',
        'src/utils/sanitize.js',
        'src/utils/emissionFactors.js',
        'src/utils/indiaRules.js',
        'src/utils/auth.js',
      ],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 65,
        statements: 75,
      },
    },
  },
});
