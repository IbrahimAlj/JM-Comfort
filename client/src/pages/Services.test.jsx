/**
 * JMHABIBI-230 — Jest tests for Services page quote CTA
 *
 * Verifies each service card renders a "Get a quote" link whose href points
 * to /quote with the correct service name query param.
 */

import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Services from './Services';

jest.mock('../components/Navbar', () => () => <nav data-testid="navbar" />);
jest.mock('../components/PageMeta', () => () => null);

const mockServices = [
  { id: 1, title: 'Installation', description: 'Install', is_active: true },
  { id: 2, title: 'Repairs', description: 'Repair', is_active: true },
  { id: 3, title: 'Maintenance', description: 'Maintain', is_active: true },
];

function renderServices() {
  return render(
    <MemoryRouter>
      <Services />
    </MemoryRouter>
  );
}

describe('Services page — Get a quote CTA', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockServices,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a "Get a quote" link for every service', async () => {
    const { findAllByRole } = renderServices();
    const ctaLinks = await findAllByRole('link', { name: /get a quote/i });
    expect(ctaLinks.length).toBe(3);
  });

  it('Installation CTA links to /quote?service=Installation', async () => {
    const { findAllByRole } = renderServices();
    const ctaLinks = await findAllByRole('link', { name: /get a quote/i });
    expect(ctaLinks[0].getAttribute('href')).toBe('/quote?service=Installation');
  });

  it('Repairs CTA links to /quote?service=Repairs', async () => {
    const { findAllByRole } = renderServices();
    const ctaLinks = await findAllByRole('link', { name: /get a quote/i });
    expect(ctaLinks[1].getAttribute('href')).toBe('/quote?service=Repairs');
  });

  it('Maintenance CTA links to /quote?service=Maintenance', async () => {
    const { findAllByRole } = renderServices();
    const ctaLinks = await findAllByRole('link', { name: /get a quote/i });
    expect(ctaLinks[2].getAttribute('href')).toBe('/quote?service=Maintenance');
  });

  it('each CTA href contains the correct service name as a query param', async () => {
    const { findAllByRole } = renderServices();
    const ctaLinks = await findAllByRole('link', { name: /get a quote/i });
    const serviceNames = ['Installation', 'Repairs', 'Maintenance'];
    ctaLinks.forEach((link, i) => {
      const href = link.getAttribute('href');
      expect(href).toContain('/quote?service=');
      expect(href).toContain(encodeURIComponent(serviceNames[i]));
    });
  });
});
