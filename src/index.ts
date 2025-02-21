import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";

// Define the type for a custom route
interface CustomRoute {
  method: string;
  path: string;
  requestData?: any; // Optional request data (e.g., body or query params)
  responseData: any; // Response data to send back
  middlewareType?: "apiKey" | "authorization"; // Optional middleware type
  middlewareValue?: string; // Optional middleware value (e.g., API key or token)
}

// Define the type for MockAPI options
interface MockAPIOptions {
  appName?: string; // Optional app name
  port?: number; // Optional port (default: 3000)
  cors?: string | string[] | boolean; // CORS configuration (true for '*', array for specific URLs, false to disable)
}

class MockAPI {
  readonly app: express.Express;
  readonly appName: string;
  readonly port: number;

  constructor(options: MockAPIOptions = {}) {
    this.app = express();
    this.appName = options.appName ?? "MockAPI"; // Default app name
    this.port = options.port ?? 3000; // Default port

    // Middleware
    this.setupCors(options.cors); // Set up CORS based on options
    this.app.use(bodyParser.json());

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
  private setupCors(corsConfig: string | string[] | boolean | undefined): void {
    if (corsConfig === true) {
      // Allow all origins
      this.app.use(cors());
    } else if (Array.isArray(corsConfig)) {
      // Allow specific origins
      this.app.use(
        cors({
          origin: corsConfig,
        })
      );
    } else if (typeof corsConfig === "string") {
      // Allow a single origin
      this.app.use(
        cors({
          origin: corsConfig,
        })
      );
    } else {
      // Disable CORS
      console.warn(
        "CORS is disabled. Requests from other origins may be blocked."
      );
    }
  }

  /**
   * Set up default routes for the mock API
   */
  private setupDefaultRoutes(): void {
    // GET /users
    this.addCustomRoute("GET", "/users", undefined, [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);

    // POST /login
    this.addCustomRoute(
      "POST",
      "/login",
      { username: "admin", password: "password" },
      {
        success: true,
        message: "Login successful",
      }
    );
  }

  /**
   * Create middleware based on the type and value
   * @param middlewareType Type of middleware ('apiKey' or 'authorization')
   * @param middlewareValue Value to validate against (e.g., API key or token)
   */
  private createMiddleware(
    middlewareType: "apiKey" | "authorization",
    middlewareValue: string
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req, res, next) => {
      if (middlewareType === "apiKey") {
        const apiKey = req.headers["x-api-key"];
        if (apiKey === middlewareValue) {
          next(); // Proceed to the main handler
        } else {
          res.status(401).json({ error: "Unauthorized: Invalid API key" });
        }
      } else if (middlewareType === "authorization") {
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.split(" ")[1];
          if (token === middlewareValue) {
            next(); // Proceed to the main handler
          } else {
            res.status(401).json({ error: "Unauthorized: Invalid token" });
          }
        } else {
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
  public addCustomRoute(
    method: string,
    path: string,
    requestData: any,
    responseData: any,
    middlewareType?: "apiKey" | "authorization",
    middlewareValue?: string
  ): void {
    const handler = (req: any, res: any) => {
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
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    };

    // Add the route to the Express app
    if (middlewareType && middlewareValue) {
      const middleware = this.createMiddleware(middlewareType, middlewareValue);
      this.app[
        method.toLowerCase() as "get" | "post" | "put" | "delete" | "patch"
      ](path, middleware, handler);
    } else {
      this.app[
        method.toLowerCase() as "get" | "post" | "put" | "delete" | "patch"
      ](path, handler);
    }
  }

  /**
   * Start the mock API server
   */
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(
        `${this.appName} server running at http://localhost:${this.port}`
      );
    });
  }
}

export default MockAPI;
