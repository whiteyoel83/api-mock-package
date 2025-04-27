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
interface CrudRouteOptions<T> {
    name: string;
    interface: T;
    version: number;
    securedType?: "apiKey" | "authorization" | "none";
}
declare class MockAPI {
    readonly appName: string;
    readonly allowCors: string[] | boolean;
    private port;
    private readonly routes;
    private server;
    private origin;
    constructor(appName: string, port?: number, allowCors?: string[] | boolean, createDefaultRoutes?: boolean);
    private setupInitialRoutes;
    private setupDefaultRoutes;
    private generateMiddleware;
    addRoute(route: MockRoute): void;
    addCrudRoutes<T extends Record<string, any>>(options: CrudRouteOptions<T>): void;
    private handleRequest;
    start(): http.Server;
    stop(): void;
}
export default MockAPI;
