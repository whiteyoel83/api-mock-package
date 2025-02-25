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

const mockAPI = new MockAPI("MyMockAPI", 4000, true);
```

- The first parameter (`'MyMockAPI'`) is the application name.
- The second parameter (`4000`) is the port number. if you put undefined, the server will start on a 3000 port.
- The third parameter (`true`) enables CORS for all origins. You can also pass an array of allowed origins.

### Adding Custom Routes

You can define custom API routes with predefined responses.

```typescript
mockAPI.addCustomRoute({
  method: "GET",
  path: "/test",
  response: { message: "Test success" },
});
```

### Adding CRUD Routes Automatically

```typescript
mockAPI.addCRUDRoutes("users");
```

This will generate the following endpoints:

- `POST /users` - Create a new user
- `GET /users` - Retrieve all users
- `GET /users/:id` - Retrieve a user by ID
- `PUT /users/:id` - Update a user by ID
- `DELETE /users/:id` - Delete a user by ID

### Adding Authentication Middleware

You can secure routes with API key or token-based authentication.

```typescript
mockAPI.addCustomRoute({
  method: "GET",
  path: "/protected",
  response: { message: "Protected route" },
  validationType: "apiKey",
  validationValue: "my-secret-key",
});
```

- `validationType: 'apiKey'` ensures that requests must include `x-api-key: my-secret-key` in the headers.

### Handling Requests with Custom Middleware

```typescript
mockAPI.addCustomRoute({
  method: "POST",
  path: "/validate",
  response: { message: "Validated" },
  middleware: (req, res, next) => {
    if (!req.headers["x-custom-header"]) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  },
});
```

### Enabling Logging for Debugging

By default, the API logs incoming requests and responses.

```typescript
mockAPI.enableLogging(true);
```

### Starting the Mock API Server

```typescript
mockAPI.start();
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
