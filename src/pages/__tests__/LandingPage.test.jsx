import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';

describe('LandingPage', () => {
  it('renders hero and CTA buttons with translated text', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Track your footprint/i);
    expect(screen.getByRole('link', { name: /Get Started Free/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('button', { name: /Try as Guest/i })).toBeInTheDocument();
  });

  it('shows how-it-works steps', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Take the Quiz')).toBeInTheDocument();
    expect(screen.getByText('Get Your EcoScore')).toBeInTheDocument();
  });
});
