const express = require("express");

// Mock the db pool before requiring the route
jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

// Mock the S3 client before requiring the route
jest.mock("../config/s3", () => ({
  s3Client: { send: jest.fn() },
  PutObjectCommand: jest.fn((params) => params),
  DeleteObjectCommand: jest.fn((params) => params),
  BUCKET_NAME: "test-bucket",
}));

const pool = require("../config/db");
const { s3Client } = require("../config/s3");
const galleryRoutes = require("../routes/gallery");

const VALID_ADMIN_KEY = "test-admin-key-12345";

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/gallery", galleryRoutes);
  return app;
}

function makeRequest(app, method, path, body, headers) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const url = `http://localhost:${port}${path}`;
      const options = { method, headers: headers || {} };
      if (body) options.body = body;

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

function createTestFile(name, type, sizeBytes) {
  const buffer = Buffer.alloc(sizeBytes || 1024, "x");
  return new File([buffer], name, { type });
}

function buildFormData(files, fields) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }
  if (fields) {
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value);
    }
  }
  return formData;
}

describe("Gallery Photo Type API", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
    process.env.AWS_REGION = "us-west-1";
    process.env.ADMIN_API_KEY = VALID_ADMIN_KEY;
  });

  describe("POST /api/gallery", () => {
    test("stores photo_type when provided", async () => {
      s3Client.send.mockResolvedValueOnce({});
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      const file = createTestFile("test.jpg", "image/jpeg", 1024);
      const formData = buildFormData([file], { photo_type: "before" });

      const res = await makeRequest(app, "POST", "/api/gallery", formData);

      expect(res.status).toBe(201);
      const insertCall = pool.execute.mock.calls[0];
      expect(insertCall[0]).toContain("photo_type");
      expect(insertCall[1]).toContain("before");
    });

    test("defaults photo_type to general when not provided", async () => {
      s3Client.send.mockResolvedValueOnce({});
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      const file = createTestFile("test.jpg", "image/jpeg", 1024);
      const formData = buildFormData([file]);

      const res = await makeRequest(app, "POST", "/api/gallery", formData);

      expect(res.status).toBe(201);
      const insertCall = pool.execute.mock.calls[0];
      expect(insertCall[1]).toContain("general");
    });

    test("stores project_id when provided", async () => {
      s3Client.send.mockResolvedValueOnce({});
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      const file = createTestFile("test.jpg", "image/jpeg", 1024);
      const formData = buildFormData([file], { photo_type: "before", project_id: "5" });

      const res = await makeRequest(app, "POST", "/api/gallery", formData);

      expect(res.status).toBe(201);
      const insertCall = pool.execute.mock.calls[0];
      expect(insertCall[1]).toContain(5);
    });

    test("defaults project_id to null when not provided", async () => {
      s3Client.send.mockResolvedValueOnce({});
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      const file = createTestFile("test.jpg", "image/jpeg", 1024);
      const formData = buildFormData([file]);

      const res = await makeRequest(app, "POST", "/api/gallery", formData);

      expect(res.status).toBe(201);
      const insertCall = pool.execute.mock.calls[0];
      // project_id is the last param before NOW() — index 6
      expect(insertCall[1][6]).toBeNull();
    });

    test("returns 400 for invalid photo_type", async () => {
      const file = createTestFile("test.jpg", "image/jpeg", 1024);
      const formData = buildFormData([file], { photo_type: "invalid" });

      const res = await makeRequest(app, "POST", "/api/gallery", formData);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details[0]).toContain("photo_type");
    });
  });

  describe("POST /api/gallery/upload", () => {
    test("stores photo_type when provided", async () => {
      s3Client.send.mockResolvedValueOnce({});
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      const file = createTestFile("test.jpg", "image/jpeg", 1024);
      const formData = buildFormData([file], { photo_type: "after" });

      const res = await makeRequest(app, "POST", "/api/gallery/upload", formData, {
        "x-admin-key": VALID_ADMIN_KEY,
      });

      expect(res.status).toBe(201);
      const insertCall = pool.execute.mock.calls[0];
      expect(insertCall[0]).toContain("photo_type");
      expect(insertCall[1]).toContain("after");
    });

    test("defaults photo_type to general when not provided", async () => {
      s3Client.send.mockResolvedValueOnce({});
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      const file = createTestFile("test.jpg", "image/jpeg", 1024);
      const formData = buildFormData([file]);

      const res = await makeRequest(app, "POST", "/api/gallery/upload", formData, {
        "x-admin-key": VALID_ADMIN_KEY,
      });

      expect(res.status).toBe(201);
      const insertCall = pool.execute.mock.calls[0];
      expect(insertCall[1]).toContain("general");
    });
  });

  describe("GET /api/gallery", () => {
    test("returns photo_type and project_id for each image", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          { url: "https://test-bucket.s3.us-west-1.amazonaws.com/gallery/img1.jpg", title: "photo1.jpg", photo_type: "before", project_id: 1 },
          { url: "https://test-bucket.s3.us-west-1.amazonaws.com/gallery/img2.jpg", title: "photo2.jpg", photo_type: "after", project_id: 1 },
        ],
      ]);

      const res = await makeRequest(app, "GET", "/api/gallery");

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("photo_type", "before");
      expect(res.body[0]).toHaveProperty("project_id", 1);
      expect(res.body[1]).toHaveProperty("photo_type", "after");
    });

    test("filters by project_id when query param is provided", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          { url: "https://test-bucket.s3.us-west-1.amazonaws.com/gallery/img1.jpg", title: "photo1.jpg", photo_type: "before", project_id: 3 },
        ],
      ]);

      const res = await makeRequest(app, "GET", "/api/gallery?project_id=3");

      expect(res.status).toBe(200);
      const sql = pool.execute.mock.calls[0][0];
      const params = pool.execute.mock.calls[0][1];
      expect(sql).toContain("project_id = ?");
      expect(params).toContain(3);
    });

    test("returns all images when no project_id filter is provided", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          { url: "https://test-bucket.s3.us-west-1.amazonaws.com/gallery/img1.jpg", title: "photo1.jpg", photo_type: "general", project_id: null },
          { url: "https://test-bucket.s3.us-west-1.amazonaws.com/gallery/img2.jpg", title: "photo2.jpg", photo_type: "before", project_id: 1 },
        ],
      ]);

      const res = await makeRequest(app, "GET", "/api/gallery");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      const sql = pool.execute.mock.calls[0][0];
      expect(sql).not.toContain("project_id = ?");
    });
  });

  describe("API contract snapshots", () => {
    test("GET /api/gallery response includes photo_type and project_id", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          { url: "https://test-bucket.s3.us-west-1.amazonaws.com/gallery/img1.jpg", title: "photo1.jpg", photo_type: "general", project_id: null },
        ],
      ]);

      const res = await makeRequest(app, "GET", "/api/gallery");

      expect(res.body).toMatchSnapshot([
        {
          url: expect.any(String),
          title: expect.any(String),
          photo_type: expect.any(String),
          project_id: null,
        },
      ]);
    });
  });
});
