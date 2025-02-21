"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
class MockAPI {
    constructor(options = {}) {
        var _a, _b;
        this.app = (0, express_1.default)();
        this.appName = (_a = options.appName) !== null && _a !== void 0 ? _a : "MockAPI"; // Default app name
        this.port = (_b = options.port) !== null && _b !== void 0 ? _b : 3000; // Default port
        // Middleware
        this.setupCors(options.cors); // Set up CORS based on options
        this.app.use(body_parser_1.default.json());
        // Default routes
        this.setupDefaultRoutes();
        // Default route for unmatched paths
        this.app.all("*", (req, res) => {
            res.status(404).json({ error: "Route not found" });
        });
    }
    /**
     * Set up CORS based on the provided configuration
     * @param corsConfig CORS configuration (true for '*', array for specific URLs, false to disable)
     */
    setupCors(corsConfig) {
        if (corsConfig === true) {
            // Allow all origins
            this.app.use((0, cors_1.default)());
        }
        else if (Array.isArray(corsConfig)) {
            // Allow specific origins
            this.app.use((0, cors_1.default)({
                origin: corsConfig,
            }));
        }
        else if (typeof corsConfig === "string") {
            // Allow a single origin
            this.app.use((0, cors_1.default)({
                origin: corsConfig,
            }));
        }
        else {
            // Disable CORS
            console.warn("CORS is disabled. Requests from other origins may be blocked.");
        }
    }
    /**
     * Set up default routes for the mock API
     */
    setupDefaultRoutes() {
        // GET /users
        this.addCustomRoute("GET", "/users", undefined, [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
        ]);
        // POST /login
        this.addCustomRoute("POST", "/login", { username: "admin", password: "password" }, {
            success: true,
            message: "Login successful",
        });
    }
    /**
     * Create middleware based on the type and value
     * @param middlewareType Type of middleware ('apiKey' or 'authorization')
     * @param middlewareValue Value to validate against (e.g., API key or token)
     */
    createMiddleware(middlewareType, middlewareValue) {
        return (req, res, next) => {
            if (middlewareType === "apiKey") {
                const apiKey = req.headers["x-api-key"];
                if (apiKey === middlewareValue) {
                    next(); // Proceed to the main handler
                }
                else {
                    res.status(401).json({ error: "Unauthorized: Invalid API key" });
                }
            }
            else if (middlewareType === "authorization") {
                const authHeader = req.headers["authorization"];
                if (authHeader && authHeader.startsWith("Bearer ")) {
                    const token = authHeader.split(" ")[1];
                    if (token === middlewareValue) {
                        next(); // Proceed to the main handler
                    }
                    else {
                        res.status(401).json({ error: "Unauthorized: Invalid token" });
                    }
                }
                else {
                    res.status(401).json({ error: "Unauthorized: Missing token" });
                }
            }
        };
    }
    /**
     * Add a custom route with simplified logic
     * @param method HTTP method (e.g., GET, POST, PUT, DELETE, PATCH)
     * @param path The route path
     * @param requestData Optional request data to match (e.g., body or query params)
     * @param responseData The response data to send back
     * @param middlewareType Optional middleware type ('apiKey' or 'authorization')
     * @param middlewareValue Optional middleware value (e.g., API key or token)
     */
    addCustomRoute(method, path, requestData, responseData, middlewareType, middlewareValue) {
        const handler = (req, res) => {
            try {
                // Check if request data matches (if provided)
                if (requestData) {
                    const reqData = req.method === "GET" ? req.query : req.body;
                    const isMatch = Object.keys(requestData).every((key) => {
                        return reqData[key] == requestData[key]; // Loose equality to allow string/number matching
                    });
                    if (!isMatch) {
                        return res.status(400).json({ error: "Invalid request data" });
                    }
                }
                // Send the response data
                res.json(responseData);
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        };
        // Add the route to the Express app
        if (middlewareType && middlewareValue) {
            const middleware = this.createMiddleware(middlewareType, middlewareValue);
            this.app[method.toLowerCase()](path, middleware, handler);
        }
        else {
            this.app[method.toLowerCase()](path, handler);
        }
    }
    /**
     * Start the mock API server
     */
    start() {
        this.app.listen(this.port, () => {
            console.log(`${this.appName} server running at http://localhost:${this.port}`);
        });
    }
}
exports.default = MockAPI;
