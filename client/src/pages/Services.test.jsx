/**
 * JMHABIBI-230 — Jest tests for Services page Request a Quote CTA
 *
 * Verifies that each service card renders a "Request a Quote" button
 * whose href points to /quote with the correct service name query param.
 */

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Services from './Services';

jest.mock('../components/Navbar', () => () => <nav data-testid="navbar" />);
jest.mock('../components/PageMeta', () => () => null);

function renderServices() {
  return render(
    <MemoryRouter>
      <Services />
    </MemoryRouter>
  );
}

describe('Services page — Request a Quote CTA', () => {
  it('renders a "Request a Quote" button for every service', () => {
    const { getAllByRole } = renderServices();
    const ctaLinks = getAllByRole('link', { name: /request a quote/i });
    // There are 3 services (Installation, Repairs, Maintenance)
    expect(ctaLinks.length).toBe(3);
  });

  it('button text says "Request a Quote"', () => {
    const { getAllByRole } = renderServices();
    const ctaLinks = getAllByRole('link', { name: /request a quote/i });
    ctaLinks.forEach((link) => {
      expect(link.textContent).toBe('Request a Quote');
    });
  });

  it('Installation CTA links to /quote?service=Installation', () => {
    const { getAllByRole } = renderServices();
    const ctaLinks = getAllByRole('link', { name: /request a quote/i });
    expect(ctaLinks[0].getAttribute('href')).toBe('/quote?service=Installation');
  });

  it('Repairs CTA links to /quote?service=Repairs', () => {
    const { getAllByRole } = renderServices();
    const ctaLinks = getAllByRole('link', { name: /request a quote/i });
    expect(ctaLinks[1].getAttribute('href')).toBe('/quote?service=Repairs');
  });

  it('Maintenance CTA links to /quote?service=Maintenance', () => {
    const { getAllByRole } = renderServices();
    const ctaLinks = getAllByRole('link', { name: /request a quote/i });
    expect(ctaLinks[2].getAttribute('href')).toBe('/quote?service=Maintenance');
  });

  it('each CTA href contains the correct service name as a query param', () => {
    const { getAllByRole } = renderServices();
    const ctaLinks = getAllByRole('link', { name: /request a quote/i });
    const serviceNames = ['Installation', 'Repairs', 'Maintenance'];
    ctaLinks.forEach((link, i) => {
      const href = link.getAttribute('href');
      expect(href).toContain('/quote?service=');
      expect(href).toContain(encodeURIComponent(serviceNames[i]));
    });
  });
});
