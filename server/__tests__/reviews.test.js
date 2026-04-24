const express = require("express");

// Mock the db pool before requiring the route
jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

const pool = require("../config/db");
const reviewRoutes = require("../routes/reviews");

const VALID_ADMIN_KEY = "test-admin-key-12345";

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/reviews", reviewRoutes);
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
        if (!opts.headers["Content-Type"]) {
          opts.headers["Content-Type"] = "application/json";
        }
      }

      fetch(url, opts)
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

describe("Reviews API", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
    process.env.ADMIN_API_KEY = VALID_ADMIN_KEY;
  });

  describe("GET /api/reviews", () => {
    test("returns only published reviews", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          { id: 1, name: "John Doe", rating: 5, comment: "Great service!", created_at: "2024-01-01T00:00:00.000Z" },
          { id: 2, name: "Jane Smith", rating: 4, comment: "Good work", created_at: "2024-01-02T00:00:00.000Z" },
        ],
      ]);

      const res = await makeRequest(app, "GET", "/api/reviews");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("rating");
      expect(res.body[0]).toHaveProperty("comment");

      // Verify the query filters by published = TRUE
      const query = pool.execute.mock.calls[0][0];
      expect(query).toContain("published = TRUE");
    });

    test("returns empty array when no published reviews exist", async () => {
      pool.execute.mockResolvedValueOnce([[]]);

      const res = await makeRequest(app, "GET", "/api/reviews");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test("returns 500 on database error", async () => {
      pool.execute.mockRejectedValueOnce(new Error("DB connection lost"));

      const res = await makeRequest(app, "GET", "/api/reviews");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Failed to fetch reviews");
    });
  });

  describe("POST /api/reviews", () => {
    const validReview = {
      name: "John Doe",
      email: "john@example.com",
      rating: 5,
      comment: "Excellent service!",
    };

    test("returns 201 on successful submission", async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      const res = await makeRequest(app, "POST", "/api/reviews", validReview);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Review submitted successfully");
      expect(res.body.review_id).toBe(1);
    });

    test("returns 400 when name is missing", async () => {
      const { name, ...noName } = validReview;
      const res = await makeRequest(app, "POST", "/api/reviews", noName);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toContain("name is required");
    });

    test("returns 400 when email is missing", async () => {
      const { email, ...noEmail } = validReview;
      const res = await makeRequest(app, "POST", "/api/reviews", noEmail);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toContain("email is required");
    });

    test("returns 400 when rating is missing", async () => {
      const { rating, ...noRating } = validReview;
      const res = await makeRequest(app, "POST", "/api/reviews", noRating);

      expect(res.status).toBe(400);
      expect(res.body.details).toContain("rating is required");
    });

    test("returns 400 when rating is out of range", async () => {
      const res = await makeRequest(app, "POST", "/api/reviews", {
        ...validReview,
        rating: 6,
      });

      expect(res.status).toBe(400);
      expect(res.body.details).toContain("rating must be between 1 and 5");
    });

    test("returns 400 when comment is missing", async () => {
      const { comment, ...noComment } = validReview;
      const res = await makeRequest(app, "POST", "/api/reviews", noComment);

      expect(res.status).toBe(400);
      expect(res.body.details).toContain("comment is required");
    });
  });

  describe("GET /api/reviews/admin", () => {
    test("returns all reviews when admin key is valid", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          { id: 1, name: "John", email: "john@test.com", rating: 5, comment: "Great", published: true, created_at: "2024-01-01" },
          { id: 2, name: "Jane", email: "jane@test.com", rating: 3, comment: "OK", published: false, created_at: "2024-01-02" },
        ],
      ]);

      const res = await makeRequest(app, "GET", "/api/reviews/admin", null, {
        "x-admin-key": VALID_ADMIN_KEY,
      });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.reviews).toHaveLength(2);
    });

    test("returns 403 when admin key is missing", async () => {
      const res = await makeRequest(app, "GET", "/api/reviews/admin");

      expect(res.status).toBe(403);
    });
  });

  describe("PATCH /api/reviews/:id/publish", () => {
    test("returns 200 on success", async () => {
      pool.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const res = await makeRequest(app, "PATCH", "/api/reviews/1/publish", null, {
        "x-admin-key": VALID_ADMIN_KEY,
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Review published successfully");
    });

    test("returns 403 without admin key", async () => {
      const res = await makeRequest(app, "PATCH", "/api/reviews/1/publish");

      expect(res.status).toBe(403);
    });
  });

  describe("PATCH /api/reviews/:id/unpublish", () => {
    test("returns 200 on success", async () => {
      pool.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const res = await makeRequest(app, "PATCH", "/api/reviews/1/unpublish", null, {
        "x-admin-key": VALID_ADMIN_KEY,
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Review unpublished successfully");
    });
  });

  describe("DELETE /api/reviews/:id", () => {
    test("returns 200 on success", async () => {
      pool.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const res = await makeRequest(app, "DELETE", "/api/reviews/1", null, {
        "x-admin-key": VALID_ADMIN_KEY,
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Review deleted successfully");
    });

    test("returns 404 for nonexistent review", async () => {
      pool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const res = await makeRequest(app, "DELETE", "/api/reviews/999", null, {
        "x-admin-key": VALID_ADMIN_KEY,
      });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Review not found");
    });

    test("returns 403 without admin key", async () => {
      const res = await makeRequest(app, "DELETE", "/api/reviews/1");

      expect(res.status).toBe(403);
    });
  });

  describe("API contract snapshots", () => {
    test("GET /api/reviews response shape", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          { id: 1, name: "John Doe", rating: 5, comment: "Great service!", created_at: "2024-01-01T00:00:00.000Z" },
        ],
      ]);

      const res = await makeRequest(app, "GET", "/api/reviews");

      expect(res.body).toMatchSnapshot([
        {
          id: expect.any(Number),
          name: expect.any(String),
          rating: expect.any(Number),
          comment: expect.any(String),
          created_at: expect.any(String),
        },
      ]);
    });
  });
});
