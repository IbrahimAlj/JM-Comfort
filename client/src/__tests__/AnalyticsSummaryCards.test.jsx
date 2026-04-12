import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AnalyticsSummaryCards from "../admin/components/AnalyticsSummaryCards";

const mockData = {
  appointmentsThisWeek: 5,
  newLeadsThisWeek: 3,
  completedProjects: 12,
  averageRating: 4.5,
};

describe("AnalyticsSummaryCards", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders all 4 cards with mock data", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<AnalyticsSummaryCards />);

    await waitFor(() => {
      expect(screen.getByTestId("analytics-cards")).toBeInTheDocument();
    });

    expect(screen.getByText("Appointments This Week")).toBeInTheDocument();
    expect(screen.getByText("New Leads This Week")).toBeInTheDocument();
    expect(screen.getByText("Completed Projects")).toBeInTheDocument();
    expect(screen.getByText("Average Rating")).toBeInTheDocument();
  });

  test("renders loading state", () => {
    global.fetch = jest.fn().mockReturnValueOnce(new Promise(() => {}));

    render(<AnalyticsSummaryCards />);

    expect(screen.getByTestId("analytics-loading")).toBeInTheDocument();
  });

  test("renders error state when fetch fails", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    render(<AnalyticsSummaryCards />);

    await waitFor(() => {
      expect(screen.getByTestId("analytics-error")).toBeInTheDocument();
    });

    expect(screen.getByText("Unable to load analytics")).toBeInTheDocument();
  });
});
