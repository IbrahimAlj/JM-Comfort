const express = require("express");

jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

const pool = require("../config/db");
const availabilityRoutes = require("../routes/availability");

const VALID_ADMIN_KEY = "test-admin-key-12345";

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/availability", availabilityRoutes);
  return app;
}

function makeRequest(app, method, path, body, headers) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const url = `http://localhost:${port}${path}`;
      const opts = { method, headers: { ...(headers || {}) } };
      if (body) {
        opts.body = JSON.stringify(body);
        if (!opts.headers["Content-Type"]) opts.headers["Content-Type"] = "application/json";
      }
      fetch(url, opts)
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
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

describe("Availability API", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
    process.env.ADMIN_API_KEY = VALID_ADMIN_KEY;
  });

  describe("GET /api/availability (public)", () => {
    test("returns active slots that have capacity", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          {
            id: 1,
            slot_date: "2026-05-01",
            start_time: "09:00:00",
            end_time: "12:00:00",
            capacity: 2,
            booked_count: 0,
            is_active: 1,
            notes: null,
            created_at: "2026-04-01T00:00:00Z",
            updated_at: "2026-04-01T00:00:00Z",
          },
        ],
      ]);

      const res = await makeRequest(app, "GET", "/api/availability");
      expect(res.status).toBe(200);
      expect(res.body.slots).toHaveLength(1);
      expect(res.body.slots[0].is_full).toBe(false);
      expect(res.body.slots[0].is_active).toBe(true);
    });

    test("returns 500 when DB throws", async () => {
      pool.execute.mockRejectedValueOnce(new Error("connection lost"));
      const res = await makeRequest(app, "GET", "/api/availability");
      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Failed to load/i);
    });
  });

  describe("GET /api/availability/admin", () => {
    test("rejects without admin key", async () => {
      const res = await makeRequest(app, "GET", "/api/availability/admin");
      expect(res.status).toBe(403);
    });

    test("returns all slots for admin", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          {
            id: 1,
            slot_date: "2026-05-01",
            start_time: "09:00:00",
            end_time: "12:00:00",
            capacity: 2,
            booked_count: 1,
            is_active: 0,
            notes: "deactivated",
            created_at: "2026-04-01T00:00:00Z",
            updated_at: "2026-04-01T00:00:00Z",
          },
        ],
      ]);
      const res = await makeRequest(
        app,
        "GET",
        "/api/availability/admin",
        null,
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(200);
      expect(res.body.slots[0].is_active).toBe(false);
    });
  });

  describe("POST /api/availability", () => {
    test("rejects without admin key", async () => {
      const res = await makeRequest(app, "POST", "/api/availability", {
        slot_date: "2026-05-15",
        start_time: "09:00",
        end_time: "12:00",
      });
      expect(res.status).toBe(403);
    });

    test("rejects missing required fields", async () => {
      const res = await makeRequest(
        app,
        "POST",
        "/api/availability",
        {},
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/slot_date/),
          expect.stringMatching(/start_time/),
          expect.stringMatching(/end_time/),
        ])
      );
    });

    test("rejects bad date format", async () => {
      const res = await makeRequest(
        app,
        "POST",
        "/api/availability",
        { slot_date: "5/15/2026", start_time: "09:00", end_time: "12:00" },
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(400);
    });

    test("rejects end_time <= start_time", async () => {
      const res = await makeRequest(
        app,
        "POST",
        "/api/availability",
        { slot_date: "2026-05-15", start_time: "14:00", end_time: "09:00" },
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([expect.stringMatching(/end_time/i)])
      );
    });

    test("rejects capacity < 1", async () => {
      const res = await makeRequest(
        app,
        "POST",
        "/api/availability",
        {
          slot_date: "2026-05-15",
          start_time: "09:00",
          end_time: "12:00",
          capacity: 0,
        },
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(400);
    });

    test("creates slot with valid input", async () => {
      pool.execute
        .mockResolvedValueOnce([{ insertId: 7 }])
        .mockResolvedValueOnce([
          [
            {
              id: 7,
              slot_date: "2026-05-15",
              start_time: "09:00:00",
              end_time: "12:00:00",
              capacity: 2,
              booked_count: 0,
              is_active: 1,
              notes: null,
              created_at: "2026-04-24T00:00:00Z",
              updated_at: "2026-04-24T00:00:00Z",
            },
          ],
        ]);

      const res = await makeRequest(
        app,
        "POST",
        "/api/availability",
        {
          slot_date: "2026-05-15",
          start_time: "09:00",
          end_time: "12:00",
          capacity: 2,
        },
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(201);
      expect(res.body.slot.id).toBe(7);
      expect(res.body.slot.capacity).toBe(2);
    });

    test("returns 409 on duplicate slot", async () => {
      const dup = new Error("dup");
      dup.code = "ER_DUP_ENTRY";
      pool.execute.mockRejectedValueOnce(dup);

      const res = await makeRequest(
        app,
        "POST",
        "/api/availability",
        {
          slot_date: "2026-05-15",
          start_time: "09:00",
          end_time: "12:00",
        },
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already exists/i);
    });
  });

  describe("DELETE /api/availability/:id", () => {
    test("rejects without admin key", async () => {
      const res = await makeRequest(app, "DELETE", "/api/availability/1");
      expect(res.status).toBe(403);
    });

    test("rejects invalid id", async () => {
      const res = await makeRequest(
        app,
        "DELETE",
        "/api/availability/abc",
        null,
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(400);
    });

    test("returns 404 when slot not found", async () => {
      pool.execute.mockResolvedValueOnce([[]]);
      const res = await makeRequest(
        app,
        "DELETE",
        "/api/availability/99",
        null,
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(404);
    });

    test("blocks delete when bookings exist", async () => {
      pool.execute.mockResolvedValueOnce([[{ booked_count: 2 }]]);
      const res = await makeRequest(
        app,
        "DELETE",
        "/api/availability/1",
        null,
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/bookings/i);
    });

    test("deletes empty slot", async () => {
      pool.execute
        .mockResolvedValueOnce([[{ booked_count: 0 }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const res = await makeRequest(
        app,
        "DELETE",
        "/api/availability/1",
        null,
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });
  });

  describe("PATCH /api/availability/:id", () => {
    test("toggles is_active", async () => {
      pool.execute
        .mockResolvedValueOnce([[{ id: 1 }]]) // existing check
        .mockResolvedValueOnce([{ affectedRows: 1 }]) // update
        .mockResolvedValueOnce([
          [
            {
              id: 1,
              slot_date: "2026-05-15",
              start_time: "09:00:00",
              end_time: "12:00:00",
              capacity: 2,
              booked_count: 0,
              is_active: 0,
              notes: null,
              created_at: "2026-04-24T00:00:00Z",
              updated_at: "2026-04-24T00:00:00Z",
            },
          ],
        ]);

      const res = await makeRequest(
        app,
        "PATCH",
        "/api/availability/1",
        { is_active: false },
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(200);
      expect(res.body.slot.is_active).toBe(false);
    });

    test("rejects empty body", async () => {
      pool.execute.mockResolvedValueOnce([[{ id: 1 }]]);
      const res = await makeRequest(
        app,
        "PATCH",
        "/api/availability/1",
        {},
        { "x-admin-key": VALID_ADMIN_KEY }
      );
      expect(res.status).toBe(400);
    });
  });
});
