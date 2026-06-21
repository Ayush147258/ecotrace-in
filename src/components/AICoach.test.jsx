import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AICoach from './AICoach';

// Mock useLang hook
vi.mock('../hooks/useLang', () => ({
  useLang: () => ({
    t: (key) => key,
  }),
}));

// Mock useAICoach hook
const mockGetAITips = vi.fn();
vi.mock('../hooks/useAICoach', () => ({
  useAICoach: () => ({
    tips: [
      { text: 'Mock tip 1', co2: 10, money: 100 },
      { text: 'Mock tip 2', co2: 0, money: 50 },
    ],
    loading: false,
    provider: 'Mock AI',
    getAITips: mockGetAITips,
  }),
}));

describe('AICoach Component', () => {
  it('renders fake tips correctly', () => {
    const emissions = {
      transport: 10,
      food: 20,
      energy: 30,
      shopping: 40,
      waste: 10,
      total: 110,
      money_saved_vs_avg: 500,
    };

    const ecoScore = {
      score: 850,
    };

    render(
      <AICoach
        emissions={emissions}
        ecoScore={ecoScore}
        userName="Rahul"
        city="Mumbai"
        state="MH"
      />
    );

    // Verify title
    expect(screen.getByText('dash_coach_title')).toBeInTheDocument();

    // Verify provider tag
    expect(screen.getByText('Mock AI')).toBeInTheDocument();

    // Verify tips
    expect(screen.getByText('Mock tip 1')).toBeInTheDocument();
    expect(screen.getByText('Mock tip 2')).toBeInTheDocument();
    
    // Verify co2 and money badges
    expect(screen.getByText('−10 kg CO₂/mo')).toBeInTheDocument();
    expect(screen.getByText('₹100 saved')).toBeInTheDocument();
    expect(screen.getByText('₹50 saved')).toBeInTheDocument();

    // Verify getAITips is called on mount
    expect(mockGetAITips).toHaveBeenCalledWith(emissions, 'Mumbai', 'MH', 850);
  });
});
