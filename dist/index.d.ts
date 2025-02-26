import http from "http";
interface MockRoute {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    body?: any;
    response: any;
    status?: number;
    validationType?: "apiKey" | "authorization" | "none";
    validationValue?: string;
}
declare class MockAPI {
    readonly appName: string;
    readonly allowCors: string[] | boolean;
    private port;
    private readonly routes;
    private server;
    constructor(appName: string, port?: number, allowCors?: string[] | boolean, createDefaultRoutes?: boolean);
    private setupInitialRoutes;
    private setupDefaultRoutes;
    private generateMiddleware;
    addRoute(route: MockRoute): void;
    private handleRequest;
    start(): http.Server;
    stop(): void;
}
export default MockAPI;
