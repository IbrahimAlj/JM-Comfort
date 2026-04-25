import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";

const renderNavbar = (route = "/") => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Navbar />
    </MemoryRouter>
  );
};

describe("Navbar", () => {
  test("renders all primary navigation links", () => {
    renderNavbar();
    // Each label may render twice (desktop + mobile drawer); use getAllByText.
    const labels = ["Home", "Services", "Gallery", "Reviews", "About", "Contact"];
    for (const label of labels) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  test("renders the Request Quote CTA", () => {
    renderNavbar();
    expect(screen.getAllByText("Request Quote").length).toBeGreaterThan(0);
  });

  test("active link uses the active text color class on / route", () => {
    renderNavbar("/");
    const homeLink = screen.getAllByText("Home")[0].closest("a");
    expect(homeLink.className).toMatch(/text-gray-900/);
  });

  test("inactive link uses muted text color class", () => {
    renderNavbar("/");
    const servicesLink = screen.getAllByText("Services")[0].closest("a");
    expect(servicesLink.className).toMatch(/text-gray-600/);
  });

  test("active link is visually distinguished from inactive on /services", () => {
    renderNavbar("/services");
    const servicesLink = screen.getAllByText("Services")[0].closest("a");
    expect(servicesLink.className).toMatch(/text-gray-900/);
  });

  test("all links point to correct routes", () => {
    renderNavbar();
    const expectations = [
      ["Home", "/"],
      ["Services", "/services"],
      ["Gallery", "/gallery"],
      ["Reviews", "/reviews"],
      ["About", "/about"],
      ["Contact", "/contact"],
    ];
    for (const [label, href] of expectations) {
      const a = screen.getAllByText(label)[0].closest("a");
      expect(a.getAttribute("href")).toBe(href);
    }
    // Request Quote CTA
    expect(
      screen.getAllByText("Request Quote")[0].closest("a").getAttribute("href")
    ).toBe("/request-quote");
  });

  test("phone number is rendered and dial link is correct", () => {
    renderNavbar();
    const phoneLinks = screen.getAllByText(/\(916\) 555-1234/);
    expect(phoneLinks.length).toBeGreaterThan(0);
    expect(phoneLinks[0].closest("a").getAttribute("href")).toBe(
      "tel:+19165551234"
    );
  });
});
