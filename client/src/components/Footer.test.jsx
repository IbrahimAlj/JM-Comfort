/**
 * Footer snapshot test — JMHABIBI-236
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
    expect(getByText('Login')).toBeTruthy();
  });
});
