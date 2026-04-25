import "@testing-library/jest-dom/jest-globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/admin/login"]}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<div>dashboard-page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminLogin", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders email and password fields and submit button", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  test("email input has type=email (HTML5 validation gate)", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
  });

  test("password input has type=password", () => {
    renderLogin();
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("type", "password");
  });

  test("displays error banner when login fails", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid credentials" }),
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "bad-pw" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
    expect(localStorage.getItem("auth_token")).toBeNull();
  });

  test("redirects to dashboard on successful login", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "valid-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText("dashboard-page")).toBeInTheDocument()
    );
    expect(localStorage.getItem("auth_token")).toBeTruthy();
    expect(localStorage.getItem("auth_user")).toContain("admin@example.com");
  });

  test("button shows loading state during request", async () => {
    let resolveFetch;
    global.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "x" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled()
    );

    resolveFetch({ ok: true, status: 200, json: async () => ({ ok: true }) });
  });
});
