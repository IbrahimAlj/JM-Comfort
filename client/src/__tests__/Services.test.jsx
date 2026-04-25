import { render, waitFor } from "@testing-library/react";
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

const mockServices = [
  {
    id: 1,
    title: "AC Installation",
    description: "Professional AC installation.",
    image_url: "/img/ac.jpg",
    price: "Starting at $3,500",
    is_active: true,
  },
  {
    id: 2,
    title: "Heating Repair",
    description: "Same-day heating repair.",
    image_url: "/img/heat.jpg",
    is_active: true,
  },
  {
    id: 3,
    title: "Maintenance",
    description: "Seasonal HVAC maintenance.",
    image_url: "/img/maint.jpg",
    is_active: true,
  },
];

describe("Services page", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockServices,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders and matches snapshot after services load", async () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getByText("AC Installation")).toBeTruthy();
    });
    expect(container).toMatchSnapshot();
  });

  test("renders one card per active service from /api/services", async () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getAllByText("Learn more")).toHaveLength(3);
    });
    expect(getAllByText("Get a quote")).toHaveLength(3);
  });

  test("renders three article cards", async () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getByText("AC Installation")).toBeTruthy();
    });
    const cards = container.querySelectorAll("article");
    expect(cards.length).toBe(3);
  });

  test("filters out services with is_active=false", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        ...mockServices,
        { id: 4, title: "Hidden", description: "x", is_active: false },
      ],
    });

    const { container, getByText } = render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getByText("AC Installation")).toBeTruthy();
    });
    expect(container.querySelectorAll("article").length).toBe(3);
  });

  test("renders empty state when no services returned", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const { getByText } = render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getByText("Services coming soon")).toBeTruthy();
    });
  });
});
