"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
class MockAPI {
    constructor(appName, port = 3000, allowCors = true, createDefaultRoutes = false) {
        this.appName = appName;
        this.allowCors = allowCors;
        this.routes = [];
        this.server = null;
        this.port = port;
        this.origin = "";
        this.setupInitialRoutes();
        if (createDefaultRoutes) {
            this.setupDefaultRoutes();
        }
    }
    setupInitialRoutes() {
        this.addRoute({
            method: "GET",
            path: "/health",
            response: {
                message: "OK",
            },
            status: 200,
        });
    }
    setupDefaultRoutes() {
        this.addRoute({
            method: "GET",
            path: "/route-get",
            response: {
                data: [
                    { id: 1, name: "Item 1" },
                    { id: 2, name: "Item 2" },
                ],
                message: "Item listed successfully",
            },
            status: 200,
            validationType: "apiKey",
            validationValue: "secret-key",
        });
        this.addRoute({
            method: "GET",
            path: "/invalid-route",
            response: {
                error: "Route not found",
            },
            status: 404,
        });
        this.addRoute({
            method: "GET",
            path: "/internal-server-error",
            response: {
                error: "Internal server error",
            },
            status: 500,
        });
        this.addRoute({
            method: "POST",
            path: "/route-create",
            body: {
                id: "some-random-id",
                name: "some-random-name",
            },
            response: {
                data: {
                    id: "some-random-id",
                    name: "some-random-name",
                },
                message: "Item created successfully",
            },
            status: 201,
            validationType: "apiKey",
            validationValue: "secret-key",
        });
        this.addRoute({
            method: "PUT",
            path: "/route-update",
            body: {
                id: "some-random-id",
                name: "new-name",
            },
            response: {
                data: {
                    id: "some-random-id",
                    name: "new-name",
                },
                message: "Item updated successfully",
            },
            status: 200,
            validationType: "apiKey",
            validationValue: "secret-key",
        });
        this.addRoute({
            method: "DELETE",
            path: "/route-delete",
            response: {
                message: "Item deleted successfully",
            },
            status: 200,
            validationType: "apiKey",
            validationValue: "secret-key",
        });
        this.addRoute({
            method: "GET",
            path: "/secure-route-x-api-key",
            response: {
                message: "Route with API key works!",
            },
            status: 200,
            validationType: "apiKey",
            validationValue: "secret-key",
        });
        this.addRoute({
            method: "GET",
            path: "/secure-route-authorization",
            response: {
                message: "Route with authorization works!",
            },
            status: 200,
            validationType: "authorization",
            validationValue: "secret-token",
        });
    }
    generateMiddleware(validationType, validationValue) {
        return (req, res, next) => {
            const headers = req.headers;
            if (validationType === "apiKey") {
                const apiKey = headers["x-api-key"];
                if (apiKey === validationValue) {
                    next();
                }
                else {
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Unauthorized: Invalid API key" }));
                }
            }
            else if (validationType === "authorization") {
                const authHeader = headers["authorization"];
                if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) {
                    const token = authHeader.split(" ")[1];
                    if (token === validationValue) {
                        next();
                    }
                    else {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Unauthorized: Invalid token" }));
                    }
                }
                else {
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Unauthorized: Missing token" }));
                }
            }
            else {
                next();
            }
        };
    }
    addRoute(route) {
        this.routes.push(route);
    }
    addCrudRoutes(options) {
        const { name, interface: interfaceDefinition, version, securedType, } = options;
        const versionedPath = `/${name}/v${version}`;
        const generateRandomData = () => {
            const randomItem = {};
            for (const key in interfaceDefinition) {
                const type = typeof interfaceDefinition[key];
                switch (type) {
                    case "string":
                        randomItem[key] = `Random ${key}-${Math.random()
                            .toString(36)
                            .substring(2, 8)}`;
                        break;
                    case "number":
                        randomItem[key] = Math.floor(Math.random() * 1000);
                        break;
                    case "boolean":
                        randomItem[key] = (Math.random() > 0.5);
                        break;
                    default:
                        randomItem[key] = interfaceDefinition[key];
                }
            }
            return randomItem;
        };
        const routes = [
            {
                method: "GET",
                path: `${versionedPath}`,
                response: {
                    message: `${name} list retrieved successfully`,
                    body: Array(10).fill(null).map(generateRandomData),
                },
                status: 200,
                validationType: securedType !== undefined && securedType !== "none"
                    ? securedType
                    : undefined,
                validationValue: securedType !== undefined && securedType !== "none"
                    ? "custom-key"
                    : undefined,
            },
            {
                method: "POST",
                path: `${versionedPath}`,
                response: {
                    message: `${name} created successfully`,
                    body: generateRandomData(),
                },
                status: 201,
                validationType: securedType !== undefined && securedType !== "none"
                    ? securedType
                    : undefined,
                validationValue: securedType !== undefined && securedType !== "none"
                    ? "custom-key"
                    : undefined,
            },
            {
                method: "PUT",
                path: `${versionedPath}`,
                response: {
                    message: `${name} updated successfully`,
                    body: generateRandomData(),
                },
                status: 200,
                validationType: securedType !== undefined && securedType !== "none"
                    ? securedType
                    : undefined,
                validationValue: securedType !== undefined && securedType !== "none"
                    ? "custom-key"
                    : undefined,
            },
            {
                method: "DELETE",
                path: `${versionedPath}`,
                response: {
                    message: `${name} deleted successfully`,
                },
                status: 200,
                validationType: securedType !== undefined && securedType !== "none"
                    ? securedType
                    : undefined,
                validationValue: securedType !== undefined && securedType !== "none"
                    ? "custom-key"
                    : undefined,
            },
            {
                method: "PATCH",
                path: `${versionedPath}`,
                response: {
                    message: `${name} patched successfully`,
                    body: generateRandomData(),
                },
                status: 200,
                validationType: securedType !== undefined && securedType !== "none"
                    ? securedType
                    : undefined,
                validationValue: securedType !== undefined && securedType !== "none"
                    ? "custom-key"
                    : undefined,
            },
            {
                method: "OPTIONS",
                path: `${versionedPath}`,
                response: {
                    message: `${name} options retrieved successfully`,
                },
                status: 200,
                validationType: securedType !== undefined && securedType !== "none"
                    ? securedType
                    : undefined,
                validationValue: securedType !== undefined && securedType !== "none"
                    ? "custom-key"
                    : undefined,
            },
            {
                method: "HEAD",
                path: `${versionedPath}`,
                response: {
                    message: `${name} head retrieved successfully`,
                },
                status: 200,
                validationType: securedType !== undefined && securedType !== "none"
                    ? securedType
                    : undefined,
                validationValue: securedType !== undefined && securedType !== "none"
                    ? "custom-key"
                    : undefined,
            },
        ];
        routes.forEach((route) => this.addRoute(route));
    }
    handleRequest(req, res) {
        const { method, url } = req;
        const route = this.routes.find((r) => r.method === method && r.path === url);
        if (route) {
            const middleware = route.validationType && route.validationValue
                ? this.generateMiddleware(route.validationType, route.validationValue)
                : undefined;
            const requestHandler = () => {
                var _a;
                res.writeHead((_a = route.status) !== null && _a !== void 0 ? _a : 200, {
                    "Content-Type": "application/json",
                });
                res.end(JSON.stringify(route.response));
            };
            if (middleware) {
                middleware(req, res, requestHandler);
            }
            else {
                requestHandler();
            }
        }
        else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Route not found" }));
        }
    }
    start() {
        this.server = http_1.default.createServer((req, res) => {
            if (this.allowCors) {
                if (typeof this.allowCors === "boolean") {
                    this.origin = "*";
                }
                else if (Array.isArray(this.allowCors)) {
                    this.origin = this.allowCors.join(", ");
                }
                res.setHeader("Access-Control-Allow-Origin", this.origin);
                res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
                res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
                res.setHeader("Access-Control-Allow-Credentials", "true");
            }
            if (req.method === "OPTIONS" ||
                req.method === "HEAD" ||
                req.method === "PATCH") {
                res.writeHead(405, {
                    "Content-Type": "application/json",
                });
                res.end(JSON.stringify({ error: "Method not allowed" }));
                return;
            }
            this.handleRequest(req, res);
        });
        this.server.listen(this.port, () => {
            var _a;
            const address = (_a = this.server) === null || _a === void 0 ? void 0 : _a.address();
            const port = typeof address === "object" && address ? address.port : this.port;
            console.log(`${this.appName} Mock API running on port ${port}`);
        });
        this.server.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.warn(`Port ${this.port} is already in use. Trying another port...`);
                this.port += 1;
                this.start();
            }
            else {
                console.error("Server error:", err);
            }
        });
        return this.server;
    }
    stop() {
        if (this.server) {
            this.server.close(() => {
                console.log("Server stopped.");
            });
        }
    }
}
exports.default = MockAPI;
