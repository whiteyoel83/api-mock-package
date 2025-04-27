"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("../src/index"));
describe("Validate Defaults Routes", () => {
    let mockAPI;
    let server;
    beforeEach(() => {
        mockAPI = new index_1.default("testApp", 0, true, true);
        server = mockAPI.start();
    });
    afterEach((done) => {
        server.close(done);
    });
    it("should respond with 200 for GET /health", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({ hostname: "localhost", port: port, path: "/health", method: "GET" }, (res) => {
            expect(res.statusCode).toBe(200);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.message).toBe("OK");
                done();
            });
        });
        req.end();
    });
    it("should respond with 200 for GET /route-get", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/route-get",
            method: "GET",
            headers: { "x-api-key": "secret-key" },
        }, (res) => {
            expect(res.statusCode).toBe(200);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.message).toBe("Item listed successfully");
                done();
            });
        });
        req.end();
    });
});
describe("Api Key Validation", () => {
    let mockAPI;
    let server;
    beforeEach(() => {
        mockAPI = new index_1.default("testApp", 0, true, true);
        server = mockAPI.start();
    });
    afterEach((done) => {
        server.close(done);
    });
    it("should respond with 401 for GET /secure-route-x-api-key without API key", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/secure-route-x-api-key",
            method: "GET",
        }, (res) => {
            expect(res.statusCode).toBe(401);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.error).toBe("Unauthorized: Invalid API key");
                done();
            });
        });
        req.end();
    });
    it("should respond with 200 for GET /secure-route-x-api-key with API key", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/secure-route-x-api-key",
            method: "GET",
            headers: { "x-api-key": "secret-key" },
        }, (res) => {
            expect(res.statusCode).toBe(200);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.message).toBe("Route with API key works!");
                done();
            });
        });
        req.end();
    });
    it("should respond with 401 for GET /secure-route-x-api-key with wrong API key", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/secure-route-x-api-key",
            method: "GET",
            headers: { "x-api-key": "wrong-key" },
        }, (res) => {
            expect(res.statusCode).toBe(401);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.error).toBe("Unauthorized: Invalid API key");
                done();
            });
        });
        req.end();
    });
});
describe("Authorization Validation", () => {
    let mockAPI;
    let server;
    beforeEach(() => {
        mockAPI = new index_1.default("testApp", 0, true, true);
        server = mockAPI.start();
    });
    afterEach((done) => {
        server.close(done);
    });
    it("should respond with 401 for GET /secure-route-authorization without authorization", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/secure-route-authorization",
            method: "GET",
        }, (res) => {
            expect(res.statusCode).toBe(401);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.error).toBe("Unauthorized: Missing token");
                done();
            });
        });
        req.end();
    });
    it("should respond with 200 for GET /secure-route-authorization with authorization", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/secure-route-authorization",
            method: "GET",
            headers: { Authorization: "Bearer secret-token" },
        }, (res) => {
            expect(res.statusCode).toBe(200);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.message).toBe("Route with authorization works!");
                done();
            });
        });
        req.end();
    });
    it("should respond with 401 for GET /secure-route-authorization with wrong authorization", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/secure-route-authorization",
            method: "GET",
            headers: { Authorization: "Bearer wrong-token" },
        }, (res) => {
            expect(res.statusCode).toBe(401);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.error).toBe("Unauthorized: Invalid token");
                done();
            });
        });
        req.end();
    });
});
describe("Error Handling", () => {
    let mockAPI;
    let server;
    beforeEach(() => {
        mockAPI = new index_1.default("testApp", 0, true, true);
        server = mockAPI.start();
    });
    afterEach((done) => {
        server.close(done);
    });
    it("should respond with 404 for GET /invalid-route", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/invalid-route",
            method: "GET",
        }, (res) => {
            expect(res.statusCode).toBe(404);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.error).toBe("Route not found");
                done();
            });
        });
        req.end();
    });
    it("should respond with 500 for GET /internal-server-error", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/internal-server-error",
            method: "GET",
        }, (res) => {
            expect(res.statusCode).toBe(500);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.error).toBe("Internal server error");
                done();
            });
        });
        req.end();
    });
    it("should respond with 500 for unauthorized method OPTIONS /health", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/health",
            method: "OPTIONS",
        }, (res) => {
            expect(res.statusCode).toBe(405);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.error).toBe("Method not allowed");
                done();
            });
        });
        req.end();
    });
});
describe("Validate CORS with specific origins", () => {
    let mockAPI;
    let server;
    beforeAll(() => {
        mockAPI = new index_1.default("testApp", 3001, ["http://localhost:3001"]);
        server = mockAPI.start();
    });
    afterAll((done) => {
        server.close(done);
    });
    it("should respond with valid CORS headers", (done) => {
        const req = http_1.default.request({
            hostname: "localhost",
            port: 3001,
            path: "/health",
            method: "GET",
            headers: { Origin: "http://localhost:3001" },
        }, (res) => {
            expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3001");
            done();
        });
        req.end();
    });
});
describe("Validate Custom Routes", () => {
    let mockAPI;
    let server;
    beforeAll(() => {
        mockAPI = new index_1.default("testApp", 0, true);
        mockAPI.addRoute({
            method: "GET",
            path: "/custom-route",
            response: { message: "Custom route works!" },
            status: 200,
        });
        server = mockAPI.start();
    });
    afterAll((done) => {
        mockAPI.stop();
        done();
    });
    it("should respond with 200 for GET /custom-route", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/custom-route",
            method: "GET",
        }, (res) => {
            expect(res.statusCode).toBe(200);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body.message).toBe("Custom route works!");
                done();
            });
        });
        req.end();
    });
});
describe("Validate Add Crud Routes with random data", () => {
    let mockAPI;
    let server;
    beforeAll(() => {
        mockAPI = new index_1.default("testApp", 0, true);
        mockAPI.addCrudRoutes({
            name: "users",
            interface: {
                id: "id",
                name: "",
                age: 0,
                email: "",
                isActive: false,
            },
            version: 1,
        });
        server = mockAPI.start();
    });
    afterAll((done) => {
        mockAPI.stop();
        done();
    });
    it("should create a user with POST", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/users/v1",
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }, (res) => {
            expect(res.statusCode).toBe(201);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body).not.toBeNull();
                done();
            });
        });
        req.end();
    });
    it("should read a user with GET", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/users/v1",
            method: "GET",
        }, (res) => {
            expect(res.statusCode).toBe(200);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body).not.toBeNull();
                done();
            });
        });
        req.end();
    });
    it("should update a user with PUT ", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/users/v1",
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        }, (res) => {
            expect(res.statusCode).toBe(200);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body).not.toBeNull();
                done();
            });
        });
        req.end();
    });
    it("should delete a user with DELETE ", (done) => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const req = http_1.default.request({
            hostname: "localhost",
            port: port,
            path: "/users/v1",
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }, (res) => {
            expect(res.statusCode).toBe(200);
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const body = JSON.parse(data);
                expect(body).not.toBeNull();
                done();
            });
        });
        req.end();
    });
});
