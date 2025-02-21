import express from "express";
interface MockAPIOptions {
    appName?: string;
    port?: number;
    cors?: string | string[] | boolean;
}
declare class MockAPI {
    readonly app: express.Express;
    readonly appName: string;
    readonly port: number;
    constructor(options?: MockAPIOptions);
    /**
     * Set up CORS based on the provided configuration
     * @param corsConfig CORS configuration (true for '*', array for specific URLs, false to disable)
     */
    private setupCors;
    /**
     * Set up default routes for the mock API
     */
    private setupDefaultRoutes;
    /**
     * Create middleware based on the type and value
     * @param middlewareType Type of middleware ('apiKey' or 'authorization')
     * @param middlewareValue Value to validate against (e.g., API key or token)
     */
    private createMiddleware;
    /**
     * Add a custom route with simplified logic
     * @param method HTTP method (e.g., GET, POST, PUT, DELETE, PATCH)
     * @param path The route path
     * @param requestData Optional request data to match (e.g., body or query params)
     * @param responseData The response data to send back
     * @param middlewareType Optional middleware type ('apiKey' or 'authorization')
     * @param middlewareValue Optional middleware value (e.g., API key or token)
     */
    addCustomRoute(method: string, path: string, requestData: any, responseData: any, middlewareType?: "apiKey" | "authorization", middlewareValue?: string): void;
    /**
     * Start the mock API server
     */
    start(): void;
}
export default MockAPI;
