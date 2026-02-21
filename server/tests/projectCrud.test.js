const { describe, it, beforeEach, mock } = require("node:test");
const assert = require("node:assert");

describe("Project CRUD controllers", () => {
  let controller;
  let mockDb;

  beforeEach(() => {
    delete require.cache[require.resolve("../controllers/projectController")];
    delete require.cache[require.resolve("../config/database")];

    mockDb = require("../config/database");
    mockDb.query = mock.fn(async () => [[]]);

    controller = require("../controllers/projectController");
  });

  describe("getAllProjects", () => {
    it("should return all projects", async () => {
      mockDb.query = mock.fn(async () => [
        [
          { id: 1, name: "HVAC Install", customer_name: "John Doe", status: "planned" },
          { id: 2, name: "AC Repair", customer_name: "Jane Smith", status: "in_progress" },
        ],
      ]);

      let responseBody = null;
      const req = {};
      const res = {
        status() { return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.getAllProjects(req, res);

      assert.strictEqual(responseBody.length, 2);
      assert.strictEqual(responseBody[0].name, "HVAC Install");
    });

    it("should handle database errors", async () => {
      mockDb.query = mock.fn(async () => { throw new Error("DB error"); });

      let responseStatus = null;
      let responseBody = null;
      const req = {};
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.getAllProjects(req, res);

      assert.strictEqual(responseStatus, 500);
      assert.ok(responseBody.error.includes("Failed to fetch"));
    });
  });

  describe("createProject", () => {
    it("should create a project with valid data", async () => {
      mockDb.query = mock.fn(async (sql) => {
        if (sql.includes("INSERT")) {
          return [{ insertId: 10 }];
        }
        return [[{ id: 10, name: "New Project", customer_name: "John", status: "planned" }]];
      });

      let responseStatus = null;
      let responseBody = null;
      const req = {
        body: { customer_id: 1, name: "New Project", status: "planned" },
      };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.createProject(req, res);

      assert.strictEqual(responseStatus, 201);
      assert.ok(responseBody.message.includes("created"));
      assert.strictEqual(responseBody.project.name, "New Project");
    });

    it("should require name", async () => {
      let responseStatus = null;
      let responseBody = null;
      const req = { body: { customer_id: 1 } };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.createProject(req, res);

      assert.strictEqual(responseStatus, 400);
      assert.ok(responseBody.error.includes("required"));
    });

    it("should require customer_id", async () => {
      let responseStatus = null;
      let responseBody = null;
      const req = { body: { name: "Test" } };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.createProject(req, res);

      assert.strictEqual(responseStatus, 400);
      assert.ok(responseBody.error.includes("required"));
    });

    it("should reject invalid status", async () => {
      let responseStatus = null;
      let responseBody = null;
      const req = { body: { customer_id: 1, name: "Test", status: "invalid" } };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.createProject(req, res);

      assert.strictEqual(responseStatus, 400);
      assert.ok(responseBody.error.includes("Invalid status"));
    });
  });

  describe("updateProject", () => {
    it("should update an existing project", async () => {
      mockDb.query = mock.fn(async (sql) => {
        if (sql.includes("SELECT * FROM projects")) {
          return [[{ id: 1, name: "Old Name", status: "planned", start_date: null, end_date: null }]];
        }
        if (sql.includes("UPDATE")) {
          return [{ affectedRows: 1 }];
        }
        return [[{ id: 1, name: "Updated", customer_name: "John", status: "in_progress" }]];
      });

      let responseBody = null;
      const req = {
        params: { id: "1" },
        body: { name: "Updated", status: "in_progress" },
      };
      const res = {
        status() { return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.updateProject(req, res);

      assert.ok(responseBody.message.includes("updated"));
      assert.strictEqual(responseBody.project.name, "Updated");
    });

    it("should return 404 for nonexistent project", async () => {
      mockDb.query = mock.fn(async () => [[]]);

      let responseStatus = null;
      let responseBody = null;
      const req = { params: { id: "999" }, body: { name: "Test" } };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.updateProject(req, res);

      assert.strictEqual(responseStatus, 404);
    });
  });

  describe("deleteProject", () => {
    it("should delete an existing project", async () => {
      mockDb.query = mock.fn(async (sql) => {
        if (sql.includes("SELECT")) {
          return [[{ id: 1, name: "To Delete" }]];
        }
        if (sql.includes("DELETE")) {
          return [{ affectedRows: 1 }];
        }
        return [[]];
      });

      let responseBody = null;
      const req = { params: { id: "1" } };
      const res = {
        status() { return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.deleteProject(req, res);

      assert.ok(responseBody.message.includes("deleted"));
    });

    it("should return 404 for nonexistent project", async () => {
      mockDb.query = mock.fn(async () => [[]]);

      let responseStatus = null;
      let responseBody = null;
      const req = { params: { id: "999" } };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.deleteProject(req, res);

      assert.strictEqual(responseStatus, 404);
    });
  });
});
