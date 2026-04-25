import { login, logout, getToken, getUser } from "../Auth";

describe("admin Auth", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("login stores token and user on success", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });

    const result = await login({ email: "a@b.c", password: "x" });
    expect(result.user.email).toBe("a@b.c");
    expect(getToken()).toBeTruthy();
    expect(getUser()).toEqual({ email: "a@b.c" });
  });

  test("login throws error and stores nothing on failure", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid credentials" }),
    });

    await expect(
      login({ email: "a@b.c", password: "x" })
    ).rejects.toThrow(/invalid credentials/i);
    expect(getToken()).toBeNull();
    expect(getUser()).toBeNull();
  });

  test("logout clears both token and user", () => {
    localStorage.setItem("auth_token", "tok");
    localStorage.setItem("auth_user", JSON.stringify({ email: "a@b.c" }));
    logout();
    expect(getToken()).toBeNull();
    expect(getUser()).toBeNull();
  });

  test("getToken returns null when nothing stored", () => {
    expect(getToken()).toBeNull();
  });

  test("getUser returns null when nothing stored", () => {
    expect(getUser()).toBeNull();
  });

  test("getUser parses stored JSON correctly", () => {
    localStorage.setItem("auth_user", JSON.stringify({ email: "x@y.z" }));
    expect(getUser()).toEqual({ email: "x@y.z" });
  });
});
