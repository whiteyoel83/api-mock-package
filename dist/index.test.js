"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../src/index"));
const supertest_1 = __importDefault(require("supertest"));
describe("MockAPI", () => {
    let mockAPI;
    beforeEach(() => {
        mockAPI = new index_1.default({ port: 4000 });
    });
    afterEach(() => {
        mockAPI = null; // Clean up after each test
    });
    describe("Server Initialization", () => {
        it("should start the server on the specified port", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(mockAPI["app"]).get("/").expect(404);
            expect(response.body.error).toBe("Route not found");
        }));
    });
    describe("Default Routes", () => {
        it("should return default users on GET /users", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(mockAPI["app"]).get("/users").expect(200);
            expect(response.body).toEqual([
                { id: 1, name: "Alice" },
                { id: 2, name: "Bob" },
            ]);
        }));
        it("should return success on valid POST /login", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(mockAPI["app"])
                .post("/login")
                .send({ username: "admin", password: "password" })
                .expect(200);
            expect(response.body).toEqual({
                success: true,
                message: "Login successful",
            });
        }));
        it("should return error on invalid POST /login", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(mockAPI["app"])
                .post("/login")
                .send({ username: "wrong", password: "wrong" })
                .expect(400);
            expect(response.body.error).toBe("Invalid request data");
        }));
    });
    describe("Custom Routes", () => {
        it("should handle GET requests with API key validation", () => __awaiter(void 0, void 0, void 0, function* () {
            mockAPI.addCustomRoute("GET", "/products", undefined, [{ id: 1, name: "Laptop", price: 1000 }], "apiKey", "my-secret-key");
            // Valid API key
            const validResponse = yield (0, supertest_1.default)(mockAPI["app"])
                .get("/products")
                .set("x-api-key", "my-secret-key")
                .expect(200);
            expect(validResponse.body).toEqual([
                { id: 1, name: "Laptop", price: 1000 },
            ]);
            // Invalid API key
            const invalidResponse = yield (0, supertest_1.default)(mockAPI["app"])
                .get("/products")
                .set("x-api-key", "invalid-key")
                .expect(401);
            expect(invalidResponse.body.error).toBe("Unauthorized: Invalid API key");
        }));
        it("should handle POST requests with Authorization token validation", () => __awaiter(void 0, void 0, void 0, function* () {
            mockAPI.addCustomRoute("POST", "/register", { email: "test@example.com", password: "123456" }, {
                success: true,
                message: "Registration successful",
            }, "authorization", "valid-token");
            // Valid token
            const validResponse = yield (0, supertest_1.default)(mockAPI["app"])
                .post("/register")
                .set("Authorization", "Bearer valid-token")
                .send({ email: "test@example.com", password: "123456" })
                .expect(200);
            expect(validResponse.body).toEqual({
                success: true,
                message: "Registration successful",
            });
            // Invalid token
            const invalidResponse = yield (0, supertest_1.default)(mockAPI["app"])
                .post("/register")
                .set("Authorization", "Bearer invalid-token")
                .send({ email: "test@example.com", password: "123456" })
                .expect(401);
            expect(invalidResponse.body.error).toBe("Unauthorized: Invalid token");
        }));
        it("should handle PUT requests without middleware", () => __awaiter(void 0, void 0, void 0, function* () {
            mockAPI.addCustomRoute("PUT", "/users/:id", { id: "1", name: "Alice Updated" }, {
                success: true,
                message: "User updated successfully",
            });
            const response = yield (0, supertest_1.default)(mockAPI["app"])
                .put("/users/1")
                .send({ id: "1", name: "Alice Updated" })
                .expect(200);
            expect(response.body).toEqual({
                success: true,
                message: "User updated successfully",
            });
        }));
        it("should handle DELETE requests with API key validation", () => __awaiter(void 0, void 0, void 0, function* () {
            mockAPI.addCustomRoute("DELETE", "/users/:id", { id: "1" }, {
                success: true,
                message: "User deleted successfully",
            }, "apiKey", "my-secret-key");
            // Valid API key
            const validResponse = yield (0, supertest_1.default)(mockAPI["app"])
                .delete("/users/1")
                .set("x-api-key", "my-secret-key")
                .expect(200);
            expect(validResponse.body).toEqual({
                success: true,
                message: "User deleted successfully",
            });
            // Invalid API key
            const invalidResponse = yield (0, supertest_1.default)(mockAPI["app"])
                .delete("/users/1")
                .set("x-api-key", "invalid-key")
                .expect(401);
            expect(invalidResponse.body.error).toBe("Unauthorized: Invalid API key");
        }));
        it("should handle PATCH requests without middleware", () => __awaiter(void 0, void 0, void 0, function* () {
            mockAPI.addCustomRoute("PATCH", "/users/:id", { id: "1", email: "new-email@example.com" }, {
                success: true,
                message: "User partially updated successfully",
            });
            const response = yield (0, supertest_1.default)(mockAPI["app"])
                .patch("/users/1")
                .send({ id: "1", email: "new-email@example.com" })
                .expect(200);
            expect(response.body).toEqual({
                success: true,
                message: "User partially updated successfully",
            });
        }));
    });
    describe("Error Handling", () => {
        it("should return 404 for unmatched routes", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(mockAPI["app"])
                .get("/nonexistent-route")
                .expect(404);
            expect(response.body.error).toBe("Route not found");
        }));
        it("should return 400 for invalid request data", () => __awaiter(void 0, void 0, void 0, function* () {
            mockAPI.addCustomRoute("POST", "/validate", { key: "value" }, { success: true });
            const response = yield (0, supertest_1.default)(mockAPI["app"])
                .post("/validate")
                .send({ key: "wrong-value" })
                .expect(400);
            expect(response.body.error).toBe("Invalid request data");
        }));
        it("should handle internal server errors gracefully", () => __awaiter(void 0, void 0, void 0, function* () {
            mockAPI.addCustomRoute("GET", "/error", undefined, undefined, undefined, undefined);
            const response = yield (0, supertest_1.default)(mockAPI["app"]).get("/error").expect(404);
            expect(response.body.error).toBe("Internal server error");
        }));
    });
});
