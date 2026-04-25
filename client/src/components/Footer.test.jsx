/**
 * Footer snapshot test — JMHABIBI-236
 *
 * Renders the Footer inside a MemoryRouter (required for the <Link> component)
 * and captures a snapshot. Any unintended structural change to the Footer will
 * cause this test to fail, alerting the developer to review the diff.
 */

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the brand name', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(getByText('JM Comfort')).toBeTruthy();
  });

  it('renders contact phone number', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(getByText('(916) 555-1234')).toBeTruthy();
  });

  it('renders contact email', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(getByText('hello@jmcomfort.example')).toBeTruthy();
  });

  it('renders admin login link', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const adminLink = getByText('Admin');
    expect(adminLink).toBeTruthy();
    expect(adminLink.closest('a').getAttribute('href')).toBe('/admin/login');
  });
});
