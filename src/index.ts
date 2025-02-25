import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";

interface MockRoute {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  body?: any;
  response: any;
  status?: number;
  validationType?: "apiKey" | "authorization" | "none";
  validationValue?: string;
}

class MockAPI {
  readonly app: Application;
  readonly port?: number;
  readonly routes: MockRoute[] = [];

  constructor(
    readonly appName: string,
    port: number = 3000,
    allowCors: string[] | boolean = true
  ) {
    this.app = express();
    this.port = port;
    this.app.use(express.json());
    if (allowCors) {
      this.app.use(
        cors(typeof allowCors === "boolean" ? {} : { origin: allowCors })
      );
    }
    this.app.use(bodyParser.json());
    this.setupDefaultRoutes();
    // this.app.all("*", (req: Request, res: Response) => {
    //   res.status(404).json({ error: "Route not found" });
    // });
  }

  private setupDefaultRoutes() {
    this.addCustomRoute({
      method: "GET",
      path: "/health",
      response: {
        message: "OK",
      },
      status: 200,
    });

    this.addCustomRoute({
      method: "GET",
      path: "/custom-route-get",
      response: {
        message: "Item listed successfully",
      },
      status: 200,
      validationType: "apiKey",
      validationValue: "secret-key",
    });

    this.addCustomRoute({
      method: "GET",
      path: "/invalid-route",
      response: {
        error: "Route not found",
      },
      status: 404,
    });

    this.addCustomRoute({
      method: "GET",
      path: "/internal-server-error",
      response: {
        error: "Internal server error",
      },
      status: 500,
    });

    this.addCustomRoute({
      method: "POST",
      path: "/custom-route-create",
      response: {
        message: "Item created successfully",
      },
      status: 201,
      validationType: "apiKey",
      validationValue: "secret-key",
    });

    this.addCustomRoute({
      method: "PUT",
      path: "/custom-route-update",
      response: {
        message: "Item updated successfully",
      },
      status: 200,
      validationType: "apiKey",
      validationValue: "secret-key",
    });

    this.addCustomRoute({
      method: "DELETE",
      path: "/custom-route-delete",
      response: {
        message: "Item deleted successfully",
      },
      status: 200,
      validationType: "apiKey",
      validationValue: "secret-key",
    });

    this.addCustomRoute({
      method: "GET",
      path: "/secure-route-x-api-key",
      response: {
        message: "Custom route with API key works!",
      },
      status: 200,
      validationType: "apiKey",
      validationValue: "secret-key",
    });

    this.addCustomRoute({
      method: "GET",
      path: "/secure-route-authorization",
      response: {
        message: "Custom route with authorization works!",
      },
      status: 200,
      validationType: "authorization",
      validationValue: "secret-token",
    });

    // this.app.all("*", (req, res) => {
    //   console.log(`Unhandled route: ${req.method} ${req.url}`);
    //   res.status(404).json({ error: "Route not found" });
    // });
  }

  private generateMiddleware(
    validationType?: string,
    validationValue?: string
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (validationType === "apiKey") {
        const apiKey = req.headers["x-api-key"];
        if (apiKey === validationValue) {
          next();
        } else {
          res.status(401).json({ error: "Unauthorized: Invalid API key" });
        }
      } else if (validationType === "authorization") {
        const authHeader = req.headers["authorization"];
        if (authHeader?.startsWith("Bearer ")) {
          const token = authHeader.split(" ")[1];
          if (token === validationValue) {
            next();
          } else {
            res.status(401).json({ error: "Unauthorized: Invalid token" });
          }
        } else {
          res.status(401).json({ error: "Unauthorized: Missing token" });
        }
      }
    };
  }

  public addCustomRoute(route: MockRoute): void {
    this.routes.push(route);
    const middleware =
      route.validationType && route.validationValue
        ? this.generateMiddleware(route.validationType, route.validationValue)
        : undefined;
    const requestHandler = (req: Request, res: Response) => {
      const status = Number(route.status);
      res.status(status).json(route.response);
    };
    const method = route.method.toLowerCase() as keyof Application;
    if (middleware) {
      this.app[method](route.path, middleware, requestHandler);
    } else {
      this.app[method](route.path, requestHandler);
    }
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`${this.appName} Mock API running on port ${this.port}`);
    });
  }
}

export default MockAPI;
