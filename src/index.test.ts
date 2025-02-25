import request from "supertest";
import MockAPI from "../src/index";

describe("Custom Routes", () => {
  let mockAPI: any;

  beforeEach(() => {
    mockAPI = new MockAPI("testApp", undefined);
  });

  it("should respond with 200 for GET /health", async () => {
    const response = await request(mockAPI["app"]).get("/health").expect(200);
    expect(response.body.message).toBe("OK");
  });

  it("should respond with 200 for GET /custom-route-get", async () => {
    const response = await request(mockAPI["app"])
      .get("/custom-route-get")
      .set("x-api-key", "secret-key")
      .expect(200);
    expect(response.body.message).toBe("Item listed successfully");
  });

  it("should respond with 201 for POST /custom-route-create", async () => {
    const response = await request(mockAPI["app"])
      .post("/custom-route-create")
      .set("x-api-key", "secret-key")
      .send({ name: "Test Item" })
      .expect(201);
    expect(response.body.message).toBe("Item created successfully");
  });

  it("should respond with 200 for PUT /custom-route-update", async () => {
    const response = await request(mockAPI["app"])
      .put("/custom-route-update")
      .set("x-api-key", "secret-key")
      .send({ name: "Test Item" })
      .expect(200);
    expect(response.body.message).toBe("Item updated successfully");
  });

  it("should respond with 200 for DELETE /custom-route-delete", async () => {
    const response = await request(mockAPI["app"])
      .delete("/custom-route-delete")
      .set("x-api-key", "secret-key")
      .send({ id: "some-id" })
      .expect(200);
    expect(response.body.message).toBe("Item deleted successfully");
  });
});

describe("Api Key Validation", () => {
  let mockAPI: any;

  beforeEach(() => {
    mockAPI = new MockAPI("testApp", undefined, true);
  });
  it("should respond with 401 for GET /secure-route-x-api-key without API key", async () => {
    const response = await request(mockAPI["app"])
      .get("/secure-route-x-api-key")
      .expect(401);
    expect(response.body.error).toBe("Unauthorized: Invalid API key");
  });
  it("should respond with 200 for GET /secure-route-x-api-key with API key", async () => {
    const response = await request(mockAPI["app"])
      .get("/secure-route-x-api-key")
      .set("x-api-key", "secret-key")
      .expect(200);
    expect(response.body.message).toBe("Custom route with API key works!");
  });
  it("should respond with 200 for GET /secure-route-x-api-key with wrong API key", async () => {
    const response = await request(mockAPI["app"])
      .get("/secure-route-x-api-key")
      .set("x-api-key", "wrong-key")
      .expect(401);
    expect(response.body.error).toBe("Unauthorized: Invalid API key");
  });
});

describe("Authorization Validation", () => {
  let mockAPI: any;

  beforeEach(() => {
    mockAPI = new MockAPI("testApp", undefined, true);
  });
  it("should respond with 401 for GET /secure-route-authorization without authorization", async () => {
    const response = await request(mockAPI["app"])
      .get("/secure-route-authorization")
      .expect(401);
    expect(response.body.error).toBe("Unauthorized: Missing token");
  });
  it("should respond with 200 for GET /secure-route-authorization with authorization", async () => {
    const response = await request(mockAPI["app"])
      .get("/secure-route-authorization")
      .set("authorization", "Bearer secret-token")
      .expect(200);
    expect(response.body.message).toBe(
      "Custom route with authorization works!"
    );
  });
  it("should respond with 401 for GET /secure-route-authorization with a wrong authorization", async () => {
    const response = await request(mockAPI["app"])
      .get("/secure-route-authorization")
      .set("authorization", "Bearer wrong-token")
      .expect(401);
    expect(response.body.error).toBe("Unauthorized: Invalid token");
  });
});

describe("Error Handling", () => {
  let mockAPI: MockAPI;
  beforeEach(() => {
    mockAPI = new MockAPI("testApp", undefined, true);
  });

  it("should respond with 200 for GET /invalid-route", async () => {
    const response = await request(mockAPI["app"])
      .get("/invalid-route")
      .expect(404);
    expect(response.body.error).toBe("Route not found");
  });

  it("should respond with 500 for GET /internal-server-error", async () => {
    const response = await request(mockAPI["app"])
      .get("/internal-server-error")
      .expect(500);
    expect(response.body.error).toBe("Internal server error");
  });
});

describe("Validate CORS with specific origins", () => {
  let mockAPI: MockAPI;

  beforeEach(() => {
    mockAPI = new MockAPI("testApp", 3001, ["http://localhost:3001"]);
  });

  it("should respond with valid CORS headers", async () => {
    const response = await request(mockAPI["app"])
      .get("/health")
      .set("Origin", "http://localhost:3001")
      .set("x-api-key", "secret-key")
      .expect(200);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:3001"
    );
  });
});

describe("Server functionality", () => {
  let mockAPI: MockAPI;
  let listenSpy: any;

  beforeEach(() => {
    mockAPI = new MockAPI("testApp", undefined, true);
    listenSpy = jest.spyOn(mockAPI["app"], "listen");
  });

  afterEach(() => {
    listenSpy.mockRestore();
  });

  it("should start the server and log the correct message", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    mockAPI.start();

    expect(listenSpy).toHaveBeenCalledWith(3000, expect.any(Function));

    const callback = listenSpy.mock.calls[0][1];

    callback();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "testApp Mock API running on port 3000"
    );

    consoleLogSpy.mockRestore();
  });
});
