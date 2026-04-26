import "@testing-library/jest-dom/jest-globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";

function renderSidebar(initial = "/admin/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/admin/*" element={<AdminSidebar />} />
        <Route path="/admin/login" element={<div>login-page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminSidebar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders all nine nav links", () => {
    renderSidebar();
    const labels = [
      "Dashboard",
      "Leads",
      "Projects",
      "Appointments",
      "Availability",
      "Services",
      "Reviews",
      "Client Feedback",
      "Upload Pictures",
    ];
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  test("renders branding header", () => {
    renderSidebar();
    expect(screen.getByText("JM Comfort")).toBeInTheDocument();
    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
  });

  test("active route gets highlighted class", () => {
    renderSidebar("/admin/leads");
    const link = screen.getByText("Leads").closest("a");
    expect(link.className).toMatch(/bg-white\/10/);
  });

  test("inactive route uses muted class", () => {
    renderSidebar("/admin/dashboard");
    const link = screen.getByText("Leads").closest("a");
    expect(link.className).toMatch(/text-gray-400/);
  });

  test("Sign out clears auth tokens from localStorage", () => {
    localStorage.setItem("auth_token", "fake-token");
    localStorage.setItem("auth_user", JSON.stringify({ email: "a@b.c" }));
    renderSidebar();
    fireEvent.click(screen.getByText("Sign out"));
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });

  test("Sign out navigates to /admin/login", () => {
    renderSidebar();
    fireEvent.click(screen.getByText("Sign out"));
    expect(screen.getByText("login-page")).toBeInTheDocument();
  });

  test("clicking nav link triggers onNavigate callback when provided", () => {
    const onNavigate = jest.fn();
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AdminSidebar onNavigate={onNavigate} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Leads"));
    expect(onNavigate).toHaveBeenCalled();
  });
});
