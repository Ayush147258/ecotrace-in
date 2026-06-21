import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export function renderWithRouter(ui, { route = '/' } = {}) {
  window.history.pushState({}, '', route);
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}
