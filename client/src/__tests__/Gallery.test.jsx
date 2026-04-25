import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Gallery from "../pages/Gallery";

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

const mockImages = [
  {
    url: "https://example.com/img1.jpg",
    title: "HVAC Install 1",
    photo_type: "general",
    project_id: null,
  },
  {
    url: "https://example.com/img2.jpg",
    title: "HVAC Install 2",
    photo_type: "general",
    project_id: null,
  },
  {
    url: "https://example.com/img3.jpg",
    title: "HVAC Install 3",
    photo_type: "general",
    project_id: null,
  },
];

describe("Gallery page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders skeleton loading state and matches snapshot", () => {
    global.fetch = jest.fn(() => new Promise(() => {}));

    const { container } = render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>
    );

    expect(container).toMatchSnapshot();
    // Skeleton placeholders use the animate-pulse class.
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  test("renders images in grid and matches snapshot", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockImages),
      })
    );

    const { container } = render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByAltText("HVAC Install 1")).toBeTruthy();
    });

    expect(container).toMatchSnapshot();
  });

  test("renders empty state when no images are returned", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Nothing to show yet")).toBeTruthy();
    });
    expect(
      screen.getByText("Fresh photos are on the way. Check back soon.")
    ).toBeTruthy();
  });

  test("rendered general images use object-cover class", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockImages),
      })
    );

    const { container } = render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByAltText("HVAC Install 1")).toBeTruthy();
    });

    const images = container.querySelectorAll("img.object-cover");
    expect(images.length).toBe(3);
  });
});
