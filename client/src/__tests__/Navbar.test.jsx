import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';

function TestApp() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/services" element={<div>Services Page</div>} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/reviews" element={<div>Reviews Page</div>} />
        <Route path="/gallery" element={<div>Gallery Page</div>} />
        <Route path="/request-quote" element={<div>Request Quote Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Navbar mobile menu', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    window.dispatchEvent(new Event('resize'));
  });

  test('hamburger toggles menu open and closed', () => {
    render(<TestApp />);

    const button = screen.getByRole('button', {
      name: /toggle navigation menu/i,
    });

    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('clicking a link closes the menu', () => {
    render(<TestApp />);

    const button = screen.getByRole('button', {
      name: /toggle navigation menu/i,
    });

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByText('About'));
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('menu closes automatically on route change', () => {
    render(<TestApp />);

    const button = screen.getByRole('button', {
      name: /toggle navigation menu/i,
    });

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByText('Services'));
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Services Page')).toBeInTheDocument();
  });
});