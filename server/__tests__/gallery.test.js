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

function buildFormData(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }
  return formData;
}

describe("Gallery API", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
    process.env.AWS_REGION = "us-west-1";
    process.env.ADMIN_API_KEY = VALID_ADMIN_KEY;
  });

  describe("POST /api/gallery", () => {
    describe("Single file upload", () => {
      test("returns 201 with uploaded file data on success", async () => {
        s3Client.send.mockResolvedValueOnce({});
        pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

        const file = createTestFile("test-photo.jpg", "image/jpeg", 2048);
        const formData = buildFormData([file]);

        const res = await makeRequest(app, "POST", "/api/gallery", formData);

        expect(res.status).toBe(201);
        expect(res.body.uploaded).toHaveLength(1);
        expect(res.body.uploaded[0].title).toBe("test-photo.jpg");
        expect(res.body.uploaded[0].url).toContain("test-bucket");
        expect(res.body.uploaded[0].url).toContain("gallery/");
        expect(res.body.uploaded[0].s3_key).toMatch(/^gallery\//);
        expect(res.body.failed).toHaveLength(0);
      });

      test("calls S3 with correct parameters", async () => {
        s3Client.send.mockResolvedValueOnce({});
        pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

        const file = createTestFile("photo.png", "image/png", 512);
        const formData = buildFormData([file]);

        await makeRequest(app, "POST", "/api/gallery", formData);

        expect(s3Client.send).toHaveBeenCalledTimes(1);
        const s3Params = s3Client.send.mock.calls[0][0];
        expect(s3Params.Bucket).toBe("test-bucket");
        expect(s3Params.Key).toMatch(/^gallery\/.*photo\.png$/);
        expect(s3Params.ContentType).toBe("image/png");
      });
    });

    describe("Multiple file upload", () => {
      test("returns 201 with all uploaded files on success", async () => {
        s3Client.send
          .mockResolvedValueOnce({})
          .mockResolvedValueOnce({});
        pool.execute
          .mockResolvedValueOnce([{ insertId: 1 }])
          .mockResolvedValueOnce([{ insertId: 2 }]);

        const files = [
          createTestFile("photo1.jpg", "image/jpeg", 1024),
          createTestFile("photo2.png", "image/png", 1024),
        ];
        const formData = buildFormData(files);

        const res = await makeRequest(app, "POST", "/api/gallery", formData);

        expect(res.status).toBe(201);
        expect(res.body.uploaded).toHaveLength(2);
        expect(res.body.uploaded[0].title).toBe("photo1.jpg");
        expect(res.body.uploaded[1].title).toBe("photo2.png");
      });
    });

    describe("Validation", () => {
      test("rejects disallowed file types", async () => {
        const file = createTestFile("document.gif", "image/gif", 1024);
        const formData = buildFormData([file]);

        const res = await makeRequest(app, "POST", "/api/gallery", formData);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Validation failed");
        expect(res.body.details[0]).toContain("File type not allowed");
        expect(res.body.details[0]).toContain("document.gif");
      });

      test("rejects files exceeding 5MB size limit", async () => {
        const oversizedFile = createTestFile("large.jpg", "image/jpeg", 6 * 1024 * 1024);
        const formData = buildFormData([oversizedFile]);

        const res = await makeRequest(app, "POST", "/api/gallery", formData);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Validation failed");
        expect(res.body.details[0]).toContain("5MB");
      });

      test("returns 400 when no files are provided", async () => {
        const res = await makeRequest(
          app,
          "POST",
          "/api/gallery",
          JSON.stringify({}),
          { "Content-Type": "application/json" }
        );

        expect(res.status).toBe(400);
      });
    });

    describe("Metadata storage", () => {
      test("stores metadata with original name and upload date", async () => {
        s3Client.send.mockResolvedValueOnce({});
        pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

        const file = createTestFile("my-hvac-project.jpg", "image/jpeg", 2048);
        const formData = buildFormData([file]);

        await makeRequest(app, "POST", "/api/gallery", formData);

        expect(pool.execute).toHaveBeenCalledTimes(1);
        const insertCall = pool.execute.mock.calls[0];
        expect(insertCall[0]).toContain("INSERT INTO images");
        expect(insertCall[0]).toContain("original_name");
        expect(insertCall[0]).toContain("uploaded_at");
        // Check params: [s3Key, s3Url, originalName, mimeType, fileSize]
        expect(insertCall[1][2]).toBe("my-hvac-project.jpg");
        expect(insertCall[1][3]).toBe("image/jpeg");
        expect(typeof insertCall[1][4]).toBe("number");
      });
    });

    describe("Error handling", () => {
      test("returns clear error when S3 upload fails", async () => {
        s3Client.send.mockRejectedValueOnce(new Error("S3 connection refused"));

        const file = createTestFile("photo.jpg", "image/jpeg", 1024);
        const formData = buildFormData([file]);

        const res = await makeRequest(app, "POST", "/api/gallery", formData);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("All uploads failed");
        expect(res.body.failed).toHaveLength(1);
        expect(res.body.failed[0].name).toBe("photo.jpg");
        expect(res.body.failed[0].error).toBe("Upload failed");
      });

      test("reports which files failed in multi-upload", async () => {
        s3Client.send
          .mockResolvedValueOnce({})
          .mockRejectedValueOnce(new Error("S3 error"));
        pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

        const files = [
          createTestFile("good.jpg", "image/jpeg", 1024),
          createTestFile("bad.jpg", "image/jpeg", 1024),
        ];
        const formData = buildFormData(files);

        const res = await makeRequest(app, "POST", "/api/gallery", formData);

        expect(res.status).toBe(207);
        expect(res.body.uploaded).toHaveLength(1);
        expect(res.body.uploaded[0].title).toBe("good.jpg");
        expect(res.body.failed).toHaveLength(1);
        expect(res.body.failed[0].name).toBe("bad.jpg");
      });
    });
  });

  describe("POST /api/gallery/upload", () => {
    describe("Success", () => {
      test("returns 201 with uploaded file data", async () => {
        s3Client.send.mockResolvedValueOnce({});
        pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

        const file = createTestFile("test-photo.jpg", "image/jpeg", 2048);
        const formData = buildFormData([file]);

        const res = await makeRequest(app, "POST", "/api/gallery/upload", formData, {
          "x-admin-key": VALID_ADMIN_KEY,
        });

        expect(res.status).toBe(201);
        expect(res.body.uploaded).toHaveLength(1);
        expect(res.body.uploaded[0].title).toBe("test-photo.jpg");
        expect(res.body.uploaded[0].url).toContain("test-bucket");
        expect(res.body.uploaded[0].url).toContain("gallery/");
        expect(res.body.uploaded[0].s3_key).toMatch(/^gallery\//);
        expect(res.body.failed).toHaveLength(0);
        expect(res.body).toMatchSnapshot({
          uploaded: [
            {
              url: expect.stringContaining("test-bucket"),
              title: "test-photo.jpg",
              s3_key: expect.stringMatching(/^gallery\//),
            },
          ],
          failed: [],
        });
      });

      test("calls S3 with correct parameters", async () => {
        s3Client.send.mockResolvedValueOnce({});
        pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

        const file = createTestFile("photo.png", "image/png", 512);
        const formData = buildFormData([file]);

        await makeRequest(app, "POST", "/api/gallery/upload", formData, {
          "x-admin-key": VALID_ADMIN_KEY,
        });

        expect(s3Client.send).toHaveBeenCalledTimes(1);
        const s3Params = s3Client.send.mock.calls[0][0];
        expect(s3Params.Bucket).toBe("test-bucket");
        expect(s3Params.Key).toMatch(/^gallery\/.*photo\.png$/);
        expect(s3Params.ContentType).toBe("image/png");
      });
    });

    describe("Validation", () => {
      test("rejects invalid file type returns 400", async () => {
        const file = createTestFile("document.gif", "image/gif", 1024);
        const formData = buildFormData([file]);

        const res = await makeRequest(app, "POST", "/api/gallery/upload", formData, {
          "x-admin-key": VALID_ADMIN_KEY,
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Validation failed");
        expect(res.body.details[0]).toContain("File type not allowed");
      });

      test("rejects file over 5MB returns 400", async () => {
        const oversizedFile = createTestFile("large.jpg", "image/jpeg", 6 * 1024 * 1024);
        const formData = buildFormData([oversizedFile]);

        const res = await makeRequest(app, "POST", "/api/gallery/upload", formData, {
          "x-admin-key": VALID_ADMIN_KEY,
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Validation failed");
        expect(res.body.details[0]).toContain("5MB");
      });

      test("returns 400 when no files provided", async () => {
        const res = await makeRequest(
          app,
          "POST",
          "/api/gallery/upload",
          JSON.stringify({}),
          { "Content-Type": "application/json", "x-admin-key": VALID_ADMIN_KEY }
        );

        expect(res.status).toBe(400);
      });
    });

    describe("Auth", () => {
      test("returns 401 when ADMIN_API_KEY missing", async () => {
        const file = createTestFile("photo.jpg", "image/jpeg", 1024);
        const formData = buildFormData([file]);

        const res = await makeRequest(app, "POST", "/api/gallery/upload", formData);

        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Unauthorized");
      });

      test("returns 401 when ADMIN_API_KEY incorrect", async () => {
        const file = createTestFile("photo.jpg", "image/jpeg", 1024);
        const formData = buildFormData([file]);

        const res = await makeRequest(app, "POST", "/api/gallery/upload", formData, {
          "x-admin-key": "wrong-key",
        });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Unauthorized");
      });
    });

    describe("Error handling", () => {
      test("returns 500 when S3 upload fails", async () => {
        s3Client.send.mockRejectedValueOnce(new Error("S3 connection refused"));

        const file = createTestFile("photo.jpg", "image/jpeg", 1024);
        const formData = buildFormData([file]);

        const res = await makeRequest(app, "POST", "/api/gallery/upload", formData, {
          "x-admin-key": VALID_ADMIN_KEY,
        });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("All uploads failed");
        expect(res.body.failed).toHaveLength(1);
        expect(res.body.failed[0].name).toBe("photo.jpg");
      });
    });
  });

  describe("DELETE /api/gallery/:id", () => {
    describe("Success", () => {
      test("returns 200 on successful delete", async () => {
        pool.execute
          .mockResolvedValueOnce([[{ id: 1, s3_key: "gallery/abc-photo.jpg" }]])
          .mockResolvedValueOnce([{ affectedRows: 1 }]);
        s3Client.send.mockResolvedValueOnce({});

        const res = await makeRequest(app, "DELETE", "/api/gallery/1", null, {
          "x-admin-key": VALID_ADMIN_KEY,
        });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Image deleted successfully");
        expect(res.body).toMatchSnapshot();
      });

      test("calls S3 delete with correct key", async () => {
        pool.execute
          .mockResolvedValueOnce([[{ id: 5, s3_key: "gallery/12345-uuid-myfile.jpg" }]])
          .mockResolvedValueOnce([{ affectedRows: 1 }]);
        s3Client.send.mockResolvedValueOnce({});

        await makeRequest(app, "DELETE", "/api/gallery/5", null, {
          "x-admin-key": VALID_ADMIN_KEY,
        });

        expect(s3Client.send).toHaveBeenCalledTimes(1);
        const deleteParams = s3Client.send.mock.calls[0][0];
        expect(deleteParams.Bucket).toBe("test-bucket");
        expect(deleteParams.Key).toBe("gallery/12345-uuid-myfile.jpg");
      });
    });

    describe("Not Found", () => {
      test("returns 404 for nonexistent image", async () => {
        pool.execute.mockResolvedValueOnce([[]]);

        const res = await makeRequest(app, "DELETE", "/api/gallery/999", null, {
          "x-admin-key": VALID_ADMIN_KEY,
        });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Image not found");
      });
    });

    describe("Auth", () => {
      test("returns 401 when ADMIN_API_KEY missing", async () => {
        const res = await makeRequest(app, "DELETE", "/api/gallery/1", null);

        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Unauthorized");
      });
    });

    describe("Error handling", () => {
      test("returns 500 when S3 delete fails", async () => {
        pool.execute
          .mockResolvedValueOnce([[{ id: 1, s3_key: "gallery/abc-photo.jpg" }]]);
        s3Client.send.mockRejectedValueOnce(new Error("S3 delete error"));

        const res = await makeRequest(app, "DELETE", "/api/gallery/1", null, {
          "x-admin-key": VALID_ADMIN_KEY,
        });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Failed to delete image");
      });
    });
  });

  describe("GET /api/gallery", () => {
    test("returns gallery images in correct shape for frontend", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          { url: "https://test-bucket.s3.us-west-1.amazonaws.com/gallery/img1.jpg", title: "photo1.jpg" },
          { url: "https://test-bucket.s3.us-west-1.amazonaws.com/gallery/img2.png", title: "photo2.png" },
        ],
      ]);

      const res = await makeRequest(app, "GET", "/api/gallery");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty("url");
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0].url).toContain("test-bucket");
    });

    test("returns empty array when no images exist", async () => {
      pool.execute.mockResolvedValueOnce([[]]);

      const res = await makeRequest(app, "GET", "/api/gallery");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test("returns 500 when database query fails", async () => {
      pool.execute.mockRejectedValueOnce(new Error("DB connection lost"));

      const res = await makeRequest(app, "GET", "/api/gallery");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Failed to load gallery");
    });

    test("queries only active images ordered by upload date", async () => {
      pool.execute.mockResolvedValueOnce([[]]);

      await makeRequest(app, "GET", "/api/gallery");

      expect(pool.execute).toHaveBeenCalledTimes(1);
      const query = pool.execute.mock.calls[0][0];
      expect(query).toContain("is_active = TRUE");
      expect(query).toContain("ORDER BY uploaded_at DESC");
    });
  });
});
