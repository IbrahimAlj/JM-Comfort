import "@testing-library/jest-dom/jest-globals";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

const renderNavbar = (route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Navbar />
    </MemoryRouter>
  );
};

describe('Navbar', () => {
  test('renders all navigation links', () => {
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Request Quote')).toBeInTheDocument();
  });

  test('Home link is active on / route', () => {
    renderNavbar('/');
    const homeLink = screen.getByText('Home');
    expect(homeLink).toHaveStyle('background-color: #f3f4f6');
    expect(homeLink).toHaveStyle('border: 2px solid #000000');
  });

  test('Services link is active on /services route', () => {
    renderNavbar('/services');
    const servicesLink = screen.getByText('Services');
    expect(servicesLink).toHaveStyle('background-color: #f3f4f6');
  });

  test('non-active links have transparent border', () => {
    renderNavbar('/');
    const servicesLink = screen.getByText('Services');
    expect(servicesLink).toHaveStyle('border: 2px solid transparent');
  });

  test('all links point to correct routes', () => {
    renderNavbar();
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Services').closest('a')).toHaveAttribute('href', '/services');
    expect(screen.getByText('Reviews').closest('a')).toHaveAttribute('href', '/reviews');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Gallery').closest('a')).toHaveAttribute('href', '/gallery');
    expect(screen.getByText('Request Quote').closest('a')).toHaveAttribute('href', '/request-quote');
  });
});
