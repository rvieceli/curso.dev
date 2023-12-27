import type { ResponseBody } from "./route";

const ENDPOINT = "http://localhost:3000/api/v1/status";

describe("GET /api/v1/status", () => {
  let body: ResponseBody;
  let response: Response;

  beforeEach(async () => {
    response = await fetch(ENDPOINT);
    body = await response.json();
  });

  it("should return status 200", async () => {
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json");
  });

  it("should return updated_at with valid ISO Date", async () => {
    expect(body).toHaveProperty("updated_at");
    expect(body.updated_at).not.toBeNull();

    const parsedUpdatedAt = new Date(body.updated_at).toISOString();

    expect(body.updated_at).toEqual(parsedUpdatedAt);
  });

  describe("dependencies", () => {
    it("it should return dependencies", async () => {
      expect(body).toHaveProperty("dependencies");
      expect(body.dependencies).not.toBeNull();
    });

    describe("database", () => {
      let database: ResponseBody["dependencies"]["database"];

      beforeEach(async () => {
        database = body.dependencies.database;
      });

      it("should return pg.max_connections with valid number", async () => {
        expect(database).toHaveProperty("max_connections");
        expect(database.max_connections).not.toBeNull();
        expect(database.max_connections).toBe(100);
      });

      it("should return pg.version with valid string", async () => {
        expect(database).toHaveProperty("version");
        expect(database.version).not.toBeNull();
        expect(database.version).toBe("16.0");
      });

      it("should return pg.open_connections with valid number", async () => {
        expect(database).toHaveProperty("open_connections");
        expect(database.open_connections).not.toBeNull();
        expect(database.open_connections).toBe(1);
      });
    });
  });
});
