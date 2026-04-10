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
  { url: "https://example.com/img1.jpg", title: "HVAC Install 1" },
  { url: "https://example.com/img2.jpg", title: "HVAC Install 2" },
  { url: "https://example.com/img3.jpg", title: "HVAC Install 3" },
];

describe("Gallery page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state and matches snapshot", () => {
    global.fetch = jest.fn(() => new Promise(() => {}));

    const { container } = render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
    expect(screen.getByText("Loading gallery...")).toBeTruthy();
  });

  test("renders images in responsive grid and matches snapshot", async () => {
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

    const grid = container.querySelector(".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3");
    expect(grid).toBeTruthy();
  });

  test("renders empty state when no images", async () => {
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
      expect(screen.getByText("No images in the gallery yet.")).toBeTruthy();
    });
  });

  test("images use w-full and object-cover classes", async () => {
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

    const images = container.querySelectorAll("img.w-full.object-cover");
    expect(images.length).toBe(3);
  });
});
