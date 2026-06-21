import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

// Mock useLang hook
vi.mock('../hooks/useLang', () => ({
  useLang: () => ({
    t: (key) => key,
  }),
}));

describe('Dashboard Component', () => {
  it('renders nothing if emissions or ecoScore is missing', () => {
    const { container } = render(<Dashboard />);
    expect(container.firstChild).toBeNull();
  });

  it('renders user name and eco score', () => {
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
      grade: 'A+',
      level: 'Eco Champion',
      percentile: 88,
      vs_india_avg: -20,
    };

    render(
      <Dashboard
        emissions={emissions}
        ecoScore={ecoScore}
        userName="Rahul"
        city="Mumbai"
        state="MH"
      />
    );

    // Verify User name is displayed
    expect(screen.getByText(/Rahul/)).toBeInTheDocument();
    
    // Verify city is displayed
    expect(screen.getByText(/Mumbai/)).toBeInTheDocument();

    // Verify eco score is displayed
    expect(screen.getByText('850')).toBeInTheDocument();

    // Verify grade is displayed
    expect(screen.getByText(/A\+/)).toBeInTheDocument();

    // Verify percentile is displayed
    expect(screen.getByText(/88%/)).toBeInTheDocument();
  });
});
