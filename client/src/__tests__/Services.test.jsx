import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Services from "../pages/Services";

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

describe("Services page", () => {
  test("renders and matches snapshot", () => {
    const { container } = render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });

  test("renders all three service cards", () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    expect(getAllByText("Learn More")).toHaveLength(3);
    expect(getAllByText("Request Quote")).toHaveLength(3);
  });

  test("service cards use responsive flex classes", () => {
    const { container } = render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    const cards = container.querySelectorAll(".flex.flex-col.md\\:flex-row");
    expect(cards.length).toBe(3);
  });
});
