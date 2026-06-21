import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Nav from '../Nav';

describe('Nav', () => {
  it('renders brand on public view', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );
    expect(screen.getByText('EcoTrace India')).toBeInTheDocument();
  });

  it('shows navigation links when user is logged in', () => {
    localStorage.setItem('ecotrace_current_user', JSON.stringify({ id: 'u1', name: 'Test User' }));
    localStorage.setItem('ecotrace_quiz_completed_u1', 'true');
    localStorage.setItem('ecotrace_quiz_u1', JSON.stringify({ name: 'Test' }));

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Nav />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn' })).toBeInTheDocument();
  });

  it('has accessible language toggle button', async () => {
    const reloadMock = vi.fn();
    vi.stubGlobal('location', { ...window.location, reload: reloadMock });
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );
    const langBtn = screen.getByRole('button', { name: /switch language/i });
    expect(langBtn).toBeInTheDocument();
    await user.click(langBtn);
    vi.unstubAllGlobals();
  });
});
