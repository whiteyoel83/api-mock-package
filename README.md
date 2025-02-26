# MockCustomAPI

## Overview

mockCustomAPI is a lightweight Node.js package that allows developers to quickly set up a mock API for development, unit testing, or integration testing. It supports all CRUD operations and provides validation middleware for API keys and authorization tokens.

## Features

- Supports the fourth basics HTTP methods: `GET`, `POST`, `PUT`, `DELETE`.
- Ability to define custom routes with mock responses.
- Middleware support for API key and authorization validation.
- Built-in CRUD functionality for dynamic resources.
- CORS support for cross-origin requests.
- Easy-to-use constructor for quick setup.
- Built-in request logging for debugging.
- Custom middleware support for advanced request handling.

## Installation

```sh
npm install mock-custom-api
```

## Usage

### Initializing the Mock API Server

```typescript
import MockAPI from "mock-custom-api";

const mockAPI = new MockAPI("MyMockAPI", 4000, true, true);
```

- The first parameter (`'MyMockAPI'`) is the application name.
- The second parameter (`4000`) is the port number. if you put undefined, the server will start on a 3000 port.
- The third parameter (`true`) enables CORS for all origins. You can also pass an array of allowed origins.
- The fourth parameter (`true`) is to allow create some defaults endpoints.

### Adding Default Routes

This will generate the health endpoints automatically:

- `GET /health` - Retrieve 200 OK when the server is up and running

This will generate the following endpoints if the for parameter createDefaultRoutes is true:

- `POST /route-post` - Retrieve 200 Item created successfully
- `GET /route-get` - Retrieve 200 Item listed successfully
- `GET /invalid-route` - Retrieve 404 Route not found
- `GET /internal-server-error` - Retrieve 500 internal-server-error
- `PUT /route-update` - Retrieve 200 Item updated successfully
- `DELETE /route-delete` - Retrieve 200 Item deleted successfully
- `GET /secure-route-x-api-key` - Retrieve 200 Route with API key works!
- `GET /secure-route-authorization` - Retrieve 200 Route with authorization works!

### Adding Custom Routes

You can define custom API routes with predefined responses.

```typescript
mockAPI.addRoute({
  method: "GET",
  path: "/test",
  response: { message: "Test success" },
});
```

### Adding Custom Routes With Authentication Middleware

You can secure routes with API key or token-based authentication.

```typescript
mockAPI.addRoute({
  method: "GET",
  path: "/protected",
  response: { message: "Protected route" },
  validationType: "apiKey",
  validationValue: "my-secret-key",
});
```

- `validationType: 'apiKey'` ensures that requests must include `x-api-key: my-secret-key` in the headers.

```typescript
mockAPI.addRoute({
  method: "GET",
  path: "/secured",
  response: { message: "Protected route" },
  validationType: "authorization",
  validationValue: "secret-token",
});
```

- `validationType: 'authorization'` ensures that requests must include `authorization: secret-token` in the headers.

### Starting the Mock API Server

```typescript
mockAPI.start();
```

### Stopping the Mock API Server

```typescript
mockAPI.stop();
```

This starts the API server on the specified port.

### Example API Calls Using Fetch

```javascript
fetch("http://localhost:4000/test")
  .then((response) => response.json())
  .then((data) => console.log(data));

fetch("http://localhost:4000/protected", {
  headers: { "x-api-key": "my-secret-key" },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Running Tests

```sh
npm test
```

## License

MIT
