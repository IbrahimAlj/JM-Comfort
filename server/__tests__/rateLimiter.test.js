const express = require("express");
const adminLoginRoutes = require("../routes/adminLogin");

const VALID_ADMIN_KEY = "test-admin-key-12345";

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/admin", adminLoginRoutes);
  return app;
}

function makeRequest(app, method, path, body, headers) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const url = `http://localhost:${port}${path}`;
      const options = {
        method,
        headers: { "Content-Type": "application/json", ...(headers || {}) },
      };
      if (body) options.body = JSON.stringify(body);

      fetch(url, options)
        .then(async (res) => {
          const data = await res.json();
          server.close();
          resolve({ status: res.status, body: data });
        })
        .catch((err) => {
          server.close();
          resolve({ status: 500, body: { error: err.message } });
        });
    });
  });
}

function startServer(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

async function fetchJson(port, method, path, body) {
  const url = `http://localhost:${port}${path}`;
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const data = await res.json();
  return { status: res.status, body: data };
}

describe("POST /api/admin/login", () => {
  let app;

  beforeEach(() => {
    // Re-require to get a fresh rate limiter instance per test
    jest.resetModules();
    const freshRoutes = require("../routes/adminLogin");
    app = express();
    app.use(express.json());
    app.use("/api/admin", freshRoutes);
    jest.clearAllMocks();
    process.env.ADMIN_API_KEY = VALID_ADMIN_KEY;
  });

  describe("Login functionality", () => {
    test("returns 200 with valid key", async () => {
      const res = await makeRequest(app, "POST", "/api/admin/login", {
        key: VALID_ADMIN_KEY,
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
    });

    test("returns 401 with invalid key", async () => {
      const res = await makeRequest(app, "POST", "/api/admin/login", {
        key: "wrong-key",
      });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid credentials");
    });

    test("returns 400 when key is missing", async () => {
      const res = await makeRequest(app, "POST", "/api/admin/login", {});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("key is required");
    });

    test("returns 403 when ADMIN_API_KEY is not configured", async () => {
      delete process.env.ADMIN_API_KEY;
      const res = await makeRequest(app, "POST", "/api/admin/login", {
        key: "anything",
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("admin access not configured");
    });
  });

  describe("Rate limiting", () => {
    test("allows 5 requests then returns 429 on the 6th", async () => {
      const { server, port } = await startServer(app);

      try {
        // Requests 1-5 should pass through to the handler (not 429)
        for (let i = 1; i <= 5; i++) {
          const res = await fetchJson(port, "POST", "/api/admin/login", {
            key: "wrong-key",
          });
          expect(res.status).not.toBe(429);
        }

        // Request 6 should be rate limited
        const res = await fetchJson(port, "POST", "/api/admin/login", {
          key: "wrong-key",
        });
        expect(res.status).toBe(429);
        expect(res.body).toMatchSnapshot();
        expect(res.body.message).toBe(
          "Too many login attempts please try again later"
        );
      } finally {
        server.close();
      }
    });

    test("rate limit applies even to valid credentials on 6th request", async () => {
      const { server, port } = await startServer(app);

      try {
        // Use up 5 requests
        for (let i = 1; i <= 5; i++) {
          await fetchJson(port, "POST", "/api/admin/login", {
            key: "wrong-key",
          });
        }

        // 6th request with valid key should still be blocked
        const res = await fetchJson(port, "POST", "/api/admin/login", {
          key: VALID_ADMIN_KEY,
        });
        expect(res.status).toBe(429);
      } finally {
        server.close();
      }
    });

    test("does not rate limit other routes", async () => {
      app.get("/api/health", (req, res) => res.json({ status: "ok" }));
      const { server, port } = await startServer(app);

      try {
        // Use up the rate limit on login
        for (let i = 1; i <= 6; i++) {
          await fetchJson(port, "POST", "/api/admin/login", {
            key: "wrong",
          });
        }

        // Health endpoint should still work
        const res = await fetchJson(port, "GET", "/api/health");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("ok");
      } finally {
        server.close();
      }
    });
  });
});
