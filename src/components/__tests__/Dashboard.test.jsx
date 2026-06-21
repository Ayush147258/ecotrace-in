import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { calculateEmissions } from '../../utils/calculateEmissions';
import { calculateEcoScore } from '../../utils/calculateEcoScore';
import Dashboard from '../Dashboard';
import { sampleQuizAnswers } from '../../test/fixtures.js';

describe('Dashboard', () => {
  const emissions = calculateEmissions(sampleQuizAnswers);
  const ecoScore = calculateEcoScore(emissions);

  it('renders EcoScore without NaN values', () => {
    render(
      <Dashboard
        emissions={emissions}
        ecoScore={ecoScore}
        userName="Ayush"
        city="Lucknow"
        state="Uttar Pradesh"
      />
    );

    expect(screen.getByText(String(ecoScore.score))).toBeInTheDocument();
    expect(screen.queryByText(/NaN/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Transport/i)).toBeInTheDocument();
    expect(screen.getByText(/Grade/i)).toBeInTheDocument();
  });
});
