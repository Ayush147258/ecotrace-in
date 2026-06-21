import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';
import LoginPage from '../LoginPage';

describe('accessibility', () => {
  it('landing page has a single h1 and labeled CTAs', () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('a[href="/login"]')).toBeTruthy();
  });

  it('login page associates labels with inputs', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    expect(email?.labels.length).toBeGreaterThan(0);
    expect(password?.labels.length).toBeGreaterThan(0);
    expect(email?.getAttribute('autocomplete')).toBe('email');
  });

  it('login error region uses role alert', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    await user.click(screen.getByRole('button', { name: /^Log In$/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
