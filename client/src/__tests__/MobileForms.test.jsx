import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import ContactForm from "../components/ContactForm";
import RequestQuote from "../pages/RequestQuote";

jest.mock("../components/Navbar", () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock("../components/PageMeta", () => {
  return function MockPageMeta() {
    return null;
  };
});

jest.mock("../utils/captureError", () => ({
  captureError: jest.fn(),
}));

jest.mock("../utils/analytics", () => ({
  trackEvent: jest.fn(),
}));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ slots: [] }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("ContactForm", () => {
  test("renders all form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  test("renders submit button", () => {
    render(<ContactForm />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });
});

describe("RequestQuote", () => {
  test("renders all form fields", () => {
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
  });

  test("renders submit button", () => {
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    expect(
      screen.getByRole("button", { name: /submit quote request/i })
    ).toBeInTheDocument();
  });
});
